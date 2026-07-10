'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { IncidentStatus, Role } from '@/generated/prisma/enums'
import { getMembership } from '@/lib/auth/authz'
import { hasRole } from '@/lib/auth/rbac'
import { prisma } from '@/lib/db'

/** Resolve an incident's organization and confirm the caller may manage it. */
async function authorizeIncident(incidentId: string) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    select: { id: true, status: true, monitor: { select: { organizationId: true } } },
  })
  if (!incident) return null

  const userId = (await auth())?.user?.id
  if (!userId) return null

  const membership = await getMembership(userId, incident.monitor.organizationId)
  return membership && hasRole(membership.role, Role.ADMIN) ? incident : null
}

export async function acknowledgeIncidentAction(incidentId: string) {
  const incident = await authorizeIncident(incidentId)
  if (!incident || incident.status !== IncidentStatus.OPEN) return

  await prisma.incident.update({
    where: { id: incident.id },
    data: { status: IncidentStatus.ACKNOWLEDGED, acknowledgedAt: new Date() },
  })
  revalidatePath('/dashboard')
}

export async function resolveIncidentAction(incidentId: string) {
  const incident = await authorizeIncident(incidentId)
  if (!incident || incident.status === IncidentStatus.RESOLVED) return

  await prisma.incident.update({
    where: { id: incident.id },
    data: { status: IncidentStatus.RESOLVED, resolvedAt: new Date() },
  })
  revalidatePath('/dashboard')
}
