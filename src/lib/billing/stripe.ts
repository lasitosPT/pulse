import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

/** Stripe client, or null when billing is not configured in this environment. */
export const stripe = key ? new Stripe(key) : null

export const isBillingConfigured = Boolean(key)
