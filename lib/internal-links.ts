import {
  getContractorsByState,
  contractors,
  type Contractor,
} from './contractors'
import { residentialConfidence, sewerReviewCount } from './contractors'
import {
  MIN_NATIONAL_BRAND_INSTALLERS,
  MIN_STATE_BRAND_INSTALLERS,
  getBrandById,
  contractorHasBrand,
} from './methods'
import {
  getDirectoryTagBySlug,
  getStateDirectoryTags,
  getTopStateLinksForTag,
  nationalTagQualifies,
  stateTagQualifies,
} from './directory-tags'

export {
  getStateDirectoryTags,
  getTopStateLinksForTag,
  nationalTagQualifies,
  stateTagQualifies,
}

/** @deprecated Prefer getStateDirectoryTags */
export function getStateBrandTags(stateSlug: string) {
  return getStateDirectoryTags(stateSlug).filter((tag) => tag.kind === 'brand')
}

/** Prefer a state×brand tag page when the state shortlist qualifies. */
export function resolveBrandTagPageHref(
  contractor: Pick<Contractor, 'stateSlug' | 'primaryBrands'>,
  brandId: string,
): string | undefined {
  if (!contractorHasBrand(contractor as Contractor, brandId)) return undefined
  const meta = getBrandById(brandId)
  if (!meta) return undefined

  const stateCount = getContractorsByState(contractor.stateSlug).filter((item) =>
    contractorHasBrand(item, brandId),
  ).length
  if (stateCount >= MIN_STATE_BRAND_INSTALLERS) {
    return `/contractors/${contractor.stateSlug}/tags/${meta.slug}`
  }

  const nationalCount = contractors.filter((item) =>
    contractorHasBrand(item, brandId),
  ).length
  if (nationalCount >= MIN_NATIONAL_BRAND_INSTALLERS) {
    return `/contractors/tags/${meta.slug}`
  }

  return undefined
}

export function resolveDirectoryTagPageHref(
  contractor: Pick<Contractor, 'stateSlug'>,
  tagSlug: string,
): string | undefined {
  const tag = getDirectoryTagBySlug(tagSlug)
  if (!tag) return undefined
  if (stateTagQualifies(contractor.stateSlug, tag)) {
    return `/contractors/${contractor.stateSlug}/tags/${tag.slug}`
  }
  if (nationalTagQualifies(tag)) {
    return `/contractors/tags/${tag.slug}`
  }
  return undefined
}

/** @deprecated Prefer getTopStateLinksForTag */
export function getTopStateBrandLinksForNationalTag(
  brand: { slug: string },
  limit = 12,
) {
  const tag = getDirectoryTagBySlug(brand.slug)
  if (!tag) return []
  return getTopStateLinksForTag(tag, limit)
}

/** @deprecated Prefer nationalTagQualifies */
export function nationalBrandTagQualifies(brandId: string): boolean {
  const tag = getDirectoryTagBySlug(
    brandId === 'briggs_stratton' ? 'briggs-stratton' : brandId,
  )
  return tag ? nationalTagQualifies(tag) : false
}

/** @deprecated Prefer stateTagQualifies */
export function stateBrandTagQualifies(
  stateSlug: string,
  brandId: string,
): boolean {
  const tag = getDirectoryTagBySlug(
    brandId === 'briggs_stratton' ? 'briggs-stratton' : brandId,
  )
  return tag ? stateTagQualifies(stateSlug, tag) : false
}

/** ISO-week-ish bucket used to rotate the homepage one-per-state sample. */
export function homepageDiscoveryWeekKey(now = Date.now()): number {
  return Math.floor(now / (7 * 24 * 60 * 60 * 1000))
}

/**
 * One contractor per state for the homepage sample. Pass an explicit weekKey
 * when writing the committed snapshot (CI) so the set is deterministic.
 */
export function pickHomepageDiscoverySample(
  source = contractors,
  weekKey: number = homepageDiscoveryWeekKey(),
): Contractor[] {
  const stateSlugs = [...new Set(source.map((contractor) => contractor.stateSlug))].sort()

  return stateSlugs
    .map((stateSlug) => {
      const stateContractors = source
        .filter((contractor) => contractor.stateSlug === stateSlug)
        .slice()
        .sort((a, b) => {
          const signal =
            confidenceRank(residentialConfidence(a)) -
            confidenceRank(residentialConfidence(b))
          if (signal !== 0) return signal
          const sewerReviews =
            sewerReviewCount(b) - sewerReviewCount(a)
          if (sewerReviews !== 0) return sewerReviews
          return (
            (b.reviewsCount || 0) - (a.reviewsCount || 0) ||
            a.slug.localeCompare(b.slug)
          )
        })
      if (stateContractors.length === 0) return null
      return stateContractors[weekKey % stateContractors.length]
    })
    .filter((contractor): contractor is Contractor => contractor !== null)
}

function confidenceRank(
  confidence: ReturnType<typeof residentialConfidence>,
): number {
  return confidence === 'explicit' ? 0 : confidence === 'high' ? 1 : 2
}
