import { afterEach, describe, expect, it, vi } from 'vitest'
import { performCheck } from './check'

const input = {
  url: 'https://example.com',
  method: 'GET',
  timeoutMs: 5000,
  expectedStatus: 200,
} as const

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('performCheck', () => {
  it('succeeds when the status matches the expectation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 200 })),
    )
    const result = await performCheck(input)
    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
    expect(result.error).toBeNull()
    expect(result.responseTimeMs).toBeTypeOf('number')
  })

  it('fails when the status does not match', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 503 })),
    )
    const result = await performCheck(input)
    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(503)
    expect(result.error).toContain('503')
  })

  it('captures network errors without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ECONNREFUSED')
      }),
    )
    const result = await performCheck(input)
    expect(result.success).toBe(false)
    expect(result.statusCode).toBeNull()
    expect(result.error).toContain('ECONNREFUSED')
  })
})
