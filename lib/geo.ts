import zipCentroidsData from './data/zip-centroids.json'
import { contractors } from './contractors'
import {
  sortContractorsByDistanceSignal,
  type Contractor,
} from './contractor-model'
import {
  DEFAULT_SEARCH_RADIUS,
  SEARCH_RADII,
  normalizeRadius,
  normalizeZip,
} from './search-radii'

export type GeoPoint = { lat: number; lng: number }

export type ZipCentroid = GeoPoint & { zip: string }

export type ContractorWithDistance = Contractor & { distanceMiles: number }

const zipCentroids = zipCentroidsData as ZipCentroid[]
const zipIndex = new Map(zipCentroids.map((z) => [z.zip, z]))

export { DEFAULT_SEARCH_RADIUS, SEARCH_RADII, normalizeRadius, normalizeZip }

export function getZipCentroid(zip: string): ZipCentroid | undefined {
  return zipIndex.get(zip)
}

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.7613
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getContractorsNearPoint(
  point: GeoPoint,
  radiusMiles = DEFAULT_SEARCH_RADIUS,
  source = contractors,
): ContractorWithDistance[] {
  const matches: ContractorWithDistance[] = []
  for (const contractor of source) {
    if (contractor.lat == null || contractor.lng == null) continue
    const distanceMiles = haversineMiles(
      point.lat,
      point.lng,
      contractor.lat,
      contractor.lng,
    )
    if (distanceMiles <= radiusMiles) {
      matches.push({ ...contractor, distanceMiles })
    }
  }
  return sortContractorsByDistanceSignal(matches)
}
