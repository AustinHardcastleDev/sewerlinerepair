/**
 * Drop pipe/trenchless equipment manufacturers and supply hosts from the
 * buyer directory. Independent contractors stay.
 */

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

const OEM_CORP_CATEGORIES = new Set([
  'Manufacturer',
  'Pipe manufacturer',
  'Corporate office',
  'Warehouse',
  'Distribution service',
  'Plumbing supply store',
  'Equipment supplier',
])

const OEM_NAME_PATTERNS: RegExp[] = [
  /^nu[\s-]?flow\b/i,
  /^perma[\s-]?liner\b/i,
  /^ferguson\b/i,
  /^supplyhouse\b/i,
]

function websiteHost(website: string | null | undefined): string {
  if (!website) return ''
  try {
    const host = new URL(website).hostname.toLowerCase()
    return host.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function isOemCorporateWebsite(website: string | null | undefined): boolean {
  const host = websiteHost(website)
  if (!host) return false
  return OEM_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  )
}

function nameLooksLikeOemCorporate(name: string): boolean {
  const trimmed = name.trim()
  return OEM_NAME_PATTERNS.some((pattern) => pattern.test(trimmed))
}

export function isManufacturerListing(contractor: {
  name: string
  categoryName?: string | null
  website?: string | null
}): boolean {
  const category = (contractor.categoryName || '').trim()
  if (OEM_CORP_CATEGORIES.has(category)) return true
  if (isOemCorporateWebsite(contractor.website)) return true
  if (nameLooksLikeOemCorporate(contractor.name) && isOemCorporateWebsite(contractor.website)) {
    return true
  }
  return false
}

export function withoutManufacturers<
  T extends { name: string; categoryName?: string | null; website?: string | null },
>(rows: T[]): T[] {
  return rows.filter((row) => !isManufacturerListing(row))
}
