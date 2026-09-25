import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  contractors,
  getContractorBySlug,
  getNearbyContractors,
  getStateBySlug,
  confidenceLabel,
  confidenceDescription,
  toContractorListItem,
  residentialConfidence,
  sewerReviewCount,
  normalizeReviewTags,
} from '@/lib/contractors'
import {
  getProfileLead,
  getProfileSubhead,
  getReviewSummaryText,
  getFaqSewerAnswer,
  getProfileMetaDescription,
  getProfileSeoTitle,
} from '@/lib/profile-copy'
import { FAQ, type FAQItem } from '@/components/FAQ'
import { directoryProfileEntity, pageMetadata, seoDescription, seoTitle } from '@/lib/seo'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { ContractorCard, ConfidenceBadge } from '@/components/ContractorCard'
import { SewerReviewsBadge } from '@/components/SewerReviewsBadge'
import { SponsoredTag } from '@/components/SponsoredTag'
import { ButtonLink } from '@/components/Button'
import { getBrandById } from '@/lib/methods'
import { resolveBrandTagPageHref } from '@/lib/internal-links'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ state: string; slug: string }> }

export function generateStaticParams() {
  return contractors.map((i) => ({
    state: i.stateSlug,
    slug: i.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { state, slug } = await params
  const contractor = getContractorBySlug(state, slug)
  if (!contractor) return {}
  const location = contractor.city
    ? `${contractor.city}, ${contractor.stateAbbr}`
    : contractor.state
  const title = getProfileSeoTitle(contractor)
  const name = seoTitle(contractor.name)
  const description = seoDescription(
    getProfileMetaDescription(
      contractor,
      `Sewer repair research notes for ${name} in ${location}: website signal, reviews, contact links, and questions to confirm before requesting a quote.`,
    ),
  )
  return pageMetadata({
    title,
    description,
    path: `${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`,
    absoluteTitle: true,
  })
}

export default async function ContractorProfilePage({ params }: Props) {
  const { state, slug } = await params
  const contractor = getContractorBySlug(state, slug)
  if (!contractor) notFound()

  const s = getStateBySlug(state)
  const nearby = getNearbyContractors(contractor, 6)
  const location = contractor.city
    ? `${contractor.city}, ${contractor.stateAbbr}`
    : contractor.state
  const profileLead = getProfileLead(contractor)
  const profileSubhead = getProfileSubhead(contractor)
  const reviewSummary = getReviewSummaryText(contractor)
  const faqSewerAnswer = getFaqSewerAnswer(contractor)
  const displayTags = normalizeReviewTags(
    contractor.sewerScopedTags?.length
      ? contractor.sewerScopedTags
      : contractor.reviewTags,
  )
  const sewerCount = sewerReviewCount(contractor)

  const faqs: FAQItem[] = [
    {
      q: `Does ${contractor.name} install sewer lines?`,
      a:
        faqSewerAnswer ||
        contractor.sewerReasoning ||
        `${confidenceDescription(residentialConfidence(contractor) || 'medium')} Confirm scope, recent projects, and service area directly before you make any commitment.`,
    },
    {
      q: `Is ${contractor.name} recommended?`,
      a: 'No. This page is researched website signal, not an endorsement. Confirm licensing, insurance, references, camera documentation, method options, permits, and restoration yourself.',
    },
    {
      q: 'What does the website-signal label mean?',
      a: confidenceDescription(residentialConfidence(contractor) || 'medium'),
    },
    {
      q: 'How do I request a correction?',
      a: 'Use the For Contractors page and include the correct URL that shows your sewer line work.',
    },
  ]

  return (
    <>
      <LocalBusinessJsonLd
        contractor={contractor}
        description={profileLead}
      />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          { label: s?.name || contractor.state, href: `${LIST_BASE}/${state}` },
          {
            label: contractor.name,
            href: `${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`,
          },
        ]}
      />

      <article className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            {
              label: s?.name || contractor.state,
              href: `${LIST_BASE}/${state}`,
            },
            { label: contractor.name },
          ]}
        />

        <header className="mt-8 border-b border-[var(--color-border)] pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">
              {contractor.categoryName || 'Contractor'}
            </span>
            {contractor.sponsored ? <SponsoredTag /> : null}
          </div>
          <h1 className="t-display mt-4">{contractor.name}</h1>
          <p className="t-body mt-4 max-w-3xl text-[18px] text-[var(--color-body)]">
            {profileSubhead}
          </p>
          <p className="meta mt-3">{location}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ConfidenceBadge confidence={residentialConfidence(contractor) || 'medium'} />
            <SewerReviewsBadge count={sewerCount} />
            {(contractor.reviewsCount || 0) > 0 ? (
              <span className="meta meta-soft">
                {(contractor.reviewsCount || 0).toLocaleString()} Google reviews
                <span className="text-[var(--color-faint)]">
                  {' '}
                  (third-party · not verified here)
                </span>
              </span>
            ) : null}
          </div>
          <p className="t-body mt-6 max-w-3xl text-[18px]">{profileLead}</p>
          {reviewSummary ? (
            <p className="t-body-sm mt-4 max-w-3xl">{reviewSummary}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {contractor.website ? (
              <ButtonLink href={contractor.website} external>
                Visit website
              </ButtonLink>
            ) : null}
            {contractor.phone ? (
              <a href={`tel:${contractor.phone}`} className="btn btn-secondary">
                Call {contractor.phone}
              </a>
            ) : null}
            <ButtonLink href={`${LIST_BASE}/${state}`} variant="secondary">
              Back to {s?.name || 'state'} list
            </ButtonLink>
          </div>
        </header>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="panel p-6">
            <h2 className="t-heading">Website signal</h2>
            <p className="t-body-sm mt-3">
              {confidenceDescription(residentialConfidence(contractor) || 'medium')}
            </p>
            <p className="meta meta-soft mt-3">
              Label: {confidenceLabel(residentialConfidence(contractor) || 'medium')}
            </p>
            {contractor.dedicatedPage ? (
              <p className="mt-4 text-[15px]">
                <a
                  href={contractor.dedicatedPage}
                  className="link font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open their sewer page →
                </a>
              </p>
            ) : null}
            {contractor.primaryBrands?.length ? (
              <p className="meta meta-soft mt-4">
                Methods mentioned:{' '}
                {contractor.primaryBrands.map((brandId, index) => {
                  const brand = getBrandById(brandId)
                  const label = brand?.label || brandId.replace(/_/g, ' ')
                  const href = resolveBrandTagPageHref(contractor, brandId)
                  return (
                    <span key={brandId}>
                      {index > 0 ? ', ' : ''}
                      {href ? (
                        <Link href={href} className="link">
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                    </span>
                  )
                })}
              </p>
            ) : null}
            <div className="mt-3">
              <SewerReviewsBadge count={sewerReviewCount(contractor)} />
            </div>
          </div>
          <div className="panel p-6">
            <h2 className="t-heading">Contact</h2>
            <dl className="mt-4 space-y-3 text-[15.5px]">
              {contractor.address ? (
                <div>
                  <dt className="meta">Address</dt>
                  <dd className="mt-1 text-[var(--color-ink)]">
                    {contractor.address}
                  </dd>
                </div>
              ) : null}
              {contractor.phone ? (
                <div>
                  <dt className="meta">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${contractor.phone}`} className="link">
                      {contractor.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contractor.emails?.[0] ? (
                <div>
                  <dt className="meta">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${contractor.emails[0]}`} className="link">
                      {contractor.emails[0]}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contractor.website ? (
                <div>
                  <dt className="meta">Website</dt>
                  <dd className="mt-1 break-all">
                    <a
                      href={contractor.website}
                      className="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contractor.website.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>

        {displayTags && displayTags.length > 0 ? (
          <section className="mt-12">
            <h2 className="t-heading">Themes in reviews</h2>
            <p className="t-body-sm mt-2 max-w-2xl">
              Tags come from scraped Google reviews
              {contractor.sewerScopedTags?.length
                ? ', preferring sewer-related reviews when available'
                : ''}
              . Not an endorsement.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {displayTags.slice(0, 12).map((tag) => (
                <li
                  key={tag.id}
                  className="rounded-btn border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-[13px] font-semibold text-[var(--color-ink)]"
                >
                  {tag.label}
                  <span className="meta meta-soft ml-2 tabular">
                    {tag.matchedReviewCount}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {nearby.length > 0 ? (
          <section className="mt-16">
            <h2 className="t-section">Nearby in {s?.name || contractor.state}</h2>
            <p className="t-body-sm mt-2">
              Other researched contractors nearby, still not endorsements.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {nearby.map((item) => (
                <ContractorCard
                  key={item.id}
                  contractor={toContractorListItem(item)}
                />
              ))}
            </div>
          </section>
        ) : null}

        <FAQ items={faqs} />

        <p className="t-body-sm mt-10">
          <Link href="/for-contractors" className="link">
            Claim or correct this listing
          </Link>
          {' · '}
          <Link href="/guides/questions-to-ask-sewer-contractor" className="link">
            Questions to ask before you call
          </Link>
        </p>
      </article>
    </>
  )
}

function LocalBusinessJsonLd({
  contractor,
  description,
}: {
  contractor: {
    name: string
    address: string
    city: string
    stateAbbr: string
    phone: string
    website: string
    stateSlug: string
    slug: string
    lat: number | null
    lng: number | null
    reviewsCount: number | null
    categoryName?: string
  }
  description: string
}) {
  const profileUrl = `${SITE_URL}${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`
  const entity = directoryProfileEntity(profileUrl, contractor.website)
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${profileUrl}#business`,
    name: contractor.name,
    description,
    url: entity.url,
    mainEntityOfPage: profileUrl,
    telephone: contractor.phone || undefined,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE.name,
      url: SITE_URL,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contractor.address || undefined,
      addressLocality: contractor.city || undefined,
      addressRegion: contractor.stateAbbr || undefined,
      addressCountry: 'US',
    },
  }
  if (entity.sameAs) json.sameAs = entity.sameAs
  if (contractor.city) {
    json.areaServed = {
      '@type': 'City',
      name: `${contractor.city}, ${contractor.stateAbbr}`,
    }
  }
  if (contractor.lat != null && contractor.lng != null) {
    json.geo = {
      '@type': 'GeoCoordinates',
      latitude: contractor.lat,
      longitude: contractor.lng,
    }
  }
  // Google review totals stay in the UI with attribution; omit AggregateRating
  // from JSON-LD; these are not first-party reviews hosted by this site.
  if (contractor.categoryName) {
    json.knowsAbout = [
      contractor.categoryName,
      'Residential sewer repair',
      'Sewer line replacement',
      'Trenchless sewer lining',
    ]
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
