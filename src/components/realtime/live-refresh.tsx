'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Subscribes to the organization's SSE stream and refreshes the current route's
 * server components when monitor changes arrive. Renders nothing.
 */
export function LiveRefresh({ orgId }: { orgId: string }) {
  const router = useRouter()
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const source = new EventSource(`/api/orgs/${orgId}/events`)

    source.onmessage = () => {
      // Collapse bursts of events into a single refresh.
      if (debounce.current) clearTimeout(debounce.current)
      debounce.current = setTimeout(() => router.refresh(), 400)
    }

    return () => {
      source.close()
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [orgId, router])

  return null
}
