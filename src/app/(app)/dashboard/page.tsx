import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserOrganizations, requireUser } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireUser()
  const organizations = await getUserOrganizations(user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">Here are your organizations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((organization) => (
          <Card key={organization.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{organization.name}</CardTitle>
                <Badge variant="primary">{organization.memberships[0]?.role}</Badge>
              </div>
              <CardDescription>/{organization.slug}</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">No monitors yet.</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
