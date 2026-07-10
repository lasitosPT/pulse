import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IncidentStatus } from '@/generated/prisma/enums'
import { formatDateTime } from '@/lib/format'
import { acknowledgeIncidentAction, resolveIncidentAction } from '@/server/actions/incidents'

type IncidentRow = {
  id: string
  status: IncidentStatus
  cause: string | null
  startedAt: Date
  monitor: { name: string; url: string }
}

export function IncidentList({
  incidents,
  canManage,
}: {
  incidents: IncidentRow[]
  canManage: boolean
}) {
  if (incidents.length === 0) return null

  return (
    <Card className="border-danger/40">
      <CardContent className="space-y-3 p-4">
        <div className="text-danger flex items-center gap-2 font-medium">
          <AlertTriangle className="size-4" />
          Open incidents ({incidents.length})
        </div>

        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="border-border flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{incident.monitor.name}</span>
                <Badge variant={incident.status === IncidentStatus.OPEN ? 'danger' : 'warning'}>
                  {incident.status}
                </Badge>
              </div>
              <p className="text-muted-foreground truncate text-sm">
                {incident.cause ?? 'Endpoint down'} · since {formatDateTime(incident.startedAt)}
              </p>
            </div>

            {canManage && (
              <div className="flex items-center gap-2">
                {incident.status === IncidentStatus.OPEN && (
                  <form action={acknowledgeIncidentAction.bind(null, incident.id)}>
                    <Button variant="outline" size="sm" type="submit">
                      Acknowledge
                    </Button>
                  </form>
                )}
                <form action={resolveIncidentAction.bind(null, incident.id)}>
                  <Button variant="ghost" size="sm" type="submit">
                    Resolve
                  </Button>
                </form>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
