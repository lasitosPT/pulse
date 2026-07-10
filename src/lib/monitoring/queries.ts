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
