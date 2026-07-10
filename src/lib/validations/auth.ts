import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')

export const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: passwordSchema,
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Enter a valid email address'),
  password: passwordSchema,
})

export type CredentialsInput = z.infer<typeof credentialsSchema>
export type RegisterInput = z.infer<typeof registerSchema>
