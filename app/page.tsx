import Link from 'next/link'
import {
  contractors,
  REGIONS,
  states,
  TOTAL_INSTALLERS,
  TOTAL_STATES,
  toContractorListItem,
  residentialConfidence,
} from '@/lib/contractors'
import { ContractorLinkList } from '@/components/ContractorLinkList'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'
import { pageMetadata } from '@/lib/seo'
import { ZipSearchForm } from '@/components/ZipSearchForm'
import { RepairCostCta } from '@/components/RepairCostCta'
import { ButtonLink } from '@/components/Button'
import { CountChip } from '@/components/CountChip'
import { GUIDES } from '@/lib/guides'
import { Container, SectionHeading } from '@/components/Section'
import { HeroSewerPhoto } from '@/components/SewerRepairPhotos'
import { getHomepageDiscoverySample } from '@/lib/homepage-discovery'
import { brandCounts } from '@/lib/methods'
import { intentTagCounts } from '@/lib/directory-tags'

const discoverySample = getHomepageDiscoverySample()

export const metadata = pageMetadata({
  title: SITE.name,
  description: SITE.description,
  path: '/',
  absoluteTitle: true,
})

const FAQS: FAQItem[] = [
  {
    q: 'How does SewerLineRepairList decide who makes the list?',
    a: 'We cast a wide net, then check contractor websites ourselves. A company stays on the list when their own site shows residential sewer lateral repair or replacement signal: a dedicated page, repeated statements, or at least one clear repair statement worth a first call.',
  },
  {
    q: 'What is a dedicated sewer page?',
    a: 'A page on the contractor\'s own website about sewer line repair or replacement work. It is the strongest website signal we track. You still need to verify licensing, insurance, lateral ownership, permits, and restoration yourself.',
  },
  {
    q: 'Do drain cleaning or septic pumping companies qualify?',
    a: 'Not by themselves. Camera inspection, hydro jetting, root cutting, and septic pumping can support a repair job, but this directory looks for structural sewer line repair or replacement evidence.',
  },
  {
    q: 'Where should I search if I want contractors near me?',
    a: 'Use the Near Me page for ZIP distance sorting. Metro pages cover a 50-mile radius when enough residential contractors qualify.',
  },
  {
    q: 'What should I ask before requesting a quote?',
    a: 'Ask who owns the lateral section, whether a camera locate is included, trenchless versus excavation options, who pulls permits, what restoration covers, and what the written warranty excludes.',
  },
  {
    q: 'I am a contractor. How do I get listed or correct an entry?',
    a: 'Open the For Contractors page and send the correction or the URL that shows your sewer line work. Include enough detail for us to match the right listing.',
  },
]

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12 lg:px-10">
        <ZipSearchForm compact />
      </section>
      <BrandDiscovery />
      <BuyerGuides />
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <RepairCostCta />
      </section>
      <StateGrid />
      <HowItWorks />
      <PullQuote />
      <Container>
        <FAQ items={FAQS} />
      </Container>
      <DiscoveryContractors />
      <ClosingCta />
    </>
  )
}

function Hero() {
  const liveExplicit = contractors.filter(
    (i) => residentialConfidence(i) === 'explicit',
  ).length
  const liveHigh = contractors.filter((i) => residentialConfidence(i) === 'high').length
  const liveMedium = contractors.filter(
    (i) => residentialConfidence(i) === 'medium',
  ).length

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 md:pt-24 lg:px-10">
      <div className="grid items-end gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <span className="eyebrow">
            Residential sewer lateral research nationwide
          </span>
          <h1 className="t-display mt-5">
            Sewer line repair, from someone who&apos;s done it before.
          </h1>
          <p className="t-body mt-8 max-w-2xl text-[19px]">
            Sewer trouble hides behind plumbers, drain cleaners, excavation crews, and trenchless specialists. We look for contractor websites showing residential lateral repair, lining, bursting, or replacement work.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`${LIST_BASE}/near-me`}>
              Find sewer contractors near me
            </ButtonLink>
            <ButtonLink href="/about" variant="secondary">
              See how listings qualify
            </ButtonLink>
          </div>
        </div>
        <div className="md:border-l md:border-[var(--color-border)] md:pl-6">
          <HeroSewerPhoto />
          <div className="meta mt-6">What the research found</div>
          <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-[var(--color-body)]">
            <p>
              <span className="tabular text-[22px] font-extrabold text-[var(--color-ink)]">
                {TOTAL_INSTALLERS.toLocaleString()}
              </span>{' '}
              researched contractors across {TOTAL_STATES} states.
            </p>
            <p>
              <span className="tabular text-[22px] font-extrabold text-[var(--color-ink)]">
                {liveExplicit.toLocaleString()}
              </span>{' '}
              explicit, {liveHigh.toLocaleString()} strong, and{' '}
              {liveMedium.toLocaleString()} moderate signal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function StateGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10">
      <SectionHeading
        eyebrow="Start here"
        title="Pick the state where the work is"
        subtitle={`${TOTAL_INSTALLERS.toLocaleString()} researched contractors across ${TOTAL_STATES} states, sorted by website signal.`}
      />
      <div className="mt-12 grid gap-8">
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
  )
}

