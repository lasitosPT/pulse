import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plan } from '@/generated/prisma/enums'
import { PLAN_ORDER, PLANS } from '@/lib/billing/plans'
import { createCheckoutSessionAction } from '@/server/actions/billing'

export function PlanCards({
  currentPlan,
  organizationId,
  isOwner,
  billingConfigured,
}: {
  currentPlan: Plan
  organizationId: string
  isOwner: boolean
  billingConfigured: boolean
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PLAN_ORDER.map((plan) => {
        const config = PLANS[plan]
        const isCurrent = plan === currentPlan
        const canUpgrade = plan !== Plan.FREE && !isCurrent && isOwner && billingConfigured

        return (
          <Card key={plan} className={isCurrent ? 'border-primary' : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{config.name}</CardTitle>
                {isCurrent && <Badge variant="primary">Current</Badge>}
              </div>
              <p className="text-2xl font-bold">{config.priceLabel}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {config.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="text-success size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {canUpgrade && (
                <form action={createCheckoutSessionAction.bind(null, organizationId, plan)}>
                  <Button type="submit" className="w-full">
                    Upgrade to {config.name}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
