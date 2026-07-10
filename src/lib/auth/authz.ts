import { prisma } from '@/lib/db'

/** Look up a user's membership (and role) within an organization. */
export async function getMembership(userId: string, organizationId: string) {
  return prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    select: { role: true, organizationId: true },
  })
}
