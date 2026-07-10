'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { Role } from '@/generated/prisma/enums'
import { MonitorStatus } from '@/generated/prisma/enums'
import { getMembership } from '@/lib/auth/authz'
import { hasRole } from '@/lib/auth/rbac'
import { prisma } from '@/lib/db'
import { createMonitorSchema } from '@/lib/monitoring/validations'
import { runMonitorCheck } from '@/lib/monitoring/runner'
import type { MonitorFormState } from './types'

/** Ensure the current user has at least the given role within an organization. */
async function authorizeOrg(organizationId: string, required: Role) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return false
  const membership = await getMembership(userId, organizationId)
  return Boolean(membership && hasRole(membership.role, required))
}

export async function createMonitorAction(
  organizationId: string,
  _prev: MonitorFormState,
  formData: FormData,
): Promise<MonitorFormState> {
  if (!(await authorizeOrg(organizationId, Role.ADMIN))) {
    return { error: 'You do not have permission to add monitors.' }
  }

  const parsed = createMonitorSchema.safeParse({
    name: formData.get('name'),
    url: formData.get('url'),
    method: formData.get('method') ?? 'GET',
    intervalSeconds: formData.get('intervalSeconds') ?? undefined,
    timeoutMs: formData.get('timeoutMs') ?? undefined,
    expectedStatus: formData.get('expectedStatus') ?? undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check the monitor details.' }
  }

  await prisma.monitor.create({ data: { organizationId, ...parsed.data } })
  revalidatePath('/dashboard')
  return undefined
}

/** Resolve a monitor's organization and confirm the caller may manage it. */
async function authorizeMonitor(monitorId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
    select: { id: true, organizationId: true, isActive: true },
  })
  if (!monitor) return null
  return (await authorizeOrg(monitor.organizationId, Role.ADMIN)) ? monitor : null
}

export async function toggleMonitorAction(monitorId: string) {
  const monitor = await authorizeMonitor(monitorId)
  if (!monitor) return

  await prisma.monitor.update({
    where: { id: monitor.id },
    data: {
      isActive: !monitor.isActive,
      status: monitor.isActive ? MonitorStatus.PAUSED : MonitorStatus.PENDING,
    },
  })
  revalidatePath('/dashboard')
}

export async function deleteMonitorAction(monitorId: string) {
  const monitor = await authorizeMonitor(monitorId)
  if (!monitor) return

  await prisma.monitor.delete({ where: { id: monitor.id } })
  revalidatePath('/dashboard')
}

export async function runMonitorNowAction(monitorId: string) {
  const monitor = await authorizeMonitor(monitorId)
  if (!monitor) return

  await runMonitorCheck(monitor.id)
  revalidatePath('/dashboard')
}
