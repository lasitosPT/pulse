import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/** Return the signed-in user, or `null` if there is no session. */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

/** Return the signed-in user, redirecting to the login page if unauthenticated. */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

/** All organizations the user belongs to, with the user's role in each. */
export async function getUserOrganizations(userId: string) {
  return prisma.organization.findMany({
    where: { memberships: { some: { userId } } },
    include: {
      memberships: {
        where: { userId },
        select: { role: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
