import type { HttpMethod } from '@/generated/prisma/enums'

export type CheckInput = {
  url: string
  method: HttpMethod
  timeoutMs: number
  expectedStatus: number
}

export type CheckOutcome = {
  success: boolean
  statusCode: number | null
  responseTimeMs: number | null
  error: string | null
}

/**
 * Perform a single HTTP check against an endpoint, measuring latency and
 * comparing the response status to the expected value. Never throws — all
 * failure modes are captured in the returned outcome.
 */
export async function performCheck(input: CheckInput): Promise<CheckOutcome> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs)
  const startedAt = performance.now()

  try {
    const response = await fetch(input.url, {
      method: input.method,
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'PulseMonitor/1.0 (+https://github.com/lasitosPT/pulse)' },
    })
    const responseTimeMs = Math.round(performance.now() - startedAt)
    const success = response.status === input.expectedStatus

    return {
      success,
      statusCode: response.status,
      responseTimeMs,
      error: success ? null : `Expected HTTP ${input.expectedStatus}, received ${response.status}`,
    }
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startedAt)
    const aborted = error instanceof Error && error.name === 'AbortError'

    return {
      success: false,
      statusCode: null,
      responseTimeMs,
      error: aborted
        ? `Request timed out after ${input.timeoutMs}ms`
        : error instanceof Error
          ? error.message
          : 'Request failed',
    }
  } finally {
    clearTimeout(timeout)
  }
}
