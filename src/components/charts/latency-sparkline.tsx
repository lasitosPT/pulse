import { buildSparklinePath } from '@/lib/charts'

const WIDTH = 600
const HEIGHT = 120

export function LatencySparkline({ values }: { values: number[] }) {
  const path = buildSparklinePath(values, WIDTH, HEIGHT)
  const areaPath = path ? `${path} L ${WIDTH - 2} ${HEIGHT} L 2 ${HEIGHT} Z` : ''

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-32 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Response time over recent checks"
    >
      {areaPath && <path d={areaPath} fill="var(--color-primary)" opacity="0.08" />}
      <path
        d={path}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
