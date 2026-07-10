import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendWebhookAlert } from './webhook'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sendWebhookAlert', () => {
  it('POSTs a JSON payload describing the incident', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await sendWebhookAlert('https://hooks.example.com/x', {
      monitor: { name: 'API', url: 'https://api.example.com' },
      kind: 'opened',
      cause: 'timeout',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://hooks.example.com/x')
    expect(options.method).toBe('POST')
    const body = JSON.parse(options.body as string)
    expect(body.event).toBe('incident.opened')
    expect(body.monitor.name).toBe('API')
    expect(body.cause).toBe('timeout')
  })
})
