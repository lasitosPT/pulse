'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAlertChannelAction } from '@/server/actions/alerts'
import type { AlertFormState } from '@/server/actions/types'

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function AlertChannelForm({ organizationId }: { organizationId: string }) {
  const action = addAlertChannelAction.bind(null, organizationId)
  const [state, formAction, pending] = useActionState<AlertFormState, FormData>(action, undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add an alert channel</CardTitle>
        <CardDescription>
          Notify an email address or POST to a webhook on incidents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-3">
          {state?.error && (
            <p
              role="alert"
              className="bg-danger/10 text-danger rounded-md px-3 py-2 text-sm sm:col-span-3"
            >
              {state.error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select id="type" name="type" defaultValue="EMAIL" className={selectClassName}>
              <option value="EMAIL">Email</option>
              <option value="WEBHOOK">Webhook</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="target">Destination</Label>
            <Input id="target" name="target" placeholder="you@company.com or https://…" required />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Adding…' : 'Add channel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
