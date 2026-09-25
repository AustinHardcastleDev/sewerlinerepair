import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  getMetro,
  getIndexableMetros,
  getIndexableMetrosByState,
  getContractorsNearMetro,
  metroMeetsIndexThreshold,
  METRO_RADIUS_MILES,
} from '@/lib/metros'
import {
  getMetroEditorial,
  getMetroMetaDescription,
  getMetroSeoTitle,
} from '@/lib/metro-editorial'
import {
  getStateBySlug,
  toContractorListItem,
  toContractorMapItem,
  residentialConfidence,
} from '@/lib/contractors'
import {
  DIRECTORY_LIST_PREVIEW_LIMIT,
  DIRECTORY_MAP_PREVIEW_LIMIT,
} from '@/lib/tag-seo'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { collectionItemList, pageMetadata } from '@/lib/seo'
import { ContractorDotMap } from '@/components/ContractorDotMap'
import { ZipSearchForm } from '@/components/ZipSearchForm'
import { FilteredContractors } from '@/components/FilteredContractors'
import { ContractorLinkList } from '@/components/ContractorLinkList'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { StatCardGroup } from '@/components/StatCards'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ state: string; metro: string }> }

export function generateStaticParams() {
  return getIndexableMetros().map((m) => ({
    state: m.stateSlug,
    metro: m.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { state, metro } = await params
  const m = getMetro(state, metro)
  if (!m || !metroMeetsIndexThreshold(m)) return {}
  const nearby = getContractorsNearMetro(m)
  const explicit = nearby.filter((i) => residentialConfidence(i) === 'explicit').length
  return pageMetadata({
    title: getMetroSeoTitle(m, nearby.length),
    description: getMetroMetaDescription(m, nearby.length, explicit),
    path: `${LIST_BASE}/${m.stateSlug}/metros/${m.slug}`,
  })
}

export default async function MetroPage({ params }: Props) {
  const { state, metro } = await params
  const m = getMetro(state, metro)
  if (!m || !metroMeetsIndexThreshold(m)) notFound()

  const s = getStateBySlug(m.stateSlug)
  const nearby = getContractorsNearMetro(m)
  const editorial = getMetroEditorial(m, nearby)
  const otherMetros = getIndexableMetrosByState(m.stateSlug).filter(
    (x) => x.slug !== m.slug,
  )
  const explicit = nearby.filter((i) => residentialConfidence(i) === 'explicit')
  const high = nearby.filter((i) => residentialConfidence(i) === 'high')
  const medium = nearby.filter((i) => residentialConfidence(i) === 'medium')
  const listItems = nearby.map((contractor) => ({
    ...toContractorListItem(contractor),
    distanceMiles: contractor.distanceMiles,
  }))
  const cardPreview = listItems.slice(0, DIRECTORY_LIST_PREVIEW_LIMIT)
  const mapPreview = nearby.slice(0, DIRECTORY_MAP_PREVIEW_LIMIT)
  const remainingCards = Math.max(0, listItems.length - cardPreview.length)

  const faqs: FAQItem[] = [
    {
      q: `How many sewer contractors work near ${m.name}, ${m.stateAbbr}?`,
      a: `${nearby.length} researched contractors are based within ${METRO_RADIUS_MILES} miles of ${m.name}. Of those, ${explicit.length} have a dedicated sewer page, ${high.length} show repeated signal, and ${medium.length} mention sewer work at least once.`,
    },
    {
      q: `Why is the radius set to ${METRO_RADIUS_MILES} miles?`,
      a: `Sewer contractors often travel for a lateral repair. A ${METRO_RADIUS_MILES}-mile radius gives a practical first list for the region, not just offices inside city limits.`,
    },
    {
      q: `What other ${m.state} metros are listed?`,
      a:
        otherMetros.length > 0
          ? `${otherMetros.map((o) => o.name).join(', ')}. The full state list has every researched contractor in ${m.state}.`
          : `${m.name} is the only ${m.state} metro page so far. The full state list has every researched contractor.`,
    },
    {
      q: 'Are these recommendations?',
      a: 'No. Website-signal research, not endorsements. Verify licensing, insurance, references, and scope before you hire.',
    },
  ]

  return (
    <>
      <MetroCollectionJsonLd metro={m} count={nearby.length} preview={cardPreview} />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          { label: s?.name || m.state, href: `${LIST_BASE}/${m.stateSlug}` },
          {
            label: `Near ${m.name}`,
            href: `${LIST_BASE}/${m.stateSlug}/metros/${m.slug}`,
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            {
              label: s?.name || m.state,
              href: `${LIST_BASE}/${m.stateSlug}`,
            },
            { label: `Near ${m.name}` },
          ]}
        />
        <div className="mt-8 border-b border-[var(--color-border)] pb-12">
          <span className="eyebrow">Contractor research near</span>
          <h1 className="t-display mt-3">
            Sewer line repair near {m.name}
          </h1>
          <p className="meta mt-4">
            {m.stateAbbr} · within {METRO_RADIUS_MILES} miles · {nearby.length}{' '}
            contractors
          </p>
          <p className="t-body mt-6 max-w-[42rem] text-[18px]">
            {editorial.intro}
          </p>
          <StatCardGroup
            className="mt-10"
            columns={3}
            stats={[
              {
                label: `Within ${METRO_RADIUS_MILES} mi`,
                value: nearby.length,
              },
              { label: 'Dedicated pages', value: explicit.length },
              { label: `Other ${m.stateAbbr} metros`, value: otherMetros.length },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-12 lg:px-10">
        <div className="panel p-5 sm:p-6 md:p-8">
          <span className="eyebrow">Metro market notes</span>
          <h2 className="t-heading mt-4">Local sewer repair context near {m.name}</h2>
          <p className="t-body-sm mt-2 max-w-3xl">{editorial.marketNote}</p>
          {editorial.cityClusters.length > 0 ? (
            <p className="meta meta-soft mt-6">
              Top city clusters in this radius:{' '}
              {editorial.cityClusters
                .map((row) => `${row.city} (${row.count})`)
                .join(' · ')}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14 lg:px-10">
        <ContractorDotMap
          contractors={mapPreview.map(toContractorMapItem)}
          title={`Near ${m.name}`}
          eyebrow={`${m.stateAbbr} metro`}
          center={{ lat: m.lat, lng: m.lng, label: m.name }}
          radiusMiles={METRO_RADIUS_MILES}
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-10">
        <ZipSearchForm
          title="Refine by your ZIP"
          body="Sort the researched list by distance from your exact ZIP."
          compact
        />
      </section>

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
            title={`Near ${m.name}`}
            eyebrow="Metro list"
          />
        </Suspense>
        <ContractorLinkList
          contractors={nearby.map(toContractorListItem)}
          title={`All contractors near ${m.name}`}
        />
        {remainingCards > 0 ? (
          <p className="t-body-sm mt-6 max-w-2xl">
            Showing {cardPreview.length.toLocaleString()} cards of{' '}
            {listItems.length.toLocaleString()} contractors in this radius. The
            name list includes everyone.
          </p>
        ) : null}
      </section>

      {otherMetros.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
          <h2 className="t-section">Other {m.state} metros</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {otherMetros.map((o) => (
              <Link
                key={o.slug}
                href={`${LIST_BASE}/${o.stateSlug}/metros/${o.slug}`}
                className="rounded-btn border border-[var(--color-border)] px-4 py-2 text-[15px] font-semibold"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <FAQ items={faqs} />
      </section>
    </>
  )
}

function MetroCollectionJsonLd({
  metro,
  count,
  preview,
}: {
  metro: {
    name: string
    stateAbbr: string
    stateSlug: string
    slug: string
    lat: number
    lng: number
  }
  count: number
  preview: { name: string; stateSlug: string; slug: string }[]
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Sewer line repair near ${metro.name}, ${metro.stateAbbr}`,
    description: `${count} researched contractors near ${metro.name}.`,
    url: `${SITE_URL}${LIST_BASE}/${metro.stateSlug}/metros/${metro.slug}`,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE.name, url: SITE_URL },
    mainEntity: collectionItemList(preview),
    spatialCoverage: {
      '@type': 'Place',
      name: `${metro.name}, ${metro.stateAbbr}`,
      geo: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: metro.lat,
          longitude: metro.lng,
        },
        geoRadius: Math.round(METRO_RADIUS_MILES * 1609.344),
      },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
