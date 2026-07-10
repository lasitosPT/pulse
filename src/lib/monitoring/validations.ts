import { z } from 'zod'

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().url('Enter a valid URL, including https://'),
  method: z.enum(['GET', 'HEAD', 'POST']).default('GET'),
  intervalSeconds: z.coerce.number().int().min(30).max(86_400).default(300),
  timeoutMs: z.coerce.number().int().min(1_000).max(60_000).default(10_000),
  expectedStatus: z.coerce.number().int().min(100).max(599).default(200),
})

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>
