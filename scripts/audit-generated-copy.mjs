#!/usr/bin/env node
/** Playbook 15B generated-copy scan. Exits 1 on P0/P1 class issues. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const profiles = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/generated-profiles.json'), 'utf8'),
)
const stateEd = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/state-editorial.json'), 'utf8'),
)
const metroEd = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/metro-editorial.json'), 'utf8'),
)

const banned =
  /\b(trusted|top-rated|premier|vetted|leading|seamless|comprehensive)\b/i
const credential =
  /\b(licensed|certified|authorized|insured|bonded)\b/i
const dash = /[\u2013\u2014]/
const stock = /^(looking for|when it comes to|in today's|at the end of the day)/i

const p0 = []
const p1 = []
const p2 = []

function scan(label, text) {
  if (!text) return
  if (dash.test(text)) p1.push(`${label}: dash`)
  if (banned.test(text)) p1.push(`${label}: banned ${text.match(banned)?.[0]}`)
  if (credential.test(text) && !/confirm|ask|verify|check/i.test(text)) {
    p2.push(`${label}: credential verb`)
  }
  if (stock.test(text.trim())) p1.push(`${label}: stock opener`)
}

let metaLong = 0
let subheadLong = 0
const leads = new Map()
for (const [id, rec] of Object.entries(profiles)) {
  if (!rec || rec._fallback) continue
  scan(`profile ${id} lead`, rec.lead)
  scan(`profile ${id} subhead`, rec.subhead)
  scan(`profile ${id} meta`, rec.metaDescription)
  if ((rec.metaDescription || '').length > 155) metaLong += 1
  if ((rec.subhead || '').length > 110) subheadLong += 1
  if (rec.lead) {
    const n = (leads.get(rec.lead) || 0) + 1
    leads.set(rec.lead, n)
  }
}
if (metaLong) p1.push(`${metaLong} meta descriptions > 155`)
if (subheadLong) p1.push(`${subheadLong} subheads > 110`)
const dupLeads = [...leads.values()].filter((n) => n > 8).length
if (dupLeads) p2.push(`${dupLeads} highly duplicated leads`)

for (const [slug, rec] of Object.entries(stateEd)) {
  scan(`state ${slug} overview`, rec.marketOverview)
  scan(`state ${slug} buyer`, rec.buyerNote)
}
for (const [key, rec] of Object.entries(metroEd)) {
  scan(`metro ${key} intro`, rec.intro)
  scan(`metro ${key} note`, rec.marketNote)
}

const report = { p0, p1: p1.slice(0, 40), p1Count: p1.length, p2Count: p2.length, p2: p2.slice(0, 20) }
console.log(JSON.stringify(report, null, 2))
if (p0.length || p1.length > 80) process.exit(1)
