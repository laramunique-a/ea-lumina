import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { WhatsAppService } from '@/lib/whatsapp/service'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET')
    }
    
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any
        
        const appointmentId = paymentIntent.metadata?.appointmentId
        
        let appointment = null
        if (appointmentId) {
          appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { therapist: true, patient: { include: { user: true } } }
          })
        } else {
          appointment = await prisma.appointment.findFirst({
            where: { stripePaymentIntentId: paymentIntent.id },
            include: { therapist: true, patient: { include: { user: true } } }
          })
        }

        if (!appointment) {
          console.error(`[Stripe Webhook] Agendamento não encontrado para o Payment Intent ${paymentIntent.id}`)
          break
        }

        // Se já foi processado (status PENDENTE ou CONFIRMADO)
        if (['PENDENTE', 'CONFIRMADO'].includes(appointment.status)) {
          console.log(`[Stripe Webhook] Agendamento ${appointment.id} já estava processado. Status atual: ${appointment.status}`)
          break
        }

        // Verificar conflitos de horário (double booking) com agendamentos já pagos/confirmados
        const dateObj = new Date(appointment.date)
        const durationMinutes = appointment.durationMinutes
        const dateObjStartMs = dateObj.getTime()
        const dateObjEndMs = dateObjStartMs + durationMinutes * 60 * 1000
        const dateStr = dateObj.toISOString().split('T')[0]

        const dayAppointments = await prisma.appointment.findMany({
          where: {
            therapistId: appointment.therapistId,
            status: { in: ['PENDENTE', 'CONFIRMADO'] },
            id: { not: appointment.id },
            date: {
              gte: new Date(`${dateStr}T00:00:00`),
              lte: new Date(`${dateStr}T23:59:59`),
            },
          },
          select: {
            id: true,
            date: true,
            durationMinutes: true,
          },
        })

        const hasConflict = dayAppointments.some((apt) => {
          const bookedStartMs = apt.date.getTime()
          const bookedEndMs = bookedStartMs + apt.durationMinutes * 60 * 1000
          return dateObjStartMs < bookedEndMs && bookedStartMs < dateObjEndMs
        })

        if (hasConflict) {
          console.log(`[Stripe Webhook] Conflito de horário detectado para o agendamento ${appointment.id}. Realizando estorno automático.`)
          
          await prisma.$transaction(async (tx) => {
            // Cancelar agendamento por conflito
            await tx.appointment.update({
              where: { id: appointment.id },
              data: {
                status: 'CANCELADO',
                cancelReason: 'Conflito de horário: Outro cliente concluiu o pagamento primeiro. Estorno automático realizado.',
              },
            })

            // Restaurar crédito do pacote se houver
            if (appointment.patientPackageId) {
              await tx.patientPackage.update({
                where: { id: appointment.patientPackageId },
                data: { remainingSessions: { increment: 1 } },
              })
            }
          })

          // Realizar estorno no Stripe
          const stripePaymentIntentId = appointment.stripePaymentIntentId || paymentIntent.id
          if (stripePaymentIntentId) {
            const refundAmount = Number(appointment.price)
            const amountInCents = Math.round(refundAmount * 100)
            
            await stripe.refunds.create({
              payment_intent: stripePaymentIntentId,
              amount: amountInCents,
              reverse_transfer: true,
              refund_application_fee: true,
            })
            
            await prisma.appointment.update({
              where: { id: appointment.id },
              data: { refundAmount: refundAmount },
            })
          }
          break
        }

        // Sem conflito -> Confirmar o pagamento
        const updatedAppointment = await prisma.appointment.update({
          where: { id: appointment.id },
          data: { status: 'PENDENTE' },
        })

        console.log(`[Stripe Webhook] Agendamento ${appointment.id} pago com sucesso. Status: AGUARDANDO_PAGAMENTO → PENDENTE.`)

        // Notificar terapeuta e paciente via WhatsApp APENAS após pagamento confirmado
        void WhatsAppService.notifyNewAppointment(updatedAppointment.id).catch((err) => {
          console.error('[WhatsApp Webhook Notification Error]', err)
        })
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as any
        console.log(`[Stripe Webhook] Pagamento falhou para intent ${failedIntent.id}`)
        // Não cancelamos automaticamente — o paciente pode tentar de novo dentro do TTL de 2h
        break;

      case 'account.updated':
        // Notifica o terapeuta caso a conta tenha sido validada
        const account = event.data.object as any
        if (account.charges_enabled) {
           console.log(`[Stripe Webhook] Conta ${account.id} agora está pronta para receber cobranças.`)
        }
        break;

      default:
        console.log(`[Stripe Webhook] Evento não tratado (${event.type})`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[STRIPE WEBHOOK EVENT PROCESSING ERROR]', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
