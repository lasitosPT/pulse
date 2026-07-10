import 'dotenv/config'
import { prisma } from '@/lib/db'
import { runMonitorCheck } from '@/lib/monitoring/runner'

/**
 * End-to-end smoke test of the incident state machine: force a failure (open),
 * then a recovery (resolve), asserting the lifecycle along the way.
 */
async function main() {
  const organization = await prisma.organization.create({
    data: { name: 'Incident Smoke', slug: `incident-smoke-${Date.now()}` },
  })
  // expectedStatus 500 forces a failure against example.com (which returns 200).
  const monitor = await prisma.monitor.create({
    data: {
      organizationId: organization.id,
      name: 'Flaky',
      url: 'https://example.com',
      expectedStatus: 500,
    },
  })

  await runMonitorCheck(monitor.id)
  const afterFailure = await prisma.monitor.findUniqueOrThrow({ where: { id: monitor.id } })
  const opened = await prisma.incident.findMany({ where: { monitorId: monitor.id } })
  console.log('after failure  → monitor:', afterFailure.status, '| incident:', opened[0]?.status)

  // Fix the expectation so the next check succeeds and resolves the incident.
  await prisma.monitor.update({ where: { id: monitor.id }, data: { expectedStatus: 200 } })
  await runMonitorCheck(monitor.id)
  const afterRecovery = await prisma.monitor.findUniqueOrThrow({ where: { id: monitor.id } })
  const resolved = await prisma.incident.findMany({ where: { monitorId: monitor.id } })
  console.log(
    'after recovery → monitor:',
    afterRecovery.status,
    '| incident:',
    resolved[0]?.status,
    '| resolvedAt set:',
    Boolean(resolved[0]?.resolvedAt),
  )

  await prisma.organization.delete({ where: { id: organization.id } })
  console.log('cleaned up     : ✓')

  if (resolved.length !== 1 || resolved[0].status !== 'RESOLVED' || !resolved[0].resolvedAt) {
    throw new Error('Incident lifecycle did not resolve as expected')
  }
  console.log('\nINCIDENT OK')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Incident check failed:', error)
    process.exit(1)
  })
