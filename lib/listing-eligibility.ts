/**
 * Drop supply / rental / warehouse / treatment-plant pins that are not
 * sewer repair contractors.
 */

import { looksLikeTreatmentPlant } from './treatment-plant-filter'

const SUPPLY_ONLY_CATEGORIES = new Set([
  'Plumbing supply store',
  'Hardware store',
  'Home improvement store',
  'Equipment rental agency',
  'Equipment supplier',
  'Pipe manufacturer',
  'Industrial equipment supplier',
  'Wholesaler',
  'Construction equipment supplier',
  'Building materials supplier',
  'Warehouse',
  'Distribution service',
  'Corporate office',
  'Wastewater treatment plant',
  'Water treatment plant',
  'Sewage treatment facility',
  'Government office',
  'Public works office',
])

const SUPPLY_OR_RENTAL_NAME_PATTERNS: RegExp[] = [
  /^united rentals\b/i,
  /^sunbelt rentals\b/i,
  /^ferguson\b/i,
  /^home depot\b/i,
  /^lowe'?s\b/i,
  /^supplyhouse\b/i,
]

export function isSupplyOrRentalOnlyListing(contractor: {
  name: string
  categoryName?: string | null
  website?: string | null
}): boolean {
  const category = (contractor.categoryName || '').trim()
  if (SUPPLY_ONLY_CATEGORIES.has(category)) return true
  if (
    looksLikeTreatmentPlant({
      name: contractor.name,
      categoryName: category,
      website: contractor.website || undefined,
    })
  ) {
    return true
  }
  return SUPPLY_OR_RENTAL_NAME_PATTERNS.some((pattern) =>
    pattern.test(contractor.name || ''),
  )
}

export function withoutSupplyOrRentalOnly<
  T extends { name: string; categoryName?: string | null; website?: string | null },
>(rows: T[]): T[] {
  return rows.filter((row) => !isSupplyOrRentalOnlyListing(row))
}
