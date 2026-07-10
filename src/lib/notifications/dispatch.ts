import { AlertChannelType } from '@/generated/prisma/enums'
import { prisma } from '@/lib/db'
import { sendEmailAlert } from './email'
import type { AlertContext } from './types'
import { sendWebhookAlert } from './webhook'

/** Fan an incident alert out to all of an organization's active channels. */
export async function dispatchIncidentAlerts(
  organizationId: string,
  ctx: AlertContext,
): Promise<void> {
  const channels = await prisma.alertChannel.findMany({
    where: { organizationId, isActive: true },
  })

  await Promise.allSettled(
    channels.map((channel) =>
      channel.type === AlertChannelType.EMAIL
        ? sendEmailAlert(channel.target, ctx)
        : sendWebhookAlert(channel.target, ctx),
    ),
  )
}
