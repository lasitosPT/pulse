import { Client } from 'pg'
import { getMembership } from '@/lib/auth/authz'
import { getCurrentUser } from '@/lib/auth/session'
import { MONITOR_EVENTS_CHANNEL } from '@/lib/monitoring/runner'

export const dynamic = 'force-dynamic'

/**
 * Server-Sent Events stream of monitor changes for an organization. Backed by a
 * dedicated Postgres LISTEN connection fed by `pg_notify` in the check runner.
 */
export async function GET(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params

  const user = await getCurrentUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const membership = await getMembership(user.id, orgId)
  if (!membership) return new Response('Forbidden', { status: 403 })

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk))
        } catch {
          // The stream may already be closed.
        }
      }

      await client.connect()
      await client.query(`LISTEN ${MONITOR_EVENTS_CHANNEL}`)
      enqueue('event: connected\ndata: ok\n\n')

      client.on('notification', (message) => {
        if (!message.payload) return
        try {
          const payload = JSON.parse(message.payload) as { organizationId?: string }
          if (payload.organizationId === orgId) {
            enqueue(`data: ${message.payload}\n\n`)
          }
        } catch {
          // Ignore malformed payloads.
        }
      })

      const keepAlive = setInterval(() => enqueue(': ping\n\n'), 25_000)

      request.signal.addEventListener('abort', async () => {
        clearInterval(keepAlive)
        client.removeAllListeners('notification')
        await client.end().catch(() => {})
        try {
          controller.close()
        } catch {
          // Already closed.
        }
      })
    },
    async cancel() {
      await client.end().catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
