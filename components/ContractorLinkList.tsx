import Link from 'next/link'
import { LIST_BASE } from '@/lib/site'
import {
  confidenceLabel,
  type ContractorListItem,
  type SewerConfidence,
} from '@/lib/contractor-model'

type LinkItem = Pick<
  ContractorListItem,
  'id' | 'slug' | 'name' | 'city' | 'stateAbbr' | 'stateSlug' | 'primaryLane' | 'lanes'
> & {
  confidence?: SewerConfidence | null
}

export function ContractorLinkList({
  contractors,
  title = 'All contractors in this view',
  description = 'Every contractor we found in this view. Open a profile for website signal, reviews, and contact paths.',
  eyebrow,
  className = 'mt-14',
  showConfidence = true,
}: {
  contractors: LinkItem[]
  title?: string
  description?: string
  eyebrow?: string
  className?: string
  showConfidence?: boolean
}) {
  if (contractors.length === 0) return null
  return (
    <section className={className}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="t-heading mt-2">{title}</h2>
      <p className="t-body-sm mt-2 max-w-2xl">{description}</p>
      <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {contractors.map((contractor) => {
          const conf =
            contractor.confidence ||
            contractor.lanes?.residential_sewer?.confidence ||
            'medium'
          return (
            <li key={contractor.id} className="py-3">
              <Link
                href={`${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`}
                className="link flex flex-wrap items-baseline gap-x-3 gap-y-1"
              >
                <span className="font-semibold text-[var(--color-ink)]">
                  {contractor.name}
                </span>
                <span className="meta meta-soft">
                  {contractor.city
                    ? `${contractor.city}, ${contractor.stateAbbr}`
                    : contractor.stateAbbr}
                  {showConfidence
                    ? ` · ${confidenceLabel(conf as SewerConfidence)}`
                    : ''}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
