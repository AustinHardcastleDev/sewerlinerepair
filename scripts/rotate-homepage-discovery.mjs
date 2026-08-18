#!/usr/bin/env node
/**
 * Regenerates lib/data/homepage-discovery.json with one contractor per state
 * for the current week. Intended for weekly CI so the homepage sample
 * actually rotates on the live static site.
 *
 * Usage: node scripts/rotate-homepage-discovery.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'lib/data/homepage-discovery.json')

const OEM_HOST_SUFFIXES = [
  'nuflow.com',
  'nuflowtech.com',
  'permaliner.com',
  'perma-liner.com',
  'ferguson.com',
  'supplyhouse.com',
  'homedepot.com',
  'lowes.com',
]

const SUPPLY_ONLY_CATEGORIES = new Set([
  'Plumbing supply store',
  'Industrial equipment supplier',
  'Equipment rental agency',
  'Pipe manufacturer',
  'Manufacturer',
  'Wholesaler',
  'Equipment supplier',
  'Construction equipment supplier',
  'Building materials supplier',
  'Warehouse',
  'Distribution service',
  'Corporate office',
])

const SUPPLY_OR_RENTAL_NAME_PATTERNS = [
  /^united rentals\b/i,
  /^sunbelt rentals\b/i,
  /^ferguson(\s+hvac)?\s+supply\b/i,
  /^elliott electric supply\b/i,
  /^briggs equipment\b/i,
  /^lincoln electric supply\b/i,
]

const OEM_NAME_PATTERNS = [
  /^nu[\s-]?flow\b/i,
  /^perma[\s-]?liner\b/i,
  /^ferguson\b/i,
  /^supplyhouse\b/i,
]

function websiteHost(website) {
  if (!website) return ''
  try {
    return new URL(website).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return ''
  }
}

function isOemCorporateWebsite(website) {
  const host = websiteHost(website)
  if (!host) return false
  return OEM_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  )
}

function isManufacturerListing(contractor) {
  const category = (contractor.categoryName || '').trim()
  if (category === 'Manufacturer') return true
  if (isOemCorporateWebsite(contractor.website)) return true
  if (OEM_NAME_PATTERNS.some((pattern) => pattern.test(contractor.name.trim()))) {
    if (
      category === 'Electric sewer shop' ||
      category === 'HVAC contractor' ||
      category === 'Electrical installation service'
    ) {
      return false
    }
    if (
      /distribution|warehouse|corporate|headquarters|customer contact|engineering center/i.test(
        contractor.name,
      )
    ) {
      return true
    }
    if (category !== 'Electrician') return true
  }
  return false
}

function isSupplyOrRentalOnlyListing(contractor) {
  const category = (contractor.categoryName || '').trim()
  if (SUPPLY_ONLY_CATEGORIES.has(category)) return true
  return SUPPLY_OR_RENTAL_NAME_PATTERNS.some((pattern) =>
    pattern.test(contractor.name.trim()),
  )
}

function confidenceRank(confidence) {
  return confidence === 'explicit' ? 0 : confidence === 'high' ? 1 : 2
}

function weekKey(now = Date.now()) {
  return Math.floor(now / (7 * 24 * 60 * 60 * 1000))
}

function pickSample(source, week) {
  const stateSlugs = [...new Set(source.map((i) => i.stateSlug))].sort()
  return stateSlugs
    .map((stateSlug) => {
      const stateContractors = source
        .filter((contractor) => contractor.stateSlug === stateSlug)
        .slice()
        .sort((a, b) => {
          const signal =
            confidenceRank(a.primaryLane) -
            confidenceRank(b.primaryLane)
          if (signal !== 0) return signal
          const sewerCountDelta =
            (b.sewerReviewCount || 0) - (a.sewerReviewCount || 0)
          if (sewerCountDelta !== 0) return sewerCountDelta
          return (
            (b.reviewsCount || 0) - (a.reviewsCount || 0) ||
            a.slug.localeCompare(b.slug)
          )
        })
      if (stateContractors.length === 0) return null
      return stateContractors[week % stateContractors.length]
    })
    .filter(Boolean)
}

const raw = JSON.parse(
  readFileSync(join(root, 'lib/data/contractors.json'), 'utf8'),
)
const directory = raw.filter(
  (contractor) =>
    !isManufacturerListing(contractor) && !isSupplyOrRentalOnlyListing(contractor),
)

const week = weekKey()
const sample = pickSample(directory, week)
const payload = {
  weekKey: week,
  generatedAt: new Date().toISOString(),
  contractorIds: sample.map((contractor) => contractor.id),
}

let previous = null
try {
  previous = JSON.parse(readFileSync(outPath, 'utf8'))
} catch {
  previous = null
}

const unchanged =
  previous &&
  previous.weekKey === payload.weekKey &&
  Array.isArray(previous.contractorIds) &&
  previous.contractorIds.length === payload.contractorIds.length &&
  previous.contractorIds.every((id, index) => id === payload.contractorIds[index])

writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`)

if (unchanged) {
  console.log(
    `Homepage discovery snapshot unchanged for week ${week} (${payload.contractorIds.length} contractors).`,
  )
  process.exit(0)
}

console.log(
  `Wrote homepage discovery snapshot for week ${week}: ${payload.contractorIds.length} contractors → ${outPath}`,
)
process.exit(0)
