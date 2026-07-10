/**
 * Build an SVG path string for a sparkline from a series of numeric values,
 * scaled to fit the given box. Pure and deterministic for easy testing.
 */
export function buildSparklinePath(
  values: number[],
  width: number,
  height: number,
  padding = 2,
): string {
  if (values.length === 0) return ''

  const innerHeight = height - padding * 2
  const midY = padding + innerHeight / 2

  if (values.length === 1) {
    return `M ${padding} ${midY} L ${width - padding} ${midY}`
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const innerWidth = width - padding * 2
  const step = innerWidth / (values.length - 1)

  return values
    .map((value, index) => {
      const x = padding + index * step
      const y = padding + innerHeight - ((value - min) / range) * innerHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}
