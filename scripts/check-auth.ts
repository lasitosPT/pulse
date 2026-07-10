import 'dotenv/config'
import { Role } from '@/generated/prisma/enums'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { prisma } from '@/lib/db'
import { uniqueOrgSlug } from '@/lib/organizations'

/**
 * End-to-end smoke test of the registration data path: hash a password, create
 * a user with an owned organization, verify the password, then clean up.
 */
async function main() {
  const email = `smoke_${Date.now()}@example.com`
  const password = 'supersecret123'

  const hashedPassword = await hashPassword(password)
  const slug = await uniqueOrgSlug('Smoke Test')

  const user = await prisma.user.create({
    data: {
      name: 'Smoke Test',
      email,
      hashedPassword,
      memberships: {
        create: { role: Role.OWNER, organization: { create: { name: 'Smoke Test team', slug } } },
      },
    },
    include: { memberships: { include: { organization: true } } },
  })

  const membership = user.memberships[0]
  const correct = await verifyPassword(password, user.hashedPassword ?? '')
  const wrong = await verifyPassword('not-the-password', user.hashedPassword ?? '')

  console.log('created user   :', user.email)
  console.log(
    'organization   :',
    `${membership.organization.name} (/${membership.organization.slug})`,
  )
  console.log('role           :', membership.role)
  console.log('verify correct :', correct)
  console.log('verify wrong   :', wrong)

  // Clean up (deleting the org cascades the membership).
  await prisma.organization.delete({ where: { id: membership.organizationId } })
  await prisma.user.delete({ where: { id: user.id } })
  console.log('cleaned up     : ✓')

  if (!correct || wrong || membership.role !== Role.OWNER) {
    throw new Error('Auth smoke check failed')
  }
  console.log('\nAUTH OK')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Auth check failed:', error)
    process.exit(1)
  })
