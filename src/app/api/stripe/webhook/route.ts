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
        
        let updatedAppointment = null

        if (appointmentId) {
          updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'PENDENTE' },
          })
          console.log(`[Stripe Webhook] Agendamento ${appointmentId} pago com sucesso. Status: AGUARDANDO_PAGAMENTO → PENDENTE.`)
        } else {
          // Fallback: buscar pelo stripePaymentIntentId
          updatedAppointment = await prisma.appointment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { status: 'PENDENTE' },
          }).catch(() => null)
        }

        // Notificar terapeuta e paciente via WhatsApp APENAS após pagamento confirmado
        if (updatedAppointment?.id) {
          void WhatsAppService.notifyNewAppointment(updatedAppointment.id).catch((err) => {
            console.error('[WhatsApp Webhook Notification Error]', err)
          })
        }
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
