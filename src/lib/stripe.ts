import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

if (!stripeKey) {
  console.warn('[Stripe] STRIPE_SECRET_KEY não configurado. Pagamentos não funcionarão.')
}

export const stripe = new Stripe(stripeKey ?? 'sk_test_placeholder_dev_only', {
  apiVersion: '2024-06-20',
  typescript: true,
})
