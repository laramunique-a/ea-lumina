import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { amount, currency, metadata } = await req.json()

    if (!process.env.STRIPE_SECRET_KEY || 
        process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || 
        process.env.STRIPE_SECRET_KEY.includes('...')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sua chave STRIPE_SECRET_KEY no .env ainda contém "..." ou é inválida. Substitua pelo valor real (ex: sk_test_51P...) que você encontra no Dashboard do Stripe.' 
      }, { status: 400 })
    }

    if (!amount) {
      return NextResponse.json({ success: false, error: 'Amount is required' }, { status: 400 })
    }

    const therapistId = metadata?.therapistId
    if (!therapistId) {
       return NextResponse.json({ success: false, error: 'therapistId is required in metadata' }, { status: 400 })
    }

    // Buscar a conta Stripe do terapeuta e taxa da plataforma
    const [therapist, config] = await Promise.all([
      prisma.therapistProfile.findUnique({
        where: { id: therapistId },
        include: { paymentDetails: true },
      }),
      prisma.platformConfig.findFirst()
    ])

    const stripeAccountId = therapist?.paymentDetails?.stripeAccountId
    if (!stripeAccountId) {
      return NextResponse.json({ 
        success: false, 
        error: 'O terapeuta ainda não configurou o recebimento financeiro. Tente novamente mais tarde.' 
      }, { status: 400 })
    }

    // Calcula as taxas (Amount que vem da UI já é o valor final)
    const commissionRate = config ? Number(config.commissionRate) : 10.0
    const platformCommission = (amount * commissionRate) / 100
    const applicationFeeInCents = Math.round(platformCommission * 100)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: currency || 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: stripeAccountId,
      },
      application_fee_amount: applicationFeeInCents,
      metadata: metadata || {},
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err: any) {
    console.error('[STRIPE INTENT ERROR]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
