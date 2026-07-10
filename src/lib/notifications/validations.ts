import { z } from 'zod'

export const alertChannelSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('EMAIL'),
    target: z.string().email('Enter a valid email address'),
  }),
  z.object({
    type: z.literal('WEBHOOK'),
    target: z.string().url('Enter a valid webhook URL, including https://'),
  }),
])

export type AlertChannelInput = z.infer<typeof alertChannelSchema>
