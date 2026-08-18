import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  DIRECTORY_TAGS,
  NATIONAL_TAG_MAP_LIMIT,
  NATIONAL_TAG_PREVIEW_LIMIT,
  getDirectoryTagBySlug,
  getContractorsByTag,
  getStateCountsForTag,
  getTagFaqs,
  getTagH1,
  getTagIntro,
  getTagMetaDescription,
  getTagSeoTitle,
  nationalTagQualifies,
} from '@/lib/directory-tags'
import {
  sortContractorsBySignal,
  toContractorListItem,
  toContractorMapItem,
  TOTAL_INSTALLERS,
} from '@/lib/contractors'
import { FAQ } from '@/components/FAQ'
import { pageMetadata } from '@/lib/seo'
import { ContractorDotMap } from '@/components/ContractorDotMap'
import { FilteredContractors } from '@/components/FilteredContractors'
import { ContractorLinkList } from '@/components/ContractorLinkList'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { DirectoryTagCrossLinks } from '@/components/DirectoryTagCrossLinks'
import { CountChip } from '@/components/CountChip'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ tag: string }> }

export function generateStaticParams() {
  return DIRECTORY_TAGS.filter(nationalTagQualifies).map((tag) => ({
    tag: tag.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { tag: tagSlug } = await params
  const tag = getDirectoryTagBySlug(tagSlug)
  if (!tag) return {}
  const matches = getContractorsByTag(tag)
  return pageMetadata({
    title: getTagSeoTitle(tag, matches.length),
    description: getTagMetaDescription(tag, matches.length),
    path: `${LIST_BASE}/tags/${tag.slug}`,
  })
}

export default async function DirectoryTagPage({ params }: Props) {
  const { tag: tagSlug } = await params
  const tag = getDirectoryTagBySlug(tagSlug)
  if (!tag || !nationalTagQualifies(tag)) notFound()

  const matches = sortContractorsBySignal(getContractorsByTag(tag))
  const preview = matches.slice(0, NATIONAL_TAG_PREVIEW_LIMIT)
  const mapPreview = matches.slice(0, NATIONAL_TAG_MAP_LIMIT)
  const stateCounts = getStateCountsForTag(tag)
  const faqs = getTagFaqs(tag, matches.length)
  const remaining = Math.max(0, matches.length - preview.length)

  return (
    <>
      <TagCollectionJsonLd
        tag={tag}
        totalCount={matches.length}
        preview={preview}
      />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          {
            label: tag.shortLabel,
            href: `${LIST_BASE}/tags/${tag.slug}`,
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            { label: tag.shortLabel },
          ]}
        />
        <span className="eyebrow mt-6 block w-fit">{tag.eyebrow}</span>
        <h1 className="t-display mt-4">{getTagH1(tag)}</h1>
        <p className="t-body mt-6 max-w-3xl text-[18px]">
          {getTagIntro(tag, matches.length, TOTAL_INSTALLERS)}
        </p>
        {tag.slug === 'cipp' ? (
          <div className="t-body-sm mt-6 max-w-3xl space-y-3">
            <p>
              <strong className="text-[var(--color-ink)]">Method signal.</strong>{' '}
              These listings mention cured-in-place pipe (CIPP) lining on their
              websites. A mention is not a manufacturer authorization check.
            </p>
            <p>
              <strong className="text-[var(--color-ink)]">Before you hire.</strong>{' '}
              Confirm camera documentation, host-pipe condition, cleanouts,
              permits, and how restoration is priced. Ask for recent residential
              lateral CIPP jobs near your address.
            </p>
            <p>
              <strong className="text-[var(--color-ink)]">Category blur.</strong>{' '}
              Drain cleaning or hydro jetting alone does not prove structural
              lining work. Make the contractor show the repair method in writing.
            </p>
          </div>
        ) : null}
      </section>

      {matches.length > 0 ? (
        <>
          <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
            <div className="mb-6">
              <span className="eyebrow">Browse by state</span>
              <h2 className="t-heading mt-2">
                {tag.shortLabel} matches by state
              </h2>
              <p className="t-body-sm mt-2 max-w-2xl">
                Open a state page for the full {tag.shortLabel.toLowerCase()}{' '}
                list in that market. National pages preview the strongest{' '}
                {NATIONAL_TAG_PREVIEW_LIMIT} matches only.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {stateCounts.map((entry) => (
                <li key={entry.stateSlug}>
                  <Link
                    href={`${LIST_BASE}/${entry.stateSlug}/tags/${tag.slug}`}
                    className="flex items-center justify-between gap-2 rounded-card border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
                  >
                    <span className="truncate font-medium">
                      {entry.stateName}
                    </span>
                    <CountChip count={entry.count} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-10">
            <ContractorDotMap
              contractors={mapPreview.map(toContractorMapItem)}
              title={`${tag.shortLabel} contractors (preview)`}
              eyebrow={
                tag.kind === 'brand'
                  ? 'National method filter'
                  : 'National emergency filter'
              }
            />
          </section>
          <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
            <Suspense
              fallback={
                <p className="text-[16px] text-[var(--color-muted)]">
                  Loading filters…
                </p>
              }
            >
              <FilteredContractors
                contractors={preview.map(toContractorListItem)}
                title={`Top ${preview.length} ${tag.shortLabel} matches`}
                eyebrow={tag.kind === 'brand' ? 'Method list' : 'Emergency list'}
              />
            </Suspense>
            <ContractorLinkList
              contractors={preview.map(toContractorListItem)}
              title={`Top ${preview.length} ${tag.shortLabel} profile links`}
            />
            {remaining > 0 ? (
              <p className="t-body-sm mt-6 max-w-2xl">
                Showing {preview.length.toLocaleString()} of{' '}
                {matches.length.toLocaleString()} national matches. Use the
                state grid above for the rest (
                {remaining.toLocaleString()} more), or open{' '}
                <Link href={LIST_BASE} className="link">
                  all contractors by state
                </Link>
                .
              </p>
            ) : null}
          </section>
        </>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-10">
          <p className="t-body">
            No matches for {tag.label} yet.{' '}
            <Link href={LIST_BASE} className="link">
              Browse all contractors by state
            </Link>
            .
          </p>
        </section>
      )}

      <DirectoryTagCrossLinks tag={tag} />

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
        <FAQ items={faqs} />
      </section>
    </>
  )
}

function TagCollectionJsonLd({
  tag,
  totalCount,
  preview,
}: {
  tag: { label: string; slug: string; shortLabel: string }
  totalCount: number
  preview: { name: string; stateSlug: string; slug: string }[]
}) {
  const pageUrl = `${SITE_URL}${LIST_BASE}/tags/${tag.slug}`
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    name:
      tag.slug === 'cipp'
        ? 'CIPP lining contractors'
        : `${tag.label} sewer contractors`,
    description: `${totalCount} researched contractors matching ${tag.shortLabel}.`,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE.name,
      url: SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name:
        tag.slug === 'cipp'
          ? 'CIPP lining contractors'
          : `${tag.label} sewer line contractors`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: preview.length,
      itemListElement: preview.map((contractor, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${LIST_BASE}/${contractor.stateSlug}/${contractor.slug}`,
        name: contractor.name,
      })),
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
