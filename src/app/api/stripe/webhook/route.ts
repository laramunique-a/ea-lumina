import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

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
        
        // Atualizar agendamento localmente
        const appointmentId = paymentIntent.metadata?.appointmentId
        
        if (appointmentId) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CONFIRMADO' },
          })
          console.log(`[Stripe Webhook] Agendamento ${appointmentId} confirmado com sucesso.`)
        } else {
           // Fallback: buscar o appointment pelo intentId se o metadata sumir por algum motivo
           await prisma.appointment.update({
             where: { stripePaymentIntentId: paymentIntent.id },
             data: { status: 'CONFIRMADO' },
           })
        }
        break;

      case 'account.updated':
        // Notifica o terapeuta caso a conta tenha sigo validada
        const account = event.data.object as any
        if (account.charges_enabled) {
           console.log(`[Stripe Webhook] Conta ${account.id} agora está pronta para receber cobranças.`)
           // (Opcional) Poderíamos enviar um e-mail com essa notificação
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
