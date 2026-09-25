import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  MIN_STATE_TAG_INSTALLERS,
  getDirectoryTagBySlug,
  getContractorsByTagInState,
  getStateDirectoryTags,
  getTagFaqs,
  getTagH1,
  getTagIntro,
  getTagMetaDescription,
  getTagSeoTitle,
} from '@/lib/directory-tags'
import {
  getStateBySlug,
  states,
  sortContractorsBySignal,
  toContractorListItem,
  toContractorMapItem,
  TOTAL_INSTALLERS,
} from '@/lib/contractors'
import { FAQ } from '@/components/FAQ'
import { collectionItemList, pageMetadata } from '@/lib/seo'
import { DIRECTORY_LIST_PREVIEW_LIMIT } from '@/lib/tag-seo'
import { ContractorDotMap } from '@/components/ContractorDotMap'
import { FilteredContractors } from '@/components/FilteredContractors'
import { ContractorLinkList } from '@/components/ContractorLinkList'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { DirectoryTagCrossLinks } from '@/components/DirectoryTagCrossLinks'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ state: string; tag: string }> }

export function generateStaticParams() {
  return Object.keys(states).flatMap((state) =>
    getStateDirectoryTags(state).map((tag) => ({ state, tag: tag.slug })),
  )
}

export async function generateMetadata({ params }: Props) {
  const { state, tag: tagSlug } = await params
  const s = getStateBySlug(state)
  const tag = getDirectoryTagBySlug(tagSlug)
  if (!s || !tag) return {}
  const matches = getContractorsByTagInState(tag, state)
  if (matches.length < MIN_STATE_TAG_INSTALLERS) return {}
  return pageMetadata({
    title: getTagSeoTitle(tag, matches.length, s.name),
    description: getTagMetaDescription(tag, matches.length, s.name),
    path: `${LIST_BASE}/${s.slug}/tags/${tag.slug}`,
  })
}

export default async function StateDirectoryTagPage({ params }: Props) {
  const { state, tag: tagSlug } = await params
  const s = getStateBySlug(state)
  const tag = getDirectoryTagBySlug(tagSlug)
  if (!s || !tag) notFound()

  const matches = sortContractorsBySignal(
    getContractorsByTagInState(tag, state),
  )
  if (matches.length < MIN_STATE_TAG_INSTALLERS) {
    notFound()
  }

  const faqs = getTagFaqs(tag, matches.length, s.name)

  return (
    <>
      <StateTagJsonLd
        state={s}
        tag={tag}
        count={matches.length}
        preview={matches.slice(0, DIRECTORY_LIST_PREVIEW_LIMIT)}
      />
      <BreadcrumbListJsonLd
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contractors', href: LIST_BASE },
          { label: s.name, href: `${LIST_BASE}/${s.slug}` },
          {
            label: tag.shortLabel,
            href: `${LIST_BASE}/${s.slug}/tags/${tag.slug}`,
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contractors', href: LIST_BASE },
            { label: s.name, href: `${LIST_BASE}/${s.slug}` },
            { label: tag.shortLabel },
          ]}
        />
        <span className="eyebrow mt-6 block w-fit">
          {s.abbr} · {tag.eyebrow}
        </span>
        <h1 className="t-display mt-4">{getTagH1(tag, s.name)}</h1>
        <p className="t-body mt-6 max-w-3xl text-[18px]">
          {getTagIntro(tag, matches.length, TOTAL_INSTALLERS, s.name)}
        </p>
        {tag.slug === 'cipp' ? (
          <p className="t-body-sm mt-4 max-w-3xl">
            Use this {s.name} shortlist for CIPP lining signal on contractor
            websites. Then verify recent lateral lining jobs and warranty path
            directly.
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-10">
        <ContractorDotMap
          contractors={matches.map(toContractorMapItem)}
          title={`${tag.shortLabel} in ${s.abbr}`}
          eyebrow={
            tag.kind === 'brand' ? 'State method filter' : 'State emergency filter'
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
            contractors={matches.map(toContractorListItem)}
            title={`${tag.shortLabel} · ${s.name}`}
            eyebrow={tag.kind === 'brand' ? 'State method list' : 'State emergency list'}
          />
        </Suspense>
        <ContractorLinkList
          contractors={matches.map(toContractorListItem)}
          title={`All ${tag.shortLabel} matches in ${s.name}`}
        />
      </section>

      <DirectoryTagCrossLinks
        tag={tag}
        stateSlug={s.slug}
        stateName={s.name}
      />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 lg:px-10">
        <p className="t-body-sm">
          Prefer the full state list?{' '}
          <Link href={`${LIST_BASE}/${s.slug}`} className="link">
            Browse all {s.name} contractors
          </Link>
          .
        </p>
        <FAQ items={faqs} />
      </section>
    </>
  )
}

function StateTagJsonLd({
  state,
  tag,
  count,
  preview,
}: {
  state: { name: string; slug: string }
  tag: { label: string; slug: string; shortLabel: string }
  count: number
  preview: { name: string; stateSlug: string; slug: string }[]
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      tag.slug === 'cipp'
        ? `${state.name} CIPP lining contractors`
        : `${state.name} sewer line repair: ${tag.label}`,
    description: `${count} researched contractors in ${state.name} matching ${tag.shortLabel}.`,
    url: `${SITE_URL}${LIST_BASE}/${state.slug}/tags/${tag.slug}`,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE.name, url: SITE_URL },
    mainEntity: collectionItemList(preview),
    about: {
      '@type': 'Thing',
      name:
        tag.slug === 'cipp'
          ? `CIPP lining contractors in ${state.name}`
          : `${tag.label} sewer contractors in ${state.name}`,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
