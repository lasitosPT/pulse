import 'dotenv/config'
import { prisma } from '@/lib/db'

/** Quick connectivity smoke check against the configured database. */
async function main() {
  const [users, organizations] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
  ])
  console.log(`DB OK — users: ${users}, organizations: ${organizations}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('DB check failed:', error)
    process.exit(1)
  })
