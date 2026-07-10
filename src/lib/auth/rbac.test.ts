import { describe, expect, it } from 'vitest'
import { Role } from '@/generated/prisma/enums'
import { hasRole } from './rbac'

describe('hasRole', () => {
  it('grants access when roles match', () => {
    expect(hasRole(Role.ADMIN, Role.ADMIN)).toBe(true)
  })

  it('grants access when the actual role outranks the requirement', () => {
    expect(hasRole(Role.OWNER, Role.MEMBER)).toBe(true)
    expect(hasRole(Role.ADMIN, Role.MEMBER)).toBe(true)
  })

  it('denies access when the actual role is below the requirement', () => {
    expect(hasRole(Role.MEMBER, Role.ADMIN)).toBe(false)
    expect(hasRole(Role.ADMIN, Role.OWNER)).toBe(false)
  })
})
