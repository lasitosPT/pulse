import 'dotenv/config'
import { Client } from 'pg'
import { prisma } from '@/lib/db'
import { MONITOR_EVENTS_CHANNEL, runMonitorCheck } from '@/lib/monitoring/runner'

/**
 * End-to-end smoke test of the real-time path: LISTEN on the channel, run a
 * check (which pg_notifies), and assert the notification arrives.
 */
async function main() {
  const organization = await prisma.organization.create({
    data: { name: 'Realtime Smoke', slug: `realtime-smoke-${Date.now()}` },
  })
  const monitor = await prisma.monitor.create({
    data: {
      organizationId: organization.id,
      name: 'Realtime',
      url: 'https://example.com',
      expectedStatus: 200,
    },
  })

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  await client.query(`LISTEN ${MONITOR_EVENTS_CHANNEL}`)

  const received = new Promise<{ organizationId: string }>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('No notification within 10s')), 10_000)
    client.on('notification', (message) => {
      const payload = JSON.parse(message.payload ?? '{}')
      if (payload.organizationId === organization.id) {
        clearTimeout(timer)
        resolve(payload)
      }
    })
  })

  await runMonitorCheck(monitor.id)
  const payload = await received
  console.log('received event :', payload)

  await client.query(`UNLISTEN ${MONITOR_EVENTS_CHANNEL}`)
  await client.end()
  await prisma.organization.delete({ where: { id: organization.id } })
  console.log('cleaned up     : ✓')
  console.log('\nREALTIME OK')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Realtime check failed:', error)
    process.exit(1)
  })
