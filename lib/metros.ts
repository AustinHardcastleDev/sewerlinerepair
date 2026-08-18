import { contractors } from './contractors'
import {
  residentialConfidence,
  sortContractorsByDistanceSignal,
} from './contractor-model'
import { haversineMiles, type ContractorWithDistance } from './geo'
import {
  METRO_RADIUS_MILES,
  MIN_METRO_RESIDENTIAL,
  MIN_METRO_STRONG,
  getMetrosByState,
  metros,
  type Metro,
} from './metro-list'

export {
  METRO_RADIUS_MILES,
  MIN_METRO_RESIDENTIAL,
  MIN_METRO_STRONG,
  getMetro,
  getMetrosByState,
  metros,
  type Metro,
} from './metro-list'

export function getContractorsNearMetro(
  metro: Metro,
  radiusMiles = METRO_RADIUS_MILES,
): ContractorWithDistance[] {
  const matches: ContractorWithDistance[] = []
  for (const contractor of contractors) {
    if (contractor.lat == null || contractor.lng == null) continue
    if (contractor.stateSlug !== metro.stateSlug) continue
    const distanceMiles = haversineMiles(
      metro.lat,
      metro.lng,
      contractor.lat,
      contractor.lng,
    )
    if (distanceMiles <= radiusMiles) {
      matches.push({ ...contractor, distanceMiles })
    }
  }
  return sortContractorsByDistanceSignal(matches)
}

export function countContractorsNearMetro(metro: Metro): number {
  return getContractorsNearMetro(metro).length
}

export function metroMeetsIndexThreshold(metro: Metro): boolean {
  const nearby = getContractorsNearMetro(metro)
  if (nearby.length < MIN_METRO_RESIDENTIAL) return false
  const strong = nearby.filter((c) => {
    const conf = residentialConfidence(c)
    return conf === 'explicit' || conf === 'high'
  }).length
  return strong >= MIN_METRO_STRONG
}

/** Curated metros that qualify for static routes and the sitemap. */
export function getIndexableMetros(): Metro[] {
  return metros.filter(metroMeetsIndexThreshold)
}

export function getIndexableMetrosByState(stateSlug: string): Metro[] {
  return getMetrosByState(stateSlug).filter(metroMeetsIndexThreshold)
}
