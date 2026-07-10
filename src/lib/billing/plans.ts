import { Plan } from '@/generated/prisma/enums'

export type PlanConfig = {
  id: Plan
  name: string
  priceLabel: string
  monitorLimit: number
  minIntervalSeconds: number
  /** Env var holding the Stripe price id, or null for the free plan. */
  priceEnvKey: string | null
  features: string[]
}

export const PLANS: Record<Plan, PlanConfig> = {
  [Plan.FREE]: {
    id: Plan.FREE,
    name: 'Free',
    priceLabel: '$0',
    monitorLimit: 3,
    minIntervalSeconds: 300,
    priceEnvKey: null,
    features: ['3 monitors', '5-minute checks', 'Email alerts', 'Public status page'],
  },
  [Plan.PRO]: {
    id: Plan.PRO,
    name: 'Pro',
    priceLabel: '$19/mo',
    monitorLimit: 25,
    minIntervalSeconds: 60,
    priceEnvKey: 'STRIPE_PRICE_PRO',
    features: ['25 monitors', '1-minute checks', 'Email + webhook alerts', 'Incident history'],
  },
  [Plan.BUSINESS]: {
    id: Plan.BUSINESS,
    name: 'Business',
    priceLabel: '$99/mo',
    monitorLimit: 200,
    minIntervalSeconds: 30,
    priceEnvKey: 'STRIPE_PRICE_BUSINESS',
    features: ['200 monitors', '30-second checks', 'Priority support', 'Everything in Pro'],
  },
}

export const PLAN_ORDER: Plan[] = [Plan.FREE, Plan.PRO, Plan.BUSINESS]

export function planFor(plan: Plan): PlanConfig {
  return PLANS[plan]
}

/** Whether an organization on `plan` may add another monitor. */
export function canAddMonitor(plan: Plan, currentCount: number): boolean {
  return currentCount < PLANS[plan].monitorLimit
}
