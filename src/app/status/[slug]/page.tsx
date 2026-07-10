import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UptimeBars } from '@/components/charts/uptime-bars'
import { Logo } from '@/components/logo'
import { MonitorStatusBadge } from '@/components/monitors/monitor-status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { MonitorStatus } from '@/generated/prisma/enums'
import { getPublicStatus } from '@/lib/monitoring/queries'
import { uptimePercentage } from '@/lib/monitoring/stats'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const organization = await getPublicStatus(slug)
  return { title: organization ? `${organization.name} — Status` : 'Status' }
}

export default async function StatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const organization = await getPublicStatus(slug)

  if (!organization) {
    notFound()
  }

  const monitors = organization.monitors
  const anyDown = monitors.some((monitor) => monitor.status === MonitorStatus.DOWN)
  const allUp =
    monitors.length > 0 && monitors.every((monitor) => monitor.status === MonitorStatus.UP)

  const overall =
    monitors.length === 0
      ? {
          label: 'No monitors are being tracked yet',
          dot: 'bg-muted-foreground',
          border: 'border-border',
        }
      : anyDown
        ? {
            label: 'Some systems are experiencing issues',
            dot: 'bg-danger',
            border: 'border-danger/40',
          }
        : allUp
          ? { label: 'All systems operational', dot: 'bg-success', border: 'border-success/40' }
          : { label: 'Partial availability', dot: 'bg-warning', border: 'border-warning/40' }

  return (
    <div className="flex min-h-screen flex-col">
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">{organization.name}</h1>
            <Logo />
          </div>

          <Card className={overall.border}>
            <CardContent className="flex items-center gap-3 p-6">
              <span className={`size-3 rounded-full ${overall.dot}`} />
              <span className="font-medium">{overall.label}</span>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {monitors.map((monitor) => (
              <Card key={monitor.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{monitor.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {uptimePercentage(monitor.checks)}%
                      </span>
                      <MonitorStatusBadge status={monitor.status} />
                    </div>
                  </div>
                  <UptimeBars checks={monitor.checks} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      <footer className="text-muted-foreground border-border border-t py-6 text-center text-sm">
        Powered by Pulse
      </footer>
    </div>
  )
}
