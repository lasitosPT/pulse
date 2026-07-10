import type { AlertContext } from './types'

/** POST an incident alert payload to a webhook URL. */
export async function sendWebhookAlert(url: string, ctx: AlertContext): Promise<void> {
  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      event: `incident.${ctx.kind}`,
      monitor: ctx.monitor,
      cause: ctx.cause ?? null,
      timestamp: new Date().toISOString(),
    }),
  })
}
