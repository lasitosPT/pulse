import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Container } from '@/components/ui/container'
import { requireUser } from '@/lib/auth/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  )
}
