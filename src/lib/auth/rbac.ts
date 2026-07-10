import { Role } from '@/generated/prisma/enums'

// Higher rank grants a superset of the capabilities of every lower rank.
const ROLE_RANK: Record<Role, number> = {
  [Role.MEMBER]: 1,
  [Role.ADMIN]: 2,
  [Role.OWNER]: 3,
}

/** True if `actual` meets or exceeds `required` in the role hierarchy. */
export function hasRole(actual: Role, required: Role): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[required]
}
