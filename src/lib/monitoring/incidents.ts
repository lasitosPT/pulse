export type IncidentTransition =
  { type: 'open'; cause: string | null } | { type: 'resolve' } | { type: 'none' }

/**
 * Decide how a monitor's incident state should change given the latest check.
 * An incident opens on the first failure and resolves on the first recovery.
 */
export function evaluateIncidentTransition(params: {
  success: boolean
  hasOpenIncident: boolean
  error: string | null
}): IncidentTransition {
  if (!params.success && !params.hasOpenIncident) {
    return { type: 'open', cause: params.error }
  }
  if (params.success && params.hasOpenIncident) {
    return { type: 'resolve' }
  }
  return { type: 'none' }
}
