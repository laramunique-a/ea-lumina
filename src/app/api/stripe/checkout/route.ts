export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'PACIENTE') {
      return NextResponse.json({ success: false, error: 'Acesso restrito a pacientes' }, { status: 403 })
    }

    const body = await request.json()
    const { appointmentId } = body

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: 'ID do agendamento não fornecido' }, { status: 400 })
    }

    // Busca o agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        therapist: {
          include: { paymentDetails: true },
        },
        patient: true,
      },
    })

    if (!appointment || appointment.patient.userId !== session.sub) {
      return NextResponse.json({ success: false, error: 'Agendamento inválido' }, { status: 404 })
    }

    if (appointment.status !== 'AGUARDANDO_PAGAMENTO') {
      return NextResponse.json({ success: false, error: 'Este agendamento não está aguardando pagamento' }, { status: 400 })
    }

    // Verificar TTL de 2h
    const PAYMENT_TTL_MS = 2 * 60 * 60 * 1000
    const expiresAt = new Date(appointment.createdAt.getTime() + PAYMENT_TTL_MS)
    if (new Date() > expiresAt) {
      return NextResponse.json({ success: false, error: 'O prazo para pagamento desta pré-reserva expirou. Por favor, faça um novo agendamento.' }, { status: 400 })
    }

    // Se já existe um PaymentIntent (retomada de pagamento), retornar o clientSecret existente
    if (appointment.stripePaymentIntentId) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(appointment.stripePaymentIntentId)
        if (existingIntent.status === 'requires_payment_method' || existingIntent.status === 'requires_confirmation' || existingIntent.status === 'requires_action') {
          return NextResponse.json({
            success: true,
            clientSecret: existingIntent.client_secret,
            paymentIntentId: existingIntent.id,
            resumed: true,
          })
        }
        // Se o intent foi cancelado ou expirou, vai criar um novo abaixo
      } catch (e) {
        // Intent não encontrado, cria um novo
      }
    }


    const stripeAccountId = appointment.therapist.paymentDetails?.stripeAccountId
    if (!stripeAccountId) {
      return NextResponse.json({ 
        success: false, 
        error: 'O terapeuta ainda não configurou o recebimento financeiro. Tente novamente mais tarde.' 
      }, { status: 400 })
    }

    // Calcular valores
    const priceNumber = Number(appointment.price)
    
    // Stripe exige mínimo de 50 centavos de Dólar/Euro e 2.00 BRL
    const currencyUpper = appointment.currency.toUpperCase()
    const minLimit = currencyUpper === 'BRL' ? 2 : 0.5
    if (priceNumber < minLimit) {
      return NextResponse.json({ 
        success: false, 
        error: `O valor da sessão deste terapeuta está zerado ou abaixo do limite de processamento (${currencyUpper} ${minLimit.toFixed(2)}).`
      }, { status: 400 })
    }

    // Obter taxa da plataforma (fallback 10%)
    const config = await prisma.platformConfig.findFirst()
    const commissionRate = config ? Number(config.commissionRate) : 10.0

    
    // Calcula as taxas
    const platformCommission = (priceNumber * commissionRate) / 100

    // Converte para centavos para a Stripe
    const amountInCents = Math.round(priceNumber * 100)
    const applicationFeeInCents = Math.round(platformCommission * 100)

    // Cria/Busca Cliente Stripe
    let stripeCustomerId = appointment.patient.stripeCustomerId
    if (!stripeCustomerId) {
      const user = await prisma.user.findUnique({ where: { id: session.sub } })
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.name,
      })
      stripeCustomerId = customer.id
      
      // Salva cliente no PatientProfile
      await prisma.patientProfile.update({
        where: { id: appointment.patient.id },
        data: { stripeCustomerId },
      })
    }

    // Verifica se a conta do terapeuta está totalmente configurada e ativa na Stripe
    const account = await stripe.accounts.retrieve(stripeAccountId)
    if (account.capabilities?.transfers !== 'active') {
      return NextResponse.json({ 
        success: false, 
        error: 'Este terapeuta ainda não concluiu a configuração bancária para receber pagamentos. Por favor, tente novamente mais tarde ou entre em contato com o suporte.' 
      }, { status: 400 })
    }

    // Gera o PaymentIntent com split usando transfer_data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: appointment.currency.toLowerCase(),
      customer: stripeCustomerId,
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: stripeAccountId,
      },
      application_fee_amount: applicationFeeInCents,
      metadata: {
        appointmentId: appointment.id,
      },
    })

    // Salvar IntentID no bd para rastreio
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        commissionRate: commissionRate,
        commission: platformCommission,
        platformRevenue: platformCommission,
        therapistNet: priceNumber - platformCommission,
      },
    })

    return NextResponse.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('[STRIPE CHECKOUT ERROR]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno ao processar checkout' },
      { status: 500 }
    )
  }
}
