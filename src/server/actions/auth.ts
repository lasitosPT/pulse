'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'
import { Role } from '@/generated/prisma/enums'
import { hashPassword } from '@/lib/auth/password'
import { prisma } from '@/lib/db'
import { uniqueOrgSlug } from '@/lib/organizations'
import { credentialsSchema, registerSchema } from '@/lib/validations/auth'
import type { AuthFormState } from './types'

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check your details.' }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    return { error: 'An account with this email already exists.' }
  }

  const hashedPassword = await hashPassword(password)

  // Create the user together with a default organization they own.
  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      memberships: {
        create: {
          role: Role.OWNER,
          organization: {
            create: {
              name: `${name}'s team`,
              slug: await uniqueOrgSlug(name),
            },
          },
        },
      },
    },
  })

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (error) {
    // A successful sign-in throws a redirect, which must propagate.
    if (error instanceof AuthError) {
      return { error: 'Account created, but sign-in failed. Please sign in.' }
    }
    throw error
  }
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'Enter a valid email and password.' }
  }

  try {
    await signIn('credentials', { ...parsed.data, redirectTo: '/dashboard' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
