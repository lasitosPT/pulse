import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Container } from '@/components/ui/container'

const footerNav = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Blog' },
      { href: '#', label: 'Careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
              Uptime &amp; status monitoring for modern teams.
            </p>
          </div>
          {footerNav.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold">{column.title}</h4>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-border text-muted-foreground mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm sm:flex-row">
          <p>&copy; 2026 Pulse. All rights reserved.</p>
          <p>Built with Next.js, TypeScript &amp; PostgreSQL.</p>
        </div>
      </Container>
    </footer>
  )
}
