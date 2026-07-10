import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { signOutAction } from '@/server/actions/auth'

type DashboardHeaderProps = {
  user: { name?: string | null; email?: string | null }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-border border-b">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-sm sm:inline">{user.email}</span>
          <ThemeToggle />
          <form action={signOutAction}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </Container>
    </header>
  )
}
