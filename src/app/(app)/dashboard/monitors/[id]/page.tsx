import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LatencySparkline } from '@/components/charts/latency-sparkline'
import { UptimeBars } from '@/components/charts/uptime-bars'
import { MonitorStatusBadge } from '@/components/monitors/monitor-status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IncidentStatus } from '@/generated/prisma/enums'
import { requireUser } from '@/lib/auth/session'
import { formatDateTime } from '@/lib/format'
import { getMonitorDetail } from '@/lib/monitoring/queries'
import { averageLatency, uptimePercentage } from '@/lib/monitoring/stats'

export const metadata: Metadata = { title: 'Monitor' }

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  const detail = await getMonitorDetail(id, user.id)

  if (!detail) {
    notFound()
  }

  const { monitor } = detail
  const latencyValues = [...monitor.checks].reverse().map((check) => check.responseTimeMs ?? 0)
  const uptime = uptimePercentage(monitor.checks)
  const avgLatency = averageLatency(monitor.checks)

  const stats = [
    { label: `Uptime (last ${monitor.checks.length})`, value: `${uptime}%` },
    { label: 'Avg response', value: avgLatency === null ? '—' : `${avgLatency} ms` },
    {
      label: 'Last checked',
      value: monitor.lastCheckedAt ? formatDateTime(monitor.lastCheckedAt) : 'Never',
    },
  ]

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="flex items-center gap-2">
        <MonitorStatusBadge status={monitor.status} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
          <p className="text-muted-foreground text-sm">
            {monitor.method} {monitor.url}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent availability</CardTitle>
        </CardHeader>
        <CardContent>
          <UptimeBars checks={monitor.checks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response time</CardTitle>
        </CardHeader>
        <CardContent>
          {latencyValues.length > 0 ? (
            <LatencySparkline values={latencyValues} />
          ) : (
            <p className="text-muted-foreground text-sm">No data yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent checks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {monitor.checks.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No checks recorded yet.</p>
          ) : (
            <div className="divide-border divide-y">
              {monitor.checks.slice(0, 15).map((check) => (
                <div key={check.id} className="flex items-center justify-between px-6 py-2 text-sm">
                  <span className="text-muted-foreground">{formatDateTime(check.checkedAt)}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{check.responseTimeMs ?? '—'} ms</span>
                    <Badge variant={check.success ? 'success' : 'danger'}>
                      {check.statusCode ?? 'ERR'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {monitor.incidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Incident history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {monitor.incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between gap-3 px-6 py-2 text-sm"
                >
                  <span className="min-w-0 truncate">{incident.cause ?? 'Endpoint down'}</span>
                  <div className="text-muted-foreground flex shrink-0 items-center gap-3">
                    <span>{formatDateTime(incident.startedAt)}</span>
                    <Badge
                      variant={
                        incident.status === IncidentStatus.RESOLVED
                          ? 'success'
                          : incident.status === IncidentStatus.OPEN
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
