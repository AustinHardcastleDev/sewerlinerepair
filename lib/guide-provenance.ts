import { SITE } from './site'
import { absoluteUrl } from './seo'

/** Shared editorial provenance for buyer guides. */
export const GUIDE_REVIEWED_LABEL = 'Reviewed August 13, 2026'
export const GUIDE_DATE_PUBLISHED = '2026-08-12'
export const GUIDE_DATE_MODIFIED = '2026-08-13'

export const GUIDE_AUTHOR = {
  name: `${SITE.name} Editorial`,
  url: '/about',
}

export type GuideSource = {
  label: string
  href: string
}

/** Default citations. Prefer primary municipal, code, and agency sources. */
export const DEFAULT_GUIDE_SOURCES: GuideSource[] = [
  {
    label: 'EPA: septic systems and sewer basics',
    href: 'https://www.epa.gov/septic',
  },
  {
    label: 'International Plumbing Code overview (ICC)',
    href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/',
  },
  {
    label: 'FEMA: sewer backup and flood insurance context',
    href: 'https://www.fema.gov/flood-insurance',
  },
]

/** Per-guide claim → source map used by Article schema citations. */
export const GUIDE_CLAIMS: Record<
  string,
  { claim: string; sourceLabels: string[] }[]
> = {
  'sewer-line-repair-cost': [
    {
      claim:
        'Final cost depends on diagnosis, access, method, length/depth, restoration, permits, and right-of-way. There is no single national sticker price.',
      sourceLabels: ['EPA: septic systems and sewer basics'],
    },
  ],
  'insurance-and-sewer-backup': [
    {
      claim:
        'Standard homeowners policies often exclude sewer backup unless an endorsement or service-line rider applies; check the current policy.',
      sourceLabels: ['FEMA: sewer backup and flood insurance context'],
    },
  ],
}

export function guideArticleJsonLd({
  title,
  description,
  slug,
  sources = DEFAULT_GUIDE_SOURCES,
}: {
  title: string
  description: string
  slug: string
  sources?: GuideSource[]
}) {
  const url = absoluteUrl(`/guides/${slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: GUIDE_DATE_PUBLISHED,
    dateModified: GUIDE_DATE_MODIFIED,
    author: {
      '@type': 'Organization',
      name: GUIDE_AUTHOR.name,
      url: absoluteUrl(GUIDE_AUTHOR.url),
    },
    publisher: {
      '@type': 'Organization',
      '@id': absoluteUrl('/#organization'),
      name: SITE.name,
      url: absoluteUrl('/'),
    },
    citation: sources.map((source) => source.href),
  }
}
