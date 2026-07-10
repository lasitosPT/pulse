import { MonitorStatus } from '@/generated/prisma/enums'
import { prisma } from '@/lib/db'
import { performCheck } from './check'

/** Run a single check for a monitor and persist the result + derived status. */
export async function runMonitorCheck(monitorId: string): Promise<void> {
  const monitor = await prisma.monitor.findUnique({ where: { id: monitorId } })
  if (!monitor || !monitor.isActive) return

  const outcome = await performCheck({
    url: monitor.url,
    method: monitor.method,
    timeoutMs: monitor.timeoutMs,
    expectedStatus: monitor.expectedStatus,
  })

  await prisma.$transaction([
    prisma.check.create({ data: { monitorId, ...outcome } }),
    prisma.monitor.update({
      where: { id: monitorId },
      data: {
        lastCheckedAt: new Date(),
        status: outcome.success ? MonitorStatus.UP : MonitorStatus.DOWN,
      },
    }),
  ])
}

/** Run all active monitors whose interval has elapsed. */
export async function runDueChecks(): Promise<{ due: number; ran: number }> {
  const active = await prisma.monitor.findMany({
    where: { isActive: true },
    select: { id: true, lastCheckedAt: true, intervalSeconds: true },
  })

  const now = Date.now()
  const due = active.filter(
    (monitor) =>
      !monitor.lastCheckedAt ||
      now - monitor.lastCheckedAt.getTime() >= monitor.intervalSeconds * 1000,
  )

  const results = await Promise.allSettled(due.map((monitor) => runMonitorCheck(monitor.id)))
  const ran = results.filter((result) => result.status === 'fulfilled').length

  return { due: due.length, ran }
}
