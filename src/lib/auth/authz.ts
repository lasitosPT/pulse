import { auth } from '@/auth'
import { Role } from '@/generated/prisma/enums'
import { hasRole } from '@/lib/auth/rbac'
import { prisma } from '@/lib/db'

/** Look up a user's membership (and role) within an organization. */
export async function getMembership(userId: string, organizationId: string) {
  return prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    select: { role: true, organizationId: true },
  })
}

/** Whether the currently signed-in user has at least `required` role in an org. */
export async function currentUserHasOrgRole(
  organizationId: string,
  required: Role,
): Promise<boolean> {
  const userId = (await auth())?.user?.id
  if (!userId) return false
  const membership = await getMembership(userId, organizationId)
  return Boolean(membership && hasRole(membership.role, required))
}
