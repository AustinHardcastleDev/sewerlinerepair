import type { ReactNode } from 'react'

export type Stat = {
  label: string
  value: ReactNode
  caption?: ReactNode
}

export function StatCard({
  label,
  value,
  caption,
  primary = false,
}: Stat & { primary?: boolean }) {
  return (
    <div className={`stat-card${primary ? ' stat-card-primary' : ''}`}>
      <div className="t-stat tabular">{value}</div>
      <div className="meta mt-3">{label}</div>
      {caption ? (
        <div className="mt-2 text-[14px] leading-[1.5] text-[var(--color-muted)]">
          {caption}
        </div>
      ) : null}
    </div>
  )
}

/**
 * The first card in a group carries the accent left rule; the rest stay plain.
 * Pass stats in priority order.
 */
export function StatCardGroup({
  stats,
  columns = 3,
  className = '',
}: {
  stats: Stat[]
  columns?: 2 | 3 | 4
  className?: string
}) {
  const grid =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-3'

  return (
    <div className={`grid gap-3 ${grid} ${className}`.trim()}>
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} primary={index === 0} />
      ))}
    </div>
  )
}
