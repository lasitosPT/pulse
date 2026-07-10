import { Pause, Play, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { HttpMethod, MonitorStatus } from '@/generated/prisma/enums'
import {
  deleteMonitorAction,
  runMonitorNowAction,
  toggleMonitorAction,
} from '@/server/actions/monitors'
import { MonitorStatusBadge } from './monitor-status-badge'

type MonitorRow = {
  id: string
  name: string
  url: string
  method: HttpMethod
  status: MonitorStatus
  isActive: boolean
  checks: { statusCode: number | null; responseTimeMs: number | null }[]
}

export function MonitorList({
  monitors,
  canManage,
}: {
  monitors: MonitorRow[]
  canManage: boolean
}) {
  if (monitors.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-10 text-center text-sm">
          No monitors yet — add your first endpoint above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {monitors.map((monitor) => {
        const latest = monitor.checks[0]
        return (
          <Card key={monitor.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MonitorStatusBadge status={monitor.status} />
                  <span className="truncate font-medium">{monitor.name}</span>
                </div>
                <p className="text-muted-foreground truncate text-sm">
                  {monitor.method} {monitor.url}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  {latest ? (
                    <>
                      <span className="font-mono">{latest.responseTimeMs ?? '—'} ms</span>
                      <span className="text-muted-foreground block text-xs">
                        {latest.statusCode ?? 'no response'}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Not checked yet</span>
                  )}
                </div>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <form action={runMonitorNowAction.bind(null, monitor.id)}>
                      <Button variant="ghost" size="icon" type="submit" aria-label="Check now">
                        <RefreshCw />
                      </Button>
                    </form>
                    <form action={toggleMonitorAction.bind(null, monitor.id)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="submit"
                        aria-label={monitor.isActive ? 'Pause monitor' : 'Resume monitor'}
                      >
                        {monitor.isActive ? <Pause /> : <Play />}
                      </Button>
                    </form>
                    <form action={deleteMonitorAction.bind(null, monitor.id)}>
                      <Button variant="ghost" size="icon" type="submit" aria-label="Delete monitor">
                        <Trash2 />
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
