import Stripe from 'stripe'

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2026-02-25.clover' })
}

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    features: ['10 hires/month', '5 states', 'Email support', 'Federal compliance'],
    hiresPerMonth: 10,
    statesIncluded: 5
  },
  growth: {
    name: 'Growth',
    price: 79,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID || '',
    features: ['50 hires/month', 'All 50 states + DC', 'Priority support', 'Document generation', 'Digital signatures'],
    hiresPerMonth: 50,
    statesIncluded: 51
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    features: ['Unlimited hires', 'Custom policies', 'API access', 'Dedicated support', 'Audit trail export', 'SSO'],
    hiresPerMonth: -1,
    statesIncluded: 51
  }
}
