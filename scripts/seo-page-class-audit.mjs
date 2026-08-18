#!/usr/bin/env node
/**
 * Fetch page-class URLs and extract SEO fields for the launch audit.
 * Usage: node scripts/seo-page-class-audit.mjs <base> [path ...]
 */
const base = (process.argv[2] || 'https://sewerlinerepair.vercel.app').replace(
  /\/$/,
  '',
)
const extra = process.argv.slice(3)

const defaultPaths = [
  '/',
  '/contractors',
  '/contractors/near-me',
  '/contractors/ak',
  '/contractors/ca',
  '/contractors/tx/metros/houston',
  '/contractors/tags/trenchless',
  '/contractors/tags/emergency-backup',
  '/contractors/tx/tags/cipp',
  '/guides/sewer-line-repair-cost',
  '/guides',
  '/about',
  '/contact',
  '/for-contractors',
  '/privacy',
  '/robots.txt',
  '/sitemap.xml',
]

const paths = extra.length ? extra : defaultPaths

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function meta(html, attr, value) {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
    'i',
  )
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`,
    'i',
  )
  return html.match(re)?.[1] || html.match(re2)?.[1] || null
}

function parsePage(html, path) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || null
  const canonical =
    html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    )?.[1] ||
    html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
    )?.[1] ||
    null
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    stripTags(m[1]),
  )
  const jsonLd = []
  const jsonLdErrors = []
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  )) {
    try {
      jsonLd.push(JSON.parse(m[1]))
    } catch (err) {
      jsonLdErrors.push(String(err.message || err))
    }
  }
  const types = []
  const walk = (node) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (node['@type']) types.push(node['@type'])
    if (node['@graph']) walk(node['@graph'])
    for (const v of Object.values(node)) {
      if (v && typeof v === 'object') walk(v)
    }
  }
  jsonLd.forEach(walk)

  const robotsMeta = meta(html, 'name', 'robots')
  const hasFaqVisible =
    /<h2[^>]*>[\s\S]{0,80}FAQ/i.test(html) ||
    html.includes('itemProp="acceptedAnswer"') ||
    /<button[^>]*>[\s\S]{0,120}\?<\/button>/i.test(html)
  const breadcrumbVisible = /breadcrumb|Home\s*\/|Home<\/a>/i.test(html)

  return {
    path,
    title,
    description: meta(html, 'name', 'description'),
    canonical,
    ogTitle: meta(html, 'property', 'og:title'),
    ogImage: meta(html, 'property', 'og:image'),
    twitterImage: meta(html, 'name', 'twitter:image'),
    robots: robotsMeta,
    h1Count: h1s.length,
    h1: h1s[0] || null,
    jsonLdTypes: [...new Set(types.flat())],
    jsonLdErrors,
    hasAggregateRating: types.flat().includes('AggregateRating'),
    hasReviewSchema: types.flat().includes('Review'),
    hasFaqPage: types.flat().includes('FAQPage'),
    hasBreadcrumbList: types.flat().includes('BreadcrumbList'),
    breadcrumbVisible,
    hasFaqVisible,
    htmlBytes: Buffer.byteLength(html),
    mentionsGenReview: /gen review/i.test(html),
    mentionsEvReview: /EV review/i.test(html),
  }
}

const results = []
const errors = []

for (const p of paths) {
  const url = p.startsWith('http') ? p : `${base}${p}`
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const contentType = res.headers.get('content-type') || ''
    const text = await res.text()
    const row = {
      path: p,
      status: res.status,
      location: res.headers.get('location'),
      contentType,
    }
    if (p.endsWith('.xml') || p.endsWith('.txt')) {
      results.push({
        ...row,
        bytes: Buffer.byteLength(text),
        sitemapDecl: text.includes('Sitemap:'),
        urlset: text.includes('<urlset') || text.includes('<sitemapindex'),
        locCount: [...text.matchAll(/<loc>/g)].length,
        hostSample: text.match(/https?:\/\/[^/]+/)?.[0] || null,
      })
      if (res.status !== 200) errors.push(`${p} HTTP ${res.status}`)
      continue
    }
    const parsed = parsePage(text, p)
    results.push({ ...row, ...parsed })
    if (res.status !== 200) errors.push(`${p} HTTP ${res.status}`)
    else {
      if (parsed.h1Count !== 1) errors.push(`${p} h1Count=${parsed.h1Count}`)
      if (!parsed.title) errors.push(`${p} missing title`)
      if (!parsed.description) errors.push(`${p} missing description`)
      if (!parsed.canonical) errors.push(`${p} missing canonical`)
      if (!parsed.ogImage) errors.push(`${p} missing og:image`)
      if (parsed.hasAggregateRating) errors.push(`${p} AggregateRating`)
      if (parsed.hasFaqPage) errors.push(`${p} FAQPage schema`)
      if (parsed.jsonLdErrors.length) errors.push(`${p} JSON-LD parse error`)
      if (parsed.mentionsGenReview || parsed.mentionsEvReview) {
        errors.push(`${p} leftover review label`)
      }
    }
  } catch (err) {
    errors.push(`${p} ${err.message}`)
    results.push({ path: p, error: String(err.message || err) })
  }
}

const titles = results.map((r) => r.title).filter(Boolean)
const titleDupes = titles.filter((t, i) => titles.indexOf(t) !== i)

const report = {
  base,
  checked: paths.length,
  uniqueTitles: new Set(titles).size,
  duplicateTitles: [...new Set(titleDupes)],
  errors,
  results,
}
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exit(1)
