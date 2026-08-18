import contractorsData from './data/contractors.json'
import statesData from './data/states.json'
import {
  activeLaneConfidence,
  normalizeReviewTags,
  residentialConfidence,
  sewerReviewCount,
  sortContractorsBySignal,
  type Contractor,
  type ContractorListItem,
  type ContractorMapItem,
  type StateMeta,
} from './contractor-model'
import { withoutManufacturers } from './supply-store-filter'
import { withoutSupplyOrRentalOnly } from './listing-eligibility'

export * from './contractor-model'

/** Buyer-facing directory only. Supply/rental/treatment pins excluded. */
export const contractors = withoutSupplyOrRentalOnly(
  withoutManufacturers(contractorsData as unknown as Contractor[]),
)
export const states = statesData as Record<string, StateMeta>

/** @deprecated National directory is live; kept for a few legacy links. */
export const SAMPLE_STATE_SLUG = 'tn'

export const allStatesList: StateMeta[] = Object.values(states).sort(
  (a, b) => b.totalListings - a.totalListings,
)

export const NATIONAL_TOTAL = allStatesList.reduce(
  (sum, s) => sum + (s.totalListings || 0),
  0,
)

export const NATIONAL_EXPLICIT = allStatesList.reduce(
  (sum, s) => sum + (s.explicitCount || 0),
  0,
)

export const TOTAL_INSTALLERS = contractors.length
export const TOTAL_CONTRACTORS = contractors.length
export const TOTAL_STATES = Object.keys(states).length
export const LIVE_INSTALLERS = contractors.length

export function getStateBySlug(slug: string): StateMeta | undefined {
  return states[slug]
}

export function getContractorsByState(stateSlug: string): Contractor[] {
  return sortContractorsBySignal(
    contractors.filter((i) => i.stateSlug === stateSlug),
  )
}

/** Indexable state: ≥5 residential contractors including ≥2 explicit/high. */
export const MIN_STATE_RESIDENTIAL = 5
export const MIN_STATE_STRONG = 2

export function stateMeetsIndexThreshold(stateSlug: string): boolean {
  const list = getContractorsByState(stateSlug)
  if (list.length < MIN_STATE_RESIDENTIAL) return false
  const strong = list.filter((c) => {
    const conf = residentialConfidence(c)
    return conf === 'explicit' || conf === 'high'
  }).length
  return strong >= MIN_STATE_STRONG
}

export function getIndexableStateSlugs(): string[] {
  return Object.keys(states).filter(stateMeetsIndexThreshold)
}

export function getContractorBySlug(
  stateSlug: string,
  slug: string,
): Contractor | undefined {
  return contractors.find((i) => i.stateSlug === stateSlug && i.slug === slug)
}

export function getNearbyContractors(
  contractor: Pick<Contractor, 'id' | 'stateSlug' | 'slug' | 'lat' | 'lng' | 'city'>,
  limit = 8,
): Contractor[] {
  const same = contractors.filter(
    (item) =>
      item.stateSlug === contractor.stateSlug && item.slug !== contractor.slug,
  )
  same.sort((a, b) => {
    if (contractor.city) {
      const aMatch = a.city === contractor.city ? 0 : 1
      const bMatch = b.city === contractor.city ? 0 : 1
      if (aMatch !== bMatch) return aMatch - bMatch
    }
    return (b.reviewsCount || 0) - (a.reviewsCount || 0)
  })
  return same.slice(0, limit)
}

export function toContractorListItem(contractor: Contractor): ContractorListItem {
  return {
    id: contractor.id,
    placeId: contractor.placeId,
    slug: contractor.slug,
    name: contractor.name,
    city: contractor.city,
    state: contractor.state,
    stateAbbr: contractor.stateAbbr,
    stateSlug: contractor.stateSlug,
    lat: contractor.lat,
    lng: contractor.lng,
    reviewsCount: contractor.reviewsCount,
    totalScore: contractor.totalScore,
    categoryName: contractor.categoryName,
    primaryLane: contractor.primaryLane,
    lanes: contractor.lanes,
    primaryMethods: contractor.primaryMethods,
    primaryBrands: contractor.primaryBrands || contractor.primaryMethods,
    sewerReviewCountByLane: contractor.sewerReviewCountByLane,
    reviewTags: normalizeReviewTags(
      contractor.reviewTags || contractor.sewerScopedTags,
    ),
    sewerScopedTags: normalizeReviewTags(contractor.sewerScopedTags),
    sponsored: contractor.sponsored,
    writeup: contractor.writeup,
  }
}

export function toContractorMapItem(contractor: Contractor): ContractorMapItem {
  return {
    id: contractor.id,
    slug: contractor.slug,
    name: contractor.name,
    city: contractor.city,
    stateAbbr: contractor.stateAbbr,
    stateSlug: contractor.stateSlug,
    lat: contractor.lat,
    lng: contractor.lng,
    primaryLane: contractor.primaryLane,
    lanes: contractor.lanes,
    sponsored: contractor.sponsored,
    reviewsCount: contractor.reviewsCount,
    totalScore: contractor.totalScore,
    confidence: activeLaneConfidence(contractor, 'residential_sewer'),
    sewerReviewCount: sewerReviewCount(contractor, 'residential_sewer'),
  }
}

export const REGIONS: Record<string, string[]> = {
  Southeast: ['tn', 'ky', 'al', 'ga', 'fl', 'sc', 'la', 'ms'],
  'Rural Heartland': ['tx', 'ok', 'ar', 'mo', 'ks', 'ia', 'ne', 'nd', 'sd'],
  'Great Lakes / Lower Midwest': ['mi', 'in', 'oh', 'il', 'wi', 'mn'],
  'Mid-Atlantic / Appalachia': ['nc', 'va', 'wv', 'pa', 'md', 'de'],
  Northeast: ['ny', 'nj', 'ma', 'ct', 'ri', 'me', 'nh', 'vt'],
  'Mountain West': ['co', 'id', 'mt', 'ut', 'wy'],
  'Southwest / Desert': ['az', 'nv', 'nm'],
  Pacific: ['ca', 'or', 'wa', 'ak', 'hi'],
}

export function isLiveState(stateSlug: string): boolean {
  return Boolean(states[stateSlug])
}
