'use client'

import { sewerReviewCount } from '@/lib/contractor-model'

type Props = {
  count: number
  className?: string
}

/** Singular/plural sewer-specific review badge. Never use generator or EV labels. */
export function SewerReviewsBadge({ count, className = '' }: Props) {
  const n = Math.max(0, Math.floor(count || 0))
  if (n < 1) return null
  const label = n === 1 ? '1 sewer review' : `${n} sewer reviews`
  return (
    <span
      className={`inline-flex items-center rounded-btn border border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_16%,white)] px-2.5 py-1 text-[14px] font-extrabold tracking-tight text-[var(--color-ink)] ${className}`}
      title="Sewer-specific reviews in the scraped sample"
    >
      {label}
    </span>
  )
}

export function SewerReviewsBadgeFromContractor({
  contractor,
  className,
}: {
  contractor: Parameters<typeof sewerReviewCount>[0]
  className?: string
}) {
  return (
    <SewerReviewsBadge count={sewerReviewCount(contractor)} className={className} />
  )
}
