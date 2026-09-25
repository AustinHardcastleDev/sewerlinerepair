import Link from 'next/link'
import { Suspense } from 'react'
import {
  TOTAL_INSTALLERS,
  TOTAL_STATES,
  NATIONAL_EXPLICIT,
  toContractorListItem,
  toContractorMapItem,
} from '@/lib/contractors'
import {
  getContractorsNearPoint,
  getZipCentroid,
  normalizeRadius,
  normalizeZip,
  DEFAULT_SEARCH_RADIUS,
} from '@/lib/geo'
import {
  countContractorsNearMetro,
  getIndexableMetros,
  METRO_RADIUS_MILES,
} from '@/lib/metros'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { pageMetadata } from '@/lib/seo'
import { ZipSearchForm } from '@/components/ZipSearchForm'
import { NearMeResults } from '@/components/NearMeResults'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { StatCardGroup } from '@/components/StatCards'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sewer Line Repair Near Me',
  description: `${TOTAL_INSTALLERS.toLocaleString()} sewer line contractors researched across ${TOTAL_STATES} states. Search by ZIP for a distance-sorted list.`,
  path: `${LIST_BASE}/near-me`,
})

const FAQS: FAQItem[] = [
  {
    q: 'How do I find sewer repair near me?',
    a: 'Enter your ZIP above, or open a state/metro page. Sewer contractors often cover a wide service radius, so a regional search is usually more useful than a single city name.',
  },
  {
    q: 'Are these contractors verified?',
    a: 'No. This is not a verified contractor program. We checked contractor websites for sewer line signal and sorted by what we found. Confirm licensing, insurance, references, and scope yourself.',
  },
  {
    q: 'How complete is the national ZIP search?',
    a: `Coordinates are live for ${TOTAL_INSTALLERS.toLocaleString()} researched contractors across ${TOTAL_STATES} states. If a ZIP returns thin results, widen the radius or open the matching state page.`,
  },
  {
    q: `How far will contractors travel?`,
    a: `It depends on the shop and the job. Our metro pages use a ${METRO_RADIUS_MILES}-mile working radius because many contractors serve counties outside the city where their office is listed.`,
  },
]

type Props = {
  searchParams: Promise<{ zip?: string; radius?: string }>
}

export default async function NearMePage({ searchParams }: Props) {
  const sp = await searchParams
  const zip = normalizeZip(sp.zip)
  const radius = normalizeRadius(sp.radius || String(DEFAULT_SEARCH_RADIUS))

  let payload: {
    zip: string
    radius: number
    center: { lat: number; lng: number; label: string } | null
    list: ReturnType<typeof toContractorListItem>[]
    map: ReturnType<typeof toContractorMapItem>[]
    error?: string
  } | null = null

  if (zip) {
    const centroid = getZipCentroid(zip)
    if (!centroid) {
      payload = {
        zip,
        radius,
        center: null,
        list: [],
        map: [],
        error: `We could not find ZIP ${zip} in the local centroid file. Try a five-digit ZIP such as 37203.`,
      }
    } else {
      const nearby = getContractorsNearPoint(centroid, radius)
      payload = {
        zip,
        radius,
        center: {
          lat: centroid.lat,
          lng: centroid.lng,
          label: zip,
        },
        list: nearby.map((i) => ({
          ...toContractorListItem(i),
          distanceMiles: i.distanceMiles,
        })),
        map: nearby.map((i) => ({
          ...toContractorMapItem(i),
          distanceMiles: i.distanceMiles,
        })),
      }
    }
  }

  const indexableMetros = getIndexableMetros()
  const featuredMetros = [...indexableMetros]
    .sort((a, b) => b.population - a.population)
    .slice(0, 18)
    .map((m) => ({
      ...m,
      count: countContractorsNearMetro(m),
    }))

  return (
    <>
      <NearMeJsonLd />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          { label: 'Near me', href: `${LIST_BASE}/near-me` },
        ]}
      />
      <article className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            { label: 'Near me' },
          ]}
        />

        <div className="mt-8 border-b border-[var(--color-border)] pb-12">
          <span className="eyebrow">Local contractor research</span>
          <h1 className="t-display mt-4">Sewer line repair near me.</h1>
          <p className="t-body mt-6 max-w-3xl text-[18.5px]">
            The near-me search gets messy fast. Some shops lead with a specific
            method. Others bury structural repair under drain cleaning or septic work. We checked
            websites for real sewer signal so you can start with a cleaner local list.
          </p>
          <StatCardGroup
            className="mt-10"
            columns={3}
            stats={[
              {
                label: 'researched contractors',
                value: TOTAL_INSTALLERS.toLocaleString(),
              },
              {
                label: 'states covered',
                value: TOTAL_STATES,
              },
              {
                label: 'dedicated pages found',
                value: NATIONAL_EXPLICIT.toLocaleString(),
              },
            ]}
          />
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14 lg:px-10">
        <ZipSearchForm
          title="Search from your ZIP"
          body="Enter a ZIP to sort researched contractors by distance. Lookup uses a local Census ZIP centroid file, no paid geocoding."
          defaultRadius={radius}
        />
        <Suspense
          fallback={
            <p className="mt-8 text-[16px] text-[var(--color-muted)]">
              Loading results…
            </p>
          }
        >
          <NearMeResults payload={payload} />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-10">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="eyebrow">Major metro lists</span>
          <span className="rule min-w-8 flex-1" />
          <span className="meta">within {METRO_RADIUS_MILES} miles</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMetros.map((metro) => (
            <Link
              key={`${metro.stateSlug}-${metro.slug}`}
              href={`${LIST_BASE}/${metro.stateSlug}/metros/${metro.slug}`}
              className="card flex items-baseline justify-between gap-3 px-4 py-3"
            >
              <span className="t-heading text-[18px]">
                {metro.name}, {metro.stateAbbr}
              </span>
              <span className="tabular text-[13px] text-[var(--color-muted)]">
                {metro.count}
              </span>
            </Link>
          ))}
        </div>
        <p className="t-body-sm mt-4">
          {indexableMetros.length} qualifying metro pages nationwide.{' '}
          <Link href={LIST_BASE} className="link">
            Open the full state list →
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <FAQ items={FAQS} />
      </section>
    </>
  )
}

function NearMeJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sewer line repair near me',
    description: SITE.description,
    url: `${SITE_URL}${LIST_BASE}/near-me`,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE_URL },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
