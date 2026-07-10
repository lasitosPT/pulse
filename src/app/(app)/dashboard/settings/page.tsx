import type { Metadata } from 'next'
import { AlertChannelForm } from '@/components/alerts/alert-channel-form'
import { AlertChannelList } from '@/components/alerts/alert-channel-list'
import { Role } from '@/generated/prisma/enums'
import { hasRole } from '@/lib/auth/rbac'
import { getUserOrganizations, requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const user = await requireUser()
  const organizations = await getUserOrganizations(user.id)
  const organization = organizations[0]

  if (!organization) {
    return <p className="text-muted-foreground">No organization found for your account.</p>
  }

  const role = organization.memberships[0]?.role
  const canManage = role ? hasRole(role, Role.ADMIN) : false
  const channels = await prisma.alertChannel.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Get notified by email or webhook when an incident opens or resolves.
        </p>
      </div>

      {canManage && <AlertChannelForm organizationId={organization.id} />}

      <AlertChannelList channels={channels} canManage={canManage} />
    </div>
  )
}
