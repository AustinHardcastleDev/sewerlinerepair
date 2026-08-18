import Link from 'next/link'
import {
  activeLaneConfidence,
  confidenceLabel,
  sewerReviewCount,
  signalTier,
  type SewerConfidence,
  type ContractorListItem,
} from '@/lib/contractor-model'
import { LIST_BASE } from '@/lib/site'
import { SponsoredTag } from './SponsoredTag'
import { SewerReviewsBadge } from './SewerReviewsBadge'

type Props = {
  contractor: ContractorListItem
  variant?: 'default' | 'featured'
  sourceSection?: string
}

const ROW_TIER_CLASS: Record<ReturnType<typeof signalTier>, string> = {
  dedicated: 'row-dedicated',
  repeated: 'row-repeated',
  signal: 'row-signal',
  sponsored: 'row-sponsored',
}

/**
 * List row. The left rule reads sponsorship first, then website-signal tier.
 * Sponsored rows also take the warm surface and a labeled tag.
 */
export function ContractorCard({
  contractor,
  variant = 'default',
  sourceSection,
}: Props) {
  const href = `${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`
  const isFeatured = variant === 'featured'
  const confidence =
    activeLaneConfidence(contractor, 'residential_sewer') || 'medium'
  const rowClass = contractor.sponsored
    ? 'row-sponsored'
    : ROW_TIER_CLASS[signalTier(confidence)]
  const sewerCount = sewerReviewCount(contractor, 'residential_sewer')

  return (
    <div
      className={`group relative h-full min-w-0 row ${rowClass} ${isFeatured ? 'p-6 md:p-7' : 'p-5'}`}
      data-source-section={sourceSection}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-label={`View ${contractor.name} profile`}
      >
        <span className="sr-only">View {contractor.name} profile</span>
      </Link>
      <div className="pointer-events-none relative z-[1]">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3 className="t-heading min-w-0 break-words">{contractor.name}</h3>
          {contractor.sponsored ? <SponsoredTag /> : null}
        </div>

        {sewerCount > 0 ? (
          <div className="mt-3">
            <SewerReviewsBadge count={sewerCount} />
          </div>
        ) : null}

        <div className="meta meta-soft mt-2 break-words">
          {contractor.city
            ? `${contractor.city}, ${contractor.stateAbbr}`
            : contractor.state}
          <span className="mx-2 text-[var(--color-border)]">·</span>
          {contractor.categoryName || 'contractor'}
          {typeof contractor.distanceMiles === 'number' ? (
            <>
              <span className="mx-2 text-[var(--color-border)]">·</span>
              {contractor.distanceMiles < 10
                ? contractor.distanceMiles.toFixed(1)
                : Math.round(contractor.distanceMiles)}{' '}
              mi
            </>
          ) : null}
        </div>

        <p className="t-body-sm mt-4 line-clamp-3">
          {contractor.writeup ||
            'Website evidence indicates sewer line repair or replacement work. Confirm licensing, ownership, and scope before hiring.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
          <ConfidenceBadge confidence={confidence} />
        </div>
      </div>
    </div>
  )
}

export function ConfidenceBadge({
  confidence,
}: {
  confidence: SewerConfidence
}) {
  const tier = signalTier(confidence)
  const dotVar =
    tier === 'dedicated'
      ? 'var(--color-ink)'
      : tier === 'repeated'
        ? 'var(--color-muted)'
        : 'var(--color-faint)'

  return (
    <span className="tag-pill shrink-0 gap-2">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ background: dotVar }}
      />
      {confidenceLabel(confidence)}
    </span>
  )
}
