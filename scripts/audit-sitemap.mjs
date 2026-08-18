#!/usr/bin/env node
/** Playbook 15C sitemap audit against a live or built sitemap URL / file. */
import fs from 'node:fs'

const input = process.argv[2]
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sewerlinerepairlist.com'
).replace(/\/$/, '')
const host = new URL(siteUrl).host
if (!input) {
  console.error('usage: audit-sitemap.mjs <sitemap.xml path or URL>')
  process.exit(1)
}

let xml
if (input.startsWith('http')) {
  xml = await fetch(input, { redirect: 'follow' }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.text()
  })
} else {
  xml = fs.readFileSync(input, 'utf8')
}

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const errors = []
if (locs.length === 0) errors.push('no loc entries')
if (locs.length !== new Set(locs).size) errors.push('duplicate loc')
if (locs.length > 50000) errors.push(`too many URLs ${locs.length}`)
for (const loc of locs.slice(0, 20)) {
  try {
    const u = new URL(loc)
    if (u.host !== host) errors.push(`non-canonical host ${u.host}`)
  } catch {
    errors.push(`bad loc ${loc}`)
  }
}
if (locs.some((l) => l.includes('/blog'))) errors.push('blog URLs present')
if (locs.some((l) => l.includes('/installers'))) errors.push('legacy installers URLs')

const report = { count: locs.length, host, sample: locs.slice(0, 8), errors }
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exit(1)
