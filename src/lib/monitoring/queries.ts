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

/**
 * A monitor with its recent checks and incidents, but only if the given user is
 * a member of its organization. Returns null otherwise (not found / forbidden).
 */
export async function getMonitorDetail(monitorId: string, userId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    include: {
      checks: { orderBy: { checkedAt: 'desc' }, take: 60 },
      incidents: { orderBy: { startedAt: 'desc' }, take: 10 },
      organization: { select: { id: true, name: true, slug: true } },
    },
  })
  if (!monitor) return null

  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId: monitor.organizationId } },
    select: { role: true },
  })
  if (!membership) return null

  return { monitor, role: membership.role }
}

/**
 * Public status data for an organization by slug. Deliberately selects only
 * non-sensitive fields (names and statuses — never URLs or config).
 */
export async function getPublicStatus(slug: string) {
  return prisma.organization.findUnique({
    where: { slug },
    select: {
      name: true,
      monitors: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          status: true,
          checks: { orderBy: { checkedAt: 'desc' }, take: 30, select: { success: true } },
        },
      },
    },
  })
}
