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

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: currency || 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
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
