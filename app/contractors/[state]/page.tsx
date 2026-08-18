import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  states,
  getContractorsByState,
  getStateBySlug,
  getIndexableStateSlugs,
  stateMeetsIndexThreshold,
  toContractorListItem,
  toContractorMapItem,
  confidenceLabel,
  residentialConfidence,
} from '@/lib/contractors'
import {
  getIndexableMetrosByState,
  countContractorsNearMetro,
  METRO_RADIUS_MILES,
} from '@/lib/metros'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { pageMetadata } from '@/lib/seo'
import { ContractorDotMap } from '@/components/ContractorDotMap'
import { ZipSearchForm } from '@/components/ZipSearchForm'
import { FilteredContractors } from '@/components/FilteredContractors'
import { ContractorLinkList } from '@/components/ContractorLinkList'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { StatCardGroup } from '@/components/StatCards'
import { RepairCostCta } from '@/components/RepairCostCta'
import { StateEditorial } from '@/components/StateEditorial'
import { getStateEditorial } from '@/lib/state-editorial'
import { getStateSeoTitle, getStateMetaDescription } from '@/lib/state-seo'
import { getStateDirectoryTags } from '@/lib/directory-tags'
import {
  DIRECTORY_LIST_PREVIEW_LIMIT,
  DIRECTORY_MAP_PREVIEW_LIMIT,
} from '@/lib/tag-seo'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ state: string }> }

export function generateStaticParams() {
  return getIndexableStateSlugs().map((state) => ({ state }))
}

export async function generateMetadata({ params }: Props) {
  const { state } = await params
  const s = getStateBySlug(state)
  if (!s) return {}
  return pageMetadata({
    title: getStateSeoTitle(s),
    description: getStateMetaDescription(s),
    path: `${LIST_BASE}/${s.slug}`,
  })
}