function DiscoveryContractors() {
  return (
    <ContractorLinkList
      contractors={discoverySample.map(toContractorListItem)}
      title="A few more places to start"
      description="One researched contractor from each state: a quick cross-country sample if you want to browse beyond your home market. We refresh this set weekly."
      eyebrow="Around the country"
      className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10"
      showConfidence={false}
    />
  )
}

function BrandDiscovery() {
  const intents = intentTagCounts()
  const brands = brandCounts()
  if (intents.length === 0 && brands.length === 0) return null
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10">
      {brands.length > 0 ? (
        <>
          <SectionHeading
            eyebrow="Optional method filter"
            title="Trenchless repair or open-cut excavation?"
            subtitle="Narrow by methods mentioned on contractor websites. CIPP, bursting, trenchless, and open-cut hubs are website-signal shortlists, not certified-installer directories."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {brands.map(({ brand, count }) => (
              <Link
                key={brand.slug}
                href={`${LIST_BASE}/tags/${brand.slug}`}
                className="rounded-btn border border-[var(--color-border)] px-4 py-2 text-[15px] font-semibold"
              >
                {brand.slug === 'cipp'
                  ? 'CIPP lining contractors'
                  : brand.label}{' '}
                <span className="tabular text-[var(--color-muted)]">
                  {count.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
      {intents.length > 0 ? (
        <div className={brands.length > 0 ? 'mt-16' : undefined}>
          <SectionHeading
            eyebrow="Emergency services"
            title="Need after-hours backup help?"
            subtitle="These listings have emergency or after-hours language in permitted reviews. Clearing a clog is not the same as structural sewer repair."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {intents.map(({ tag, count }) => (
              <Link
                key={tag.slug}
                href={`${LIST_BASE}/tags/${tag.slug}`}
                className="rounded-btn border border-[var(--color-border)] px-4 py-2 text-[15px] font-semibold"
              >
                {tag.shortLabel}{' '}
                <span className="tabular text-[var(--color-muted)]">
                  {count.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      t: 'We cast a wide net',
      b: 'Plumbers and sewer contractors whose websites show residential lateral repair or replacement signal.',
    },
    {
      n: '02',
      t: 'We check the website',
      b: 'Dedicated sewer pages rank highest. Repeated mentions next. A single clear signal still makes the list.',
    },
    {
      n: '03',
      t: 'You make the calls',
      b: 'Licenses, camera documentation, method options, permits, restoration: that verification is still yours. We just filter the noise.',
    },
  ]
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10">
      <SectionHeading
        eyebrow="The method"
        title="Real website signal. Independent ranking."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.n} className="panel p-6">
            <div className="meta">{step.n}</div>
            <h3 className="t-heading mt-3">{step.t}</h3>
            <p className="t-body-sm mt-3">{step.b}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BuyerGuides() {
  const picks = GUIDES.filter((g) => g.phase === 'P0')
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-10">
      <SectionHeading
        eyebrow="Buyer guides"
        title="Read before you request quotes"
        subtitle="Cost, methods, and the first-call questions, written from primary sources, not contractor blogs."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {picks.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="card p-6">
            <span className="eyebrow-bare">{guide.eyebrow}</span>
            <h3 className="t-heading mt-3">{guide.title}</h3>
            <p className="t-body-sm mt-3">{guide.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/guides" className="link text-[16px] font-semibold">
          All buyer guides →
        </Link>
      </div>
    </section>
  )
}

function PullQuote() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-10">
      <blockquote className="max-w-3xl border-l-4 border-[var(--color-accent)] pl-6">
        <p className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.035em] text-[var(--color-ink)] sm:text-[32px]">
          Not an endorsement. A better place to start.
        </p>
        <footer className="meta mt-4">
          Website signal · Buyer-first research · Independent
        </footer>
      </blockquote>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="band-dark mt-16">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-10">
        <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
          Start with your state.
        </h2>
        <p className="mt-4 max-w-xl text-[17px] text-[var(--color-band-body)]">
          {TOTAL_INSTALLERS.toLocaleString()} researched contractors across{' '}
          {TOTAL_STATES} states, with unique market notes on every state page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={LIST_BASE}>Open the state list</ButtonLink>
          <ButtonLink href={`${LIST_BASE}/near-me`} variant="secondary">
            Search near me
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function HomeJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
