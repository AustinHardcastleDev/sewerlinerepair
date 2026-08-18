import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import {
  REGIONS,
  TOTAL_INSTALLERS,
  TOTAL_STATES,
  states,
  NATIONAL_EXPLICIT,
  getStateBySlug,
} from '@/lib/contractors'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { pageMetadata } from '@/lib/seo'
import { ZipSearchForm } from '@/components/ZipSearchForm'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { CountChip } from '@/components/CountChip'
import { ButtonLink } from '@/components/Button'
import { brandCounts } from '@/lib/methods'
import { intentTagCounts } from '@/lib/directory-tags'
import { LIST_BASE } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Sewer Line Repair by State',
  description: `${TOTAL_INSTALLERS.toLocaleString()} sewer line contractors researched across ${TOTAL_STATES} states, sorted by website signal so buyers can start with a cleaner list.`,
  path: LIST_BASE,
})

const FAQS: FAQItem[] = [
  {
    q: 'Which state has the most sewer contractors?',
    a: `Florida leads on researched volume with ${states.fl.totalListings} listings (${states.fl.explicitCount} with a dedicated sewer page), followed by Texas at ${states.tx.totalListings}.`,
  },
  {
    q: 'How is each state list sorted?',
    a: 'Sewer-specific review count first (after any featured rows), then website signal, then overall Google review count. Filters let you require 1+, 5+, or 10+ sewer reviews.',
  },
  {
    q: 'What is the best way to find sewer repair near me?',
    a: 'Open the Near Me page for ZIP distance sorting, or start with a state hub and drill into a metro. Sewer crews often cover a wide radius, so state or regional search usually beats a narrow city-only search.',
  },
  {
    q: 'Are these contractors verified or endorsed?',
    a: 'No. This is website-signal research, not a license check or endorsement list. Confirm licensing, insurance, camera documentation, method options, permits, and restoration yourself.',
  },
  {
    q: 'Do I need to know the repair method first?',
    a: 'No. Start with website signal, then filter by CIPP, bursting, trenchless, or open-cut if you already know the method.',
  },
]

type Props = {
  searchParams: Promise<{ state?: string }>
}

export default async function ContractorsIndexPage({ searchParams }: Props) {
  const sp = await searchParams
  const stateParam = (sp.state || '').trim().toLowerCase()
  if (stateParam) {
    const bySlug = getStateBySlug(stateParam)
    const byNameOrAbbr = Object.values(states).find(
      (s) =>
        s.abbr.toLowerCase() === stateParam ||
        s.slug === stateParam ||
        s.name.toLowerCase() === stateParam,
    )
    const match = bySlug || byNameOrAbbr
    if (match) permanentRedirect(`${LIST_BASE}/${match.slug}`)
  }

  const brands = brandCounts()
  const intents = intentTagCounts()

  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors' },
          ]}
        />
        <span className="eyebrow mt-6 block w-fit">Start with the state</span>
        <h1 className="t-display mt-4">
          Sewer line repair research, sorted by state.
        </h1>
        <p className="t-body mt-6 max-w-3xl text-[18.5px]">
          {TOTAL_INSTALLERS.toLocaleString()} contractors researched across{' '}
          {TOTAL_STATES} states, {NATIONAL_EXPLICIT.toLocaleString()} with a
          dedicated sewer page. Pick the state where the work is and start
          with a list sorted by website signal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`${LIST_BASE}/near-me`}>
            Find contractors near me →
          </ButtonLink>
          <ButtonLink
            href="/guides/questions-to-ask-sewer-contractor"
            variant="secondary"
          >
            Questions to ask
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-12 lg:px-10">
        <ZipSearchForm
          title="Or search by ZIP"
          body="Use ZIP search when you care more about driving distance than state lines."
          compact
        />
      </section>

      {brands.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="eyebrow">Method signal pages</span>
            <div className="rule hidden min-w-8 flex-1 sm:block" />
            <span className="meta">{brands.length} methods</span>
          </div>
          <p className="t-body-sm mt-3 max-w-2xl">
            Already know lining, bursting, or open-cut? Filter by methods mentioned on
            contractor websites. The CIPP page is website-signal only, not a certified-installer list.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {brands.map(({ brand, count }) => (
              <Link
                key={brand.slug}
                href={`${LIST_BASE}/tags/${brand.slug}`}
                className="rounded-btn border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
              >
                {brand.slug === 'cipp'
                  ? 'CIPP lining contractors'
                  : brand.label}{' '}
                <span className="tabular text-[var(--color-muted)]">{count.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {intents.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="eyebrow">Emergency services</span>
            <div className="rule hidden min-w-8 flex-1 sm:block" />
            <span className="meta">{intents.length} filters</span>
          </div>
          <p className="t-body-sm mt-3 max-w-2xl">
            Listings with emergency or after-hours language in permitted reviews.
            Clearing a clog is not the same as structural sewer repair.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {intents.map(({ tag, count }) => (
              <Link
                key={tag.slug}
                href={`${LIST_BASE}/tags/${tag.slug}`}
                className="rounded-btn border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
              >
                {tag.shortLabel}{' '}
                <span className="tabular text-[var(--color-muted)]">
                  {count.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10">
        <div className="grid gap-8">
          {Object.entries(REGIONS).map(([region, slugs]) => (
            <div key={region}>
              <div className="flex items-center gap-4">
                <span className="eyebrow-bare">{region}</span>
                <div className="rule flex-1" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slugs.map((slug) => {
                  const s = states[slug]
                  if (!s) return null
                  return (
                    <Link
                      key={slug}
                      href={`${LIST_BASE}/${slug}`}
                      className="card group block p-5"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="t-heading group-hover:underline">
                          {s.name}
                        </span>
                        <CountChip count={s.totalListings} />
                      </div>
                      <div className="meta meta-soft mt-2">
                        {s.explicitCount.toLocaleString()} explicit
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <FAQ items={FAQS} />
      </section>
    </>
  )
}
