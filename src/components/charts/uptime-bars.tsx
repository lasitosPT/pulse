import { cn } from '@/lib/utils'

/**
 * A status-page style availability strip. Expects checks newest-first (as
 * returned by the queries) and renders them chronologically, left to right.
 */
export function UptimeBars({ checks }: { checks: { success: boolean }[] }) {
  const bars = checks.slice(0, 60).reverse()

  if (bars.length === 0) {
    return <p className="text-muted-foreground text-sm">No checks recorded yet.</p>
  }

  return (
    <div className="flex h-8 items-stretch gap-0.5">
      {bars.map((check, index) => (
        <div
          key={index}
          className={cn('flex-1 rounded-sm', check.success ? 'bg-success' : 'bg-danger')}
          title={check.success ? 'Up' : 'Down'}
        />
      ))}
    </div>
  )
}
