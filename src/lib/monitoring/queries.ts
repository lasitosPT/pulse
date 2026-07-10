import { IncidentStatus } from '@/generated/prisma/enums'
import { prisma } from '@/lib/db'

/** Monitors for an organization, newest first, each with its latest check. */
export async function getOrgMonitors(organizationId: string) {
  return prisma.monitor.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      checks: { orderBy: { checkedAt: 'desc' }, take: 1 },
    },
  })
}

/** Unresolved incidents across an organization's monitors, newest first. */
export async function getOpenIncidents(organizationId: string) {
  return prisma.incident.findMany({
    where: {
      monitor: { organizationId },
      status: { in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    },
    orderBy: { startedAt: 'desc' },
    include: { monitor: { select: { name: true, url: true } } },
  })
}
