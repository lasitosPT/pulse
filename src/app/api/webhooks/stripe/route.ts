import type Stripe from 'stripe'
import { Plan } from '@/generated/prisma/enums'
import { stripe } from '@/lib/billing/stripe'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/** Stripe webhook: keeps an organization's plan and subscription state in sync. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return new Response('Billing not configured', { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const payload = await request.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const organizationId =
      session.metadata?.organizationId ?? session.client_reference_id ?? undefined
    const plan = session.metadata?.plan as Plan | undefined

    if (organizationId && session.customer) {
      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: session.subscription ? String(session.subscription) : null,
          plan: plan ?? undefined,
          subscriptionStatus: 'active',
        },
      })
    }
  } else if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription
    const organizationId = subscription.metadata?.organizationId
    const plan = subscription.metadata?.plan as Plan | undefined

    if (organizationId) {
      const cancelled =
        event.type === 'customer.subscription.deleted' || subscription.status === 'canceled'
      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          subscriptionStatus: subscription.status,
          plan: cancelled ? Plan.FREE : (plan ?? undefined),
        },
      })
    }
  }

  return Response.json({ received: true })
}
