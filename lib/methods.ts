import { contractors } from './contractors'
import type { Contractor } from './contractor-model'
import {
  BRAND_TAGS,
  contractorHasBrand,
  type BrandTag,
} from './method-meta'

export {
  BRAND_TAGS,
  MIN_NATIONAL_BRAND_INSTALLERS,
  MIN_NATIONAL_TAG_STATES,
  MIN_STATE_BRAND_INSTALLERS,
  getBrandById,
  getBrandBySlug,
  contractorHasBrand,
  canonicalMethodId,
  type BrandTag,
} from './method-meta'

export function getContractorsByBrandInState(
  brandId: string,
  stateSlug: string,
): Contractor[] {
  return contractors.filter(
    (i) => i.stateSlug === stateSlug && contractorHasBrand(i, brandId),
  )
}

export function getContractorsByBrand(brandId: string): Contractor[] {
  return contractors.filter((i) => contractorHasBrand(i, brandId))
}

export function brandCounts(): { brand: BrandTag; count: number }[] {
  return BRAND_TAGS.map((brand) => ({
    brand,
    count: getContractorsByBrand(brand.id).length,
  })).filter((row) => row.count > 0)
}
