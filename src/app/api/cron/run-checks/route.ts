import { runDueChecks } from '@/lib/monitoring/runner'

export const dynamic = 'force-dynamic'

/**
 * Runs every monitor whose interval has elapsed. Intended to be invoked on a
 * schedule (e.g. Vercel Cron). When `CRON_SECRET` is set, requests must present
 * it as a bearer token.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = await runDueChecks()
  return Response.json({ ok: true, ...result })
}
