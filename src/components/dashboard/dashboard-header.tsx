import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { signOutAction } from '@/server/actions/auth'

const navLinks = [
  { href: '/dashboard', label: 'Monitors' },
  { href: '/dashboard/settings', label: 'Alerts' },
]

type DashboardHeaderProps = {
  user: { name?: string | null; email?: string | null }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-border border-b">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" aria-label="Pulse dashboard">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-sm md:inline">{user.email}</span>
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
