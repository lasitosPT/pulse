import { describe, expect, it } from 'vitest'
import { buildSparklinePath } from './charts'

describe('buildSparklinePath', () => {
  it('returns an empty string when there are no values', () => {
    expect(buildSparklinePath([], 100, 20)).toBe('')
  })

  it('draws a flat mid-line for a single value', () => {
    const path = buildSparklinePath([42], 100, 20)
    expect(path.startsWith('M')).toBe(true)
    expect(path).toContain('L')
  })

  it('emits one move and N-1 line commands', () => {
    const path = buildSparklinePath([1, 2, 3, 4], 100, 20)
    expect(path.startsWith('M')).toBe(true)
    expect((path.match(/L/g) ?? []).length).toBe(3)
  })

  it('maps the maximum value to the top of the box', () => {
    // With min at bottom and max at top, the highest value should have the
    // smallest y (nearer 0).
    const path = buildSparklinePath([0, 10], 100, 20, 0)
    const points = path.match(/-?\d+\.\d+/g)?.map(Number) ?? []
    const firstY = points[1]
    const secondY = points[3]
    expect(secondY).toBeLessThan(firstY)
  })
})
