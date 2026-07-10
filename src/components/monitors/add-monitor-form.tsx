'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMonitorAction } from '@/server/actions/monitors'
import type { MonitorFormState } from '@/server/actions/types'

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function AddMonitorForm({ organizationId }: { organizationId: string }) {
  const action = createMonitorAction.bind(null, organizationId)
  const [state, formAction, pending] = useActionState<MonitorFormState, FormData>(action, undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a monitor</CardTitle>
        <CardDescription>Point Pulse at an endpoint to start watching it.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          {state?.error && (
            <p
              role="alert"
              className="bg-danger/10 text-danger rounded-md px-3 py-2 text-sm sm:col-span-2"
            >
              {state.error}
            </p>
          )}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Marketing site" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <select id="method" name="method" defaultValue="GET" className={selectClassName}>
              <option value="GET">GET</option>
              <option value="HEAD">HEAD</option>
              <option value="POST">POST</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intervalSeconds">Interval (seconds)</Label>
            <Input
              id="intervalSeconds"
              name="intervalSeconds"
              type="number"
              defaultValue={300}
              min={30}
              max={86400}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? 'Adding…' : 'Add monitor'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
