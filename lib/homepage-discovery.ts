import discoveryData from './data/homepage-discovery.json'
import { contractors, type Contractor } from './contractors'
import { pickHomepageDiscoverySample } from './internal-links'

export type HomepageDiscoverySnapshot = {
  weekKey: number
  generatedAt: string
  contractorIds: string[]
}

const snapshot = discoveryData as HomepageDiscoverySnapshot

/**
 * Homepage “one per state” list. Prefer the committed weekly snapshot so
 * production actually rotates when the GitHub Action regenerates the file.
 */
export function getHomepageDiscoverySample(): Contractor[] {
  const byId = new Map(contractors.map((contractor) => [contractor.id, contractor]))
  const fromSnapshot = snapshot.contractorIds
    .map((id) => byId.get(id))
    .filter((contractor): contractor is Contractor => Boolean(contractor))

  if (fromSnapshot.length >= Math.min(40, new Set(contractors.map((i) => i.stateSlug)).size)) {
    return fromSnapshot
  }

  return pickHomepageDiscoverySample(contractors, snapshot.weekKey)
}

export function getHomepageDiscoveryMeta(): {
  weekKey: number
  generatedAt: string
  count: number
} {
  return {
    weekKey: snapshot.weekKey,
    generatedAt: snapshot.generatedAt,
    count: snapshot.contractorIds.length,
  }
}
