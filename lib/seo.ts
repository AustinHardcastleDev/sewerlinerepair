import type { Metadata } from 'next'
import { SITE, SITE_URL } from './site'

const TITLE_LIMIT_BEFORE_BRAND = 50
const DESCRIPTION_LIMIT = 155

/**
 * Same sewer photo as the homepage hero, cropped to 1200×630 for
 * iMessage / Open Graph previews.
 */
export const OG_IMAGE = {
  url: '/images/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Residential sewer line on a concrete pad beside a brick house',
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function truncateText(value: string, limit: number): string {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  const sliced = clean.slice(0, Math.max(0, limit - 1)).trimEnd()
  const lastSpace = sliced.lastIndexOf(' ')
  const base = lastSpace > limit * 0.65 ? sliced.slice(0, lastSpace) : sliced
  return `${base.trimEnd()}…`
}

export function seoTitle(value: string): string {
  return truncateText(value, TITLE_LIMIT_BEFORE_BRAND)
}

export function seoDescription(value: string): string {
  return truncateText(value, DESCRIPTION_LIMIT)
}

/**
 * Long-form guides opt into `og:type=article`. Directory and index pages
 * stay `website`; they are collections, not articles.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  absoluteTitle = false,
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  /** Skip the site-name title template (profiles / long titles). */
  absoluteTitle?: boolean
}): Metadata {
  const cleanTitle = absoluteTitle ? title.trim() : seoTitle(title)
  const cleanDescription = seoDescription(description)
  const url = absoluteUrl(path)

  return {
    title: absoluteTitle ? { absolute: cleanTitle } : cleanTitle,
    description: cleanDescription,
    alternates: { canonical: url },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      siteName: SITE.name,
      url,
      images: [OG_IMAGE],
      ...(type === 'article'
        ? { type: 'article' as const, authors: [absoluteUrl('/about')] }
        : { type: 'website' as const }),
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      images: [OG_IMAGE.url],
    },
  }
}
