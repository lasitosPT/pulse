import { Badge } from '@/components/ui/badge'
import { MonitorStatus } from '@/generated/prisma/enums'

const STATUS: Record<
  MonitorStatus,
  { variant: 'success' | 'danger' | 'warning' | 'default'; label: string }
> = {
  [MonitorStatus.UP]: { variant: 'success', label: 'Operational' },
  [MonitorStatus.DOWN]: { variant: 'danger', label: 'Down' },
  [MonitorStatus.PAUSED]: { variant: 'default', label: 'Paused' },
  [MonitorStatus.PENDING]: { variant: 'warning', label: 'Pending' },
}

export function MonitorStatusBadge({ status }: { status: MonitorStatus }) {
  const { variant, label } = STATUS[status]
  return <Badge variant={variant}>{label}</Badge>
}
