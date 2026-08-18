#!/usr/bin/env node
/** Playbook 15A data QA against extracted site JSON. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contractors = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/contractors.json'), 'utf8'),
)
const states = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/states.json'), 'utf8'),
)
const profiles = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/data/generated-profiles.json'), 'utf8'),
)
const rights = JSON.parse(
  fs.readFileSync(path.join(root, 'docs/research/data-rights.json'), 'utf8'),
)

const errors = []
const warnings = []

if (Object.keys(states).length !== 50) errors.push(`states ${Object.keys(states).length} != 50`)
const ids = contractors.map((c) => c.placeId)
if (new Set(ids).size !== ids.length) errors.push('duplicate placeId')
const urls = contractors.map((c) => `${c.stateSlug}/${c.slug}`)
if (new Set(urls).size !== urls.length) errors.push('duplicate state/slug')

let fallbacks = 0
let missingProfile = 0
for (const c of contractors) {
  if (c.lat != null && (typeof c.lat !== 'number' || Number.isNaN(c.lat))) {
    errors.push(`bad lat ${c.placeId}`)
  }
  if (c.lng != null && (typeof c.lng !== 'number' || Number.isNaN(c.lng))) {
    errors.push(`bad lng ${c.placeId}`)
  }
  const res = c.lanes?.residential_sewer?.confidence
  const com = c.lanes?.commercial_sewer?.confidence
  if (c.primaryLane === 'municipal_infra' && res !== 'explicit' && res !== 'high' && res !== 'medium') {
    errors.push(`municipal published ${c.placeId}`)
  }
  if (!['explicit', 'high', 'medium'].includes(res) && !['explicit', 'high', 'medium'].includes(com)) {
    errors.push(`no publishable lane ${c.placeId}`)
  }
  const rec = profiles[c.placeId]
  if (!rec?.lead) missingProfile += 1
  else if (rec._fallback || rec.model === 'deterministic-fallback') fallbacks += 1
  if (Array.isArray(c.sewerReviewSnippets) && c.sewerReviewSnippets.some((s) => s && String(s).length > 0)) {
    errors.push(`raw snippet ${c.placeId}`)
  }
}

if (missingProfile) warnings.push(`${missingProfile} contractors missing Flash lead`)
if (fallbacks) warnings.push(`${fallbacks} deterministic-fallback profiles`)

if (rights.fields?.overallRating?.display) errors.push('overallRating display should be false')
if (rights.fields?.rawReviewText?.display) errors.push('rawReviewText display should be false')

const report = { contractors: contractors.length, states: Object.keys(states).length, errors, warnings }
console.log(JSON.stringify(report, null, 2))
if (errors.length) process.exit(1)
