import { describe, expect, it } from 'vitest'
import { evaluateIncidentTransition } from './incidents'

describe('evaluateIncidentTransition', () => {
  it('opens an incident on the first failure', () => {
    expect(
      evaluateIncidentTransition({ success: false, hasOpenIncident: false, error: 'timeout' }),
    ).toEqual({ type: 'open', cause: 'timeout' })
  })

  it('resolves an incident on recovery', () => {
    expect(
      evaluateIncidentTransition({ success: true, hasOpenIncident: true, error: null }),
    ).toEqual({ type: 'resolve' })
  })

  it('does nothing while still failing with an incident already open', () => {
    expect(
      evaluateIncidentTransition({ success: false, hasOpenIncident: true, error: 'timeout' }),
    ).toEqual({ type: 'none' })
  })

  it('does nothing while healthy with no open incident', () => {
    expect(
      evaluateIncidentTransition({ success: true, hasOpenIncident: false, error: null }),
    ).toEqual({ type: 'none' })
  })
})
