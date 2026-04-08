import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Use a temporary key or a warning during development if key not found
  console.warn('STRIPE_SECRET_KEY is not defined in .env')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16', // or latest
  typescript: true,
})
