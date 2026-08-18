/**
 * Client-safe method metadata. Must not import contractor JSON or other
 * server-only data modules. FilteredContractors and other client components
 * import from here.
 */

/** Minimum matches before a national method tag page is treated as a crawl surface. */
export const MIN_NATIONAL_BRAND_INSTALLERS = 20
/** Minimum distinct states before a national tag page is treated as a crawl surface. */
export const MIN_NATIONAL_TAG_STATES = 8
/** Minimum matches before a state×method tag page is emitted. */
export const MIN_STATE_BRAND_INSTALLERS = 5

export type BrandTag = {
  slug: string
  id: string
  label: string
  shortLabel: string
  description: string
}

/**
 * Method tags for residential sewer repair. Backed by website `primaryMethods`
 * / `primaryBrands` signal in the national directory.
 */
export const BRAND_TAGS: BrandTag[] = [
  {
    slug: 'cipp',
    id: 'cipp',
    label: 'CIPP lining',
    shortLabel: 'CIPP',
    description:
      'Contractors whose websites show cured-in-place pipe (CIPP) lining for sewer laterals or mains. Website mention is not a manufacturer authorization check.',
  },
  {
    slug: 'pipe-bursting',
    id: 'pipe_bursting',
    label: 'Pipe bursting',
    shortLabel: 'Pipe bursting',
    description:
      'Contractors whose websites show pipe-bursting sewer replacement signal. Confirm soil conditions, cleanouts, and restoration before hiring.',
  },
  {
    slug: 'trenchless',
    id: 'trenchless',
    label: 'Trenchless repair',
    shortLabel: 'Trenchless',
    description:
      'Contractors whose websites show trenchless sewer repair or replacement methods. Confirm which method fits the break and local code.',
  },
  {
    slug: 'open-cut',
    id: 'open_cut',
    label: 'Open-cut excavation',
    shortLabel: 'Open-cut',
    description:
      'Contractors whose websites show open-cut excavation for sewer lateral repair or replacement. Confirm dig path, permits, and landscaping restoration.',
  },
]

export function getBrandBySlug(slug: string): BrandTag | undefined {
  return BRAND_TAGS.find((b) => b.slug === slug)
}

export function getBrandById(id: string): BrandTag | undefined {
  return BRAND_TAGS.find((b) => b.id === id)
}

const METHOD_ID_ALIASES: Record<string, string[]> = {
  cipp: ['cipp', 'pipe_lining_cipp'],
  open_cut: ['open_cut', 'excavation'],
  pipe_bursting: ['pipe_bursting'],
  trenchless: ['trenchless'],
}

export function canonicalMethodId(id: string): string {
  for (const [canonical, aliases] of Object.entries(METHOD_ID_ALIASES)) {
    if (aliases.includes(id)) return canonical
  }
  return id
}

export function contractorHasBrand(
  contractor: { primaryBrands?: string[]; primaryMethods?: string[] },
  brandId: string,
): boolean {
  const values = contractor.primaryBrands || contractor.primaryMethods || []
  const aliases = METHOD_ID_ALIASES[brandId] || [brandId]
  return aliases.some((id) => values.includes(id))
}
