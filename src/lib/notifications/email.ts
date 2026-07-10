import { Resend } from 'resend'
import type { AlertContext } from './types'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null
const from = process.env.ALERT_FROM_EMAIL ?? 'Pulse <alerts@pulse.dev>'

/** Send an incident alert email. No-ops (with a warning) if Resend is unconfigured. */
export async function sendEmailAlert(to: string, ctx: AlertContext): Promise<void> {
  if (!resend) {
    console.warn(`[alerts] RESEND_API_KEY not set — skipping email alert to ${to}`)
    return
  }

  const down = ctx.kind === 'opened'
  const subject = down ? `🔴 ${ctx.monitor.name} is down` : `🟢 ${ctx.monitor.name} has recovered`

  const body = [
    down
      ? `${ctx.monitor.name} (${ctx.monitor.url}) is not responding as expected.`
      : `${ctx.monitor.name} (${ctx.monitor.url}) is back to normal.`,
    ctx.cause ? `Cause: ${ctx.cause}` : null,
  ]
    .filter(Boolean)
    .join('\n\n')

  await resend.emails.send({ from, to, subject, text: body })
}
