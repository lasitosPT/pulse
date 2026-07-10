import { Mail, Trash2, Webhook } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertChannelType } from '@/generated/prisma/enums'
import { deleteAlertChannelAction } from '@/server/actions/alerts'

type ChannelRow = {
  id: string
  type: AlertChannelType
  target: string
}

export function AlertChannelList({
  channels,
  canManage,
}: {
  channels: ChannelRow[]
  canManage: boolean
}) {
  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-8 text-center text-sm">
          No alert channels yet — add one above to start receiving notifications.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {channels.map((channel) => (
        <Card key={channel.id}>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              {channel.type === AlertChannelType.EMAIL ? (
                <Mail className="text-muted-foreground size-4 shrink-0" />
              ) : (
                <Webhook className="text-muted-foreground size-4 shrink-0" />
              )}
              <span className="truncate text-sm">{channel.target}</span>
              <Badge variant="default">{channel.type}</Badge>
            </div>
            {canManage && (
              <form action={deleteAlertChannelAction.bind(null, channel.id)}>
                <Button variant="ghost" size="icon" type="submit" aria-label="Delete channel">
                  <Trash2 />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
