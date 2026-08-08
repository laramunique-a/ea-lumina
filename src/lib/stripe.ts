import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY || 'dummy_stripe_key_for_build'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY não configurado. Pagamentos não funcionarão.')
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-06-20',
  typescript: true,
})
