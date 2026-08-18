#!/usr/bin/env node
/** Production/local smoke crawl for required routes. */
const base = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '')

const paths = [
  '/',
  '/contractors',
  '/contractors/near-me',
  '/contractors/tn',
  '/contractors/tx/metros/houston',
  '/guides/sewer-line-repair-cost',
  '/about',
  '/contact',
  '/privacy',
  '/for-contractors',
  '/robots.txt',
  '/sitemap.xml',
]

const errors = []
for (const p of paths) {
  const url = `${base}${p}`
  try {
    const res = await fetch(url, { redirect: 'manual' })
    if (res.status !== 200) errors.push(`${p} HTTP ${res.status}`)
    else {
      const text = await res.text()
      if (p === '/robots.txt' && !text.includes('Sitemap:')) {
        errors.push('robots missing Sitemap')
      }
      if (p === '/sitemap.xml' && !text.includes('<urlset') && !text.includes('<sitemapindex')) {
        errors.push('sitemap not xml')
      }
      if (!p.endsWith('.txt') && !p.endsWith('.xml') && !text.includes('<h1') && !text.includes('<H1')) {
        errors.push(`${p} missing h1`)
      }
    }
  } catch (err) {
    errors.push(`${p} ${err.message}`)
  }
}

const report = { base, checked: paths.length, errors }
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exit(1)
