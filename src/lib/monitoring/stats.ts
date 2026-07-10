/** Percentage of successful checks (0–100, one decimal place). */
export function uptimePercentage(checks: { success: boolean }[]): number {
  if (checks.length === 0) return 0
  const up = checks.filter((check) => check.success).length
  return Math.round((up / checks.length) * 1000) / 10
}

/** Average response time across checks that produced one, or null. */
export function averageLatency(checks: { responseTimeMs: number | null }[]): number | null {
  const values = checks
    .map((check) => check.responseTimeMs)
    .filter((value): value is number => value !== null)

  if (values.length === 0) return null
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length)
}
