import { describe, expect, it } from 'vitest'
import { averageLatency, uptimePercentage } from './stats'

describe('uptimePercentage', () => {
  it('is 0 with no checks', () => {
    expect(uptimePercentage([])).toBe(0)
  })

  it('is 100 when all checks succeed', () => {
    expect(uptimePercentage([{ success: true }, { success: true }])).toBe(100)
  })

  it('reflects partial availability', () => {
    expect(uptimePercentage([{ success: true }, { success: false }, { success: true }])).toBe(66.7)
  })
})

describe('averageLatency', () => {
  it('is null when there is no latency data', () => {
    expect(averageLatency([{ responseTimeMs: null }])).toBeNull()
  })

  it('averages the available latencies', () => {
    expect(
      averageLatency([{ responseTimeMs: 10 }, { responseTimeMs: 20 }, { responseTimeMs: null }]),
    ).toBe(15)
  })
})