export default async function StatePage({ params }: Props) {
  const { state } = await params
  const s = getStateBySlug(state)
  if (!s || !stateMeetsIndexThreshold(state)) notFound()

  const all = getContractorsByState(state)
  const explicit = all.filter((i) => residentialConfidence(i) === 'explicit')
  const high = all.filter((i) => residentialConfidence(i) === 'high')
  const medium = all.filter((i) => residentialConfidence(i) === 'medium')
  const stateMetros = getIndexableMetrosByState(state).map((m) => ({
    ...m,
    count: countContractorsNearMetro(m),
  }))
  const listItems = all.map(toContractorListItem)
  const cardPreview = listItems.slice(0, DIRECTORY_LIST_PREVIEW_LIMIT)
  const mapPreview = all.slice(0, DIRECTORY_MAP_PREVIEW_LIMIT)
  const remainingCards = Math.max(0, listItems.length - cardPreview.length)
  const editorial = getStateEditorial(state)
  const directoryTags = getStateDirectoryTags(state).map((tag) => ({
    tag,
    count: all.filter((i) => tag.matches(i)).length,
  }))
  const intentTags = directoryTags.filter((row) => row.tag.kind === 'intent')
  const brandTags = directoryTags.filter((row) => row.tag.kind === 'brand')

  const faqs: FAQItem[] = [
    {
      q: `How many sewer contractors are in ${s.name}?`,
      a: `${all.length} contractors show sewer line signal on their websites across ${(s.topCities || []).length || 'multiple'} cities in ${s.name}. Of those, ${explicit.length} have a dedicated sewer page, ${high.length} have repeated signal, and ${medium.length} have at least one mention worth checking.`,
    },
    {
      q: `What cities have the most contractors in ${s.name}?`,
      a: s.topCities?.length
        ? `${s.topCities.slice(0, 5).join(', ')}.`
        : `Contractors are spread across ${s.name}. Use the state list or ZIP search.`,
    },
    {
      q: `What should I confirm before hiring in ${s.name}?`,
      a: editorial?.marketOverview
        ? `${editorial.marketOverview} Confirm lateral ownership, camera documentation, method options, permits, and restoration before you compare bids.`
        : 'Confirm lateral ownership, camera documentation, method options, permits, and restoration before you compare bids.',
    },
    {
      q: 'How are these sorted?',
      a: 'Sewer-specific review count first (after any featured rows), then website signal, then overall Google review count. Use the left filters to require 1+, 5+, or 10+ sewer reviews.',
    },
    {
      q: 'Are these recommendations?',
      a: 'No. Independently researched listings, not endorsements. Use this as a starting point, then check licensing, references, and recent work before you sign.',
    },
  ]

  return (
    <>
      <StateCollectionJsonLd state={s} count={all.length} />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          { label: s.name },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            { label: s.name },
          ]}
        />
        <div className="mt-8 border-b border-[var(--color-border)] pb-12">
          <span className="eyebrow">{s.abbr} directory</span>
          <h1 className="t-display mt-4">
            Sewer line repair in {s.name}
          </h1>
          <p className="meta mt-4">
            {s.abbr} · {all.length.toLocaleString()} researched ·{' '}
            {explicit.length.toLocaleString()} explicit
          </p>
          <p className="t-body mt-6 max-w-2xl text-[18px]">
            {all.length.toLocaleString()} sewer line contractors with website
            signal in {s.name}. Sorted by sewer-specific review count, then
            website signal.
          </p>
          <StatCardGroup
            className="mt-10"
            columns={3}
            stats={[
              {
                label: 'Researched',
                value: all.length,
              },
              {
                label: 'Dedicated pages',
                value: explicit.length,
              },
              {
                label: 'Repeated signal',
                value: high.length,
              },
            ]}
          />
        </div>
      </section>

      <StateEditorial stateSlug={state} />

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14 lg:px-10">
        <ContractorDotMap
          contractors={mapPreview.map(toContractorMapItem)}
          title={`${s.name} contractor map`}
          eyebrow={`${s.abbr} locations`}
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-10">
        <ZipSearchForm
          title={`Search near your ${s.abbr} ZIP`}
          body="If the state list is too broad, enter your ZIP and sort by distance."
          compact
        />
      </section>

      {stateMetros.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="eyebrow">Browse by metro</span>
            <span className="rule min-w-8 flex-1" />
            <span className="meta">within {METRO_RADIUS_MILES} miles</span>
          </div>
          <p className="t-body-sm mt-3 max-w-2xl">
            Each metro page lists contractors with an office within{' '}
            {METRO_RADIUS_MILES} miles. Many shops travel for jobs, so the count
            includes nearby counties, not just city-limits addresses.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stateMetros.map((metro) => (
              <Link
                key={metro.slug}
                href={`${LIST_BASE}/${metro.stateSlug}/metros/${metro.slug}`}
                className="card flex items-baseline justify-between gap-3 p-4"
              >
                <span className="t-heading text-[18px]">{metro.name}</span>
                <span className="tabular text-[13px] text-[var(--color-muted)]">
                  {metro.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {intentTags.length > 0 || brandTags.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">
          {intentTags.length > 0 ? (
            <>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="eyebrow">Emergency services in {s.abbr}</span>
                <span className="rule min-w-8 flex-1" />
              </div>
              <p className="t-body-sm mt-3 max-w-2xl">
                Listings with emergency or after-hours language in permitted
                reviews. Clearing a clog is not the same as structural sewer
                repair.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {intentTags.map(({ tag, count }) => (
                  <Link
                    key={tag.slug}
                    href={`${LIST_BASE}/${s.slug}/tags/${tag.slug}`}
                    className="rounded-btn border border-[var(--color-border)] px-4 py-2 text-[15px] font-semibold"
                  >
                    {tag.shortLabel}{' '}
                    <span className="tabular text-[var(--color-muted)]">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
          {brandTags.length > 0 ? (
            <>
              <div
                className={`flex flex-wrap items-baseline gap-x-4 gap-y-2 ${intentTags.length > 0 ? 'mt-10' : ''}`}
              >
                <span className="eyebrow">Method signal in {s.abbr}</span>
                <span className="rule min-w-8 flex-1" />
              </div>
              <p className="t-body-sm mt-3 max-w-2xl">
                State pages for contractors whose websites mention lining,
                bursting, trenchless repair, or open-cut excavation. Method
                mention is not a specialty certification.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {brandTags.map(({ tag, count }) => (
                  <Link
                    key={tag.slug}
                    href={`${LIST_BASE}/${s.slug}/tags/${tag.slug}`}
                    className="rounded-btn border border-[var(--color-border)] px-4 py-2 text-[15px] font-semibold"
                  >
                    {tag.slug === 'cipp'
                      ? 'CIPP lining contractors'
                      : tag.label}{' '}
                    <span className="tabular text-[var(--color-muted)]">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">
        <Suspense
          fallback={
            <p className="text-[16px] text-[var(--color-muted)]">
              Loading filters…
            </p>
          }
        >
          <FilteredContractors
            contractors={cardPreview}
            title={`${s.name} list`}
            eyebrow="Full list"
          />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <ContractorLinkList
          contractors={listItems}
          title={`All ${s.name} contractors`}
        />
        {remainingCards > 0 ? (
          <p className="t-body-sm mt-6 max-w-2xl">
            Showing {cardPreview.length.toLocaleString()} cards of{' '}
            {listItems.length.toLocaleString()} researched contractors. The
            name list includes everyone.
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
        <RepairCostCta />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <FAQ items={faqs} />
        <p className="t-body-sm mt-10">
          Looking for first-call questions? Read{' '}
          <Link
            href="/guides/questions-to-ask-sewer-contractor"
            className="link"
          >
            questions to ask a sewer contractor
          </Link>
          . Signal labels mean {confidenceLabel('explicit').toLowerCase()},{' '}
          {confidenceLabel('high').toLowerCase()}, or{' '}
          {confidenceLabel('medium').toLowerCase()}.
        </p>
      </section>
    </>
  )
}

function StateCollectionJsonLd({
  state,
  count,
}: {
  state: { name: string; slug: string }
  count: number
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Sewer repair contractors in ${state.name}`,
    description: `A directory of ${count} sewer line contractors in ${state.name}, sorted by website signal.`,
    url: `${SITE_URL}${LIST_BASE}/${state.slug}`,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE_URL },
    about: {
      '@type': 'Thing',
      name: `Sewer contractors in ${state.name}`,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
