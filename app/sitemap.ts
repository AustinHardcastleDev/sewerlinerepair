import type { MetadataRoute } from 'next'
import { DIRECTORY_TAGS, getStateDirectoryTags, nationalTagQualifies } from '@/lib/directory-tags'
import { GUIDES } from '@/lib/guides'
import { GUIDE_DATE_MODIFIED } from '@/lib/guide-provenance'
import { contractors, getIndexableStateSlugs, states } from '@/lib/contractors'
import { getIndexableMetros } from '@/lib/metros'
import { LIST_BASE, SITE, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

/** Editorial/content date for guides and core static pages, not a build stamp. */
const CONTENT_UPDATED = new Date(GUIDE_DATE_MODIFIED)

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}${LIST_BASE}`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: `${base}${LIST_BASE}/near-me`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    { url: `${base}/guides`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    {
      url: `${base}/for-contractors`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    { url: `${base}/contact`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: CONTENT_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${base}/guides/${guide.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Directory URLs omit lastmod; a shared build timestamp is not a real update date.
  const stateRoutes: MetadataRoute.Sitemap = getIndexableStateSlugs().map((slug) => ({
    url: `${base}${LIST_BASE}/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const metroRoutes: MetadataRoute.Sitemap = getIndexableMetros().map((m) => ({
    url: `${base}${LIST_BASE}/${m.stateSlug}/metros/${m.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const tagRoutes: MetadataRoute.Sitemap = DIRECTORY_TAGS.filter(
    nationalTagQualifies,
  ).map((tag) => ({
    url: `${base}${LIST_BASE}/tags/${tag.slug}`,
    changeFrequency: 'weekly' as const,
    priority: tag.kind === 'intent' ? 0.74 : 0.72,
  }))

  const stateTagRoutes: MetadataRoute.Sitemap = Object.keys(states).flatMap(
    (stateSlug) =>
      getStateDirectoryTags(stateSlug).map((tag) => ({
        url: `${base}${LIST_BASE}/${stateSlug}/tags/${tag.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
  )

  const contractorRoutes: MetadataRoute.Sitemap = contractors.map((i) => ({
    url: `${base}${LIST_BASE}/${i.stateSlug}/${i.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...stateRoutes,
    ...metroRoutes,
    ...tagRoutes,
    ...stateTagRoutes,
    ...contractorRoutes,
  ]
}
