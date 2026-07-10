'use server'

import { redirect } from 'next/navigation'
import { Plan, Role } from '@/generated/prisma/enums'
import { currentUserHasOrgRole } from '@/lib/auth/authz'
import { PLANS } from '@/lib/billing/plans'
import { stripe } from '@/lib/billing/stripe'
import { prisma } from '@/lib/db'

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

export async function createCheckoutSessionAction(organizationId: string, plan: Plan) {
  if (!stripe) return
  if (!(await currentUserHasOrgRole(organizationId, Role.OWNER))) return

  const priceEnvKey = PLANS[plan].priceEnvKey
  const priceId = priceEnvKey ? process.env[priceEnvKey] : undefined
  if (!priceId) return

  const organization = await prisma.organization.findUnique({ where: { id: organizationId } })
  if (!organization) return

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer: organization.stripeCustomerId ?? undefined,
    client_reference_id: organizationId,
    metadata: { organizationId, plan },
    subscription_data: { metadata: { organizationId, plan } },
    success_url: `${appUrl()}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl()}/dashboard/billing?checkout=cancelled`,
  })

  if (session.url) redirect(session.url)
}

export async function createPortalSessionAction(organizationId: string) {
  if (!stripe) return
  if (!(await currentUserHasOrgRole(organizationId, Role.OWNER))) return

  const organization = await prisma.organization.findUnique({ where: { id: organizationId } })
  if (!organization?.stripeCustomerId) return

  const session = await stripe.billingPortal.sessions.create({
    customer: organization.stripeCustomerId,
    return_url: `${appUrl()}/dashboard/billing`,
  })

  redirect(session.url)
}
