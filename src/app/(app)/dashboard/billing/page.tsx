import type { Metadata } from 'next'
import { PlanCards } from '@/components/billing/plan-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Role } from '@/generated/prisma/enums'
import { getUserOrganizations, requireUser } from '@/lib/auth/session'
import { planFor } from '@/lib/billing/plans'
import { isBillingConfigured } from '@/lib/billing/stripe'
import { prisma } from '@/lib/db'
import { createPortalSessionAction } from '@/server/actions/billing'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const user = await requireUser()
  const organizations = await getUserOrganizations(user.id)
  const organization = organizations[0]

  if (!organization) {
    return <p className="text-muted-foreground">No organization found for your account.</p>
  }

  const isOwner = organization.memberships[0]?.role === Role.OWNER
  const record = await prisma.organization.findUniqueOrThrow({
    where: { id: organization.id },
    select: {
      plan: true,
      stripeCustomerId: true,
      subscriptionStatus: true,
      _count: { select: { monitors: true } },
    },
  })
  const current = planFor(record.plan)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your plan and usage.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Current plan</p>
            <p className="text-lg font-semibold">{current.name}</p>
            <p className="text-muted-foreground text-sm">
              {record._count.monitors} of {current.monitorLimit} monitors used
            </p>
          </div>
          {record.stripeCustomerId && isOwner && isBillingConfigured && (
            <form action={createPortalSessionAction.bind(null, organization.id)}>
              <Button variant="outline" type="submit">
                Manage subscription
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {!isBillingConfigured && (
        <p className="text-muted-foreground text-sm">
          Billing is not configured in this environment — set your Stripe keys to enable checkout.
        </p>
      )}

      <PlanCards
        currentPlan={record.plan}
        organizationId={organization.id}
        isOwner={isOwner}
        billingConfigured={isBillingConfigured}
      />
    </div>
  )
}
