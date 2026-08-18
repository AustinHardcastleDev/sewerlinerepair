import type { ContractorMapItem } from '@/lib/contractor-model'
import { residentialConfidence, signalTier } from '@/lib/contractor-model'
import { PIN_LEGEND_ORDER, PIN_SPECS, type PinCategory } from '@/lib/tokens'
import {
  LeafletContractorMap,
  type LeafletCenter,
  type LeafletMarker,
} from './LeafletContractorMap'

type Props = {
  contractors: ContractorMapItem[]
  title: string
  eyebrow?: string
  center?: LeafletCenter
  radiusMiles?: number
  emptyText?: string
}

export function ContractorDotMap({
  contractors,
  title,
  eyebrow = 'Contractor map',
  center,
  radiusMiles,
  emptyText = 'No contractor coordinates available for this view.',
}: Props) {
  const points = contractors.filter(hasCoords)
  const markers = points.map(toLeafletMarker)
  const strongCount = points.filter(
    (item) => residentialConfidence(item) === 'explicit' || item.confidence === 'explicit',
  ).length
  const otherCount = points.length - strongCount

  return (
    <section className="overflow-hidden rounded-card border border-[var(--color-ink)] bg-[var(--color-page)]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative isolate z-0 overflow-hidden bg-[var(--color-panel)]">
          <LeafletContractorMap
            markers={markers}
            center={center}
            radiusMiles={radiusMiles}
            title={title}
            emptyText={emptyText}
          />
        </div>
        <aside className="min-w-0 border-t border-[var(--color-ink)] bg-[var(--color-page)] p-4 sm:p-5 md:p-6 lg:border-l lg:border-t-0">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="t-section mt-3 break-words text-[26px] sm:text-[30px]">
            {title}
          </h2>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <MapStat value={points.length} label="pins" />
            <MapStat value={strongCount} label="strong" />
            <MapStat value={otherCount} label="other" />
          </div>

          <div className="mt-6 space-y-2.5">
            {PIN_LEGEND_ORDER.map((category) => (
              <LegendDot key={category} category={category} />
            ))}
          </div>

          <p className="mt-5 text-[14px] leading-[1.6] text-[var(--color-muted)]">
            {radiusMiles
              ? `The ring marks the ${radiusMiles}-mile search radius. Pins show where contractors are based, not their full service area.`
              : 'Pins show contractor office locations from the directory data, not a promised service boundary.'}
          </p>
        </aside>
      </div>
    </section>
  )
}

function MapStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 rounded-card border border-[var(--color-border)] px-2 py-2.5">
      <div className="tabular text-[18px] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
        {value.toLocaleString()}
      </div>
      <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--color-muted)]">
        {label}
      </div>
    </div>
  )
}

export function LegendDot({ category }: { category: PinCategory }) {
  const spec = PIN_SPECS[category]
  const isSponsored = category === 'sponsored'

  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full"
        style={
          isSponsored
            ? {
                width: 12,
                height: 12,
                background: spec.color,
                border: '2px solid #131210',
                boxShadow: '0 0 0 2px #FFFFFF',
              }
            : { width: 10, height: 10, background: spec.color }
        }
      />
      <span
        className={
          isSponsored
            ? 'text-[13px] font-semibold text-[var(--color-ink)]'
            : 'text-[13px] text-[var(--color-muted)]'
        }
      >
        {spec.label}
      </span>
    </div>
  )
}

function hasCoords(
  item: ContractorMapItem,
): item is ContractorMapItem & { lat: number; lng: number } {
  return typeof item.lat === 'number' && typeof item.lng === 'number'
}

function toLeafletMarker(
  item: ContractorMapItem & { lat: number; lng: number },
): LeafletMarker {
  return {
    id: item.id,
    name: item.name,
    href: `/contractors/${item.stateSlug}/${item.slug}`,
    city: item.city,
    stateAbbr: item.stateAbbr,
    lat: item.lat,
    lng: item.lng,
    primaryLane: item.primaryLane,
    confidence: residentialConfidence(item) || item.confidence || 'medium',
    sponsored: item.sponsored,
    reviewsCount: item.reviewsCount ?? null,
    sewerReviewCount: item.sewerReviewCount ?? null,
    totalScore: item.totalScore ?? null,
    distanceMiles: item.distanceMiles,
  }
}

/** Re-exported so callers can build map payloads without reaching into tokens. */
export { signalTier }
