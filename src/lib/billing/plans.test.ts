import { describe, expect, it } from 'vitest'
import { Plan } from '@/generated/prisma/enums'
import { canAddMonitor, planFor } from './plans'

describe('canAddMonitor', () => {
  it('allows adding below the plan limit', () => {
    expect(canAddMonitor(Plan.FREE, 2)).toBe(true)
  })

  it('blocks adding at the plan limit', () => {
    expect(canAddMonitor(Plan.FREE, 3)).toBe(false)
  })

  it('scales the limit with the plan', () => {
    expect(canAddMonitor(Plan.PRO, 24)).toBe(true)
    expect(canAddMonitor(Plan.PRO, 25)).toBe(false)
    expect(canAddMonitor(Plan.BUSINESS, 199)).toBe(true)
  })
})

describe('planFor', () => {
  it('returns the configuration for a plan', () => {
    expect(planFor(Plan.BUSINESS).monitorLimit).toBe(200)
    expect(planFor(Plan.FREE).priceEnvKey).toBeNull()
  })
})
