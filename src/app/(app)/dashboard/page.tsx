import type { Metadata } from 'next'
import { IncidentList } from '@/components/incidents/incident-list'
import { AddMonitorForm } from '@/components/monitors/add-monitor-form'
import { MonitorList } from '@/components/monitors/monitor-list'
import { LiveRefresh } from '@/components/realtime/live-refresh'
import { Badge } from '@/components/ui/badge'
import { Role } from '@/generated/prisma/enums'
import { hasRole } from '@/lib/auth/rbac'
import { getUserOrganizations, requireUser } from '@/lib/auth/session'
import { getOpenIncidents, getOrgMonitors } from '@/lib/monitoring/queries'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireUser()
  const organizations = await getUserOrganizations(user.id)
  const organization = organizations[0]

  if (!organization) {
    return <p className="text-muted-foreground">No organization found for your account.</p>
  }

  const role = organization.memberships[0]?.role
  const canManage = role ? hasRole(role, Role.ADMIN) : false
  const [monitors, incidents] = await Promise.all([
    getOrgMonitors(organization.id),
    getOpenIncidents(organization.id),
  ])

  return (
    <div className="space-y-6">
      <LiveRefresh orgId={organization.id} />

      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground">
            {monitors.length} {monitors.length === 1 ? 'monitor' : 'monitors'}
          </p>
        </div>
        {role && <Badge variant="primary">{role}</Badge>}
      </div>

      <IncidentList incidents={incidents} canManage={canManage} />

      {canManage && <AddMonitorForm organizationId={organization.id} />}

      <MonitorList monitors={monitors} canManage={canManage} />
    </div>
  )
}
