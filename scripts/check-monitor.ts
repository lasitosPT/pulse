import 'dotenv/config'
import { prisma } from '@/lib/db'
import { runMonitorCheck } from '@/lib/monitoring/runner'

/**
 * End-to-end smoke test of the monitoring engine: create a monitor, run a real
 * check against a live URL, verify a result was persisted, then clean up.
 */
async function main() {
  const organization = await prisma.organization.create({
    data: { name: 'Monitor Smoke', slug: `monitor-smoke-${Date.now()}` },
  })
  const monitor = await prisma.monitor.create({
    data: {
      organizationId: organization.id,
      name: 'Example',
      url: 'https://example.com',
      expectedStatus: 200,
    },
  })

  await runMonitorCheck(monitor.id)

  const updated = await prisma.monitor.findUniqueOrThrow({
    where: { id: monitor.id },
    include: { checks: true },
  })

  console.log('status         :', updated.status)
  console.log('checks stored  :', updated.checks.length)
  console.log('latest check   :', updated.checks[0])

  await prisma.organization.delete({ where: { id: organization.id } })
  console.log('cleaned up     : ✓')

  if (updated.checks.length !== 1) {
    throw new Error('Expected exactly one persisted check')
  }
  console.log('\nMONITOR OK')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Monitor check failed:', error)
    process.exit(1)
  })
