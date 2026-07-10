'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/prisma/enums'
import { currentUserHasOrgRole, getMembership } from '@/lib/auth/authz'
import { auth } from '@/auth'
import { hasRole } from '@/lib/auth/rbac'
import { prisma } from '@/lib/db'
import { alertChannelSchema } from '@/lib/notifications/validations'
import type { AlertFormState } from './types'

export async function addAlertChannelAction(
  organizationId: string,
  _prev: AlertFormState,
  formData: FormData,
): Promise<AlertFormState> {
  if (!(await currentUserHasOrgRole(organizationId, Role.ADMIN))) {
    return { error: 'You do not have permission to manage alerts.' }
  }

  const parsed = alertChannelSchema.safeParse({
    type: formData.get('type'),
    target: formData.get('target'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check the channel details.' }
  }

  await prisma.alertChannel.create({ data: { organizationId, ...parsed.data } })
  revalidatePath('/dashboard/settings')
  return undefined
}

export async function deleteAlertChannelAction(channelId: string) {
  const channel = await prisma.alertChannel.findUnique({
    where: { id: channelId },
    select: { id: true, organizationId: true },
  })
  if (!channel) return

  const userId = (await auth())?.user?.id
  if (!userId) return
  const membership = await getMembership(userId, channel.organizationId)
  if (!membership || !hasRole(membership.role, Role.ADMIN)) return

  await prisma.alertChannel.delete({ where: { id: channel.id } })
  revalidatePath('/dashboard/settings')
}
