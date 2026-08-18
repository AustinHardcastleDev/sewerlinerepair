import type { StateMeta } from '@/lib/contractor-model'

/** Count-led SERP title for state directory pages. */
export function getStateSeoTitle(state: StateMeta): string {
  const n = state.totalListings
  if (n <= 0) return `Sewer Repair Contractor Research in ${state.name}`
  if (n === 1) return `1 Sewer Repair Contractor in ${state.name}`
  return `${n} Sewer Repair Contractors in ${state.name}`
}

/**
 * Direct-response meta description for state directory pages.
 * Soft-capped to 155 chars by pageMetadata / seoDescription.
 */
export function getStateMetaDescription(state: StateMeta): string {
  const n = state.totalListings
  if (n <= 0) {
    return `We’re researching sewer line contractors in ${state.name}. Check back as listings are added, or browse nearby states for shops with real website signal.`
  }
  if (n === 1) {
    return `1 ${state.name} contractor with sewer line signal on their website. Use it as a starting point, then verify licensing, references, and fit yourself.`
  }
  const pageProof =
    state.explicitCount === 1
      ? '1 dedicated sewer page'
      : `${state.explicitCount} dedicated sewer pages`
  return `Compare ${n} ${state.name} sewer line contractors. ${pageProof}. Website signal research, not paid rankings.`
}
