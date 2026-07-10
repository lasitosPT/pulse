import { cn } from '@/lib/utils'

/** Pulse wordmark with a heartbeat/monitoring mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary"
        aria-hidden="true"
      >
        <path
          d="M2 12h3.5L8 5l4.5 14L16 12h6"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg">Pulse</span>
    </span>
  )
}
