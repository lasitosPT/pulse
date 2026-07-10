import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

/** Produce an organization slug that is unique, appending a counter on collisions. */
export async function uniqueOrgSlug(name: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let suffix = 1

  while (await prisma.organization.findUnique({ where: { slug }, select: { id: true } })) {
    suffix += 1
    slug = `${base}-${suffix}`
  }

  return slug
}
