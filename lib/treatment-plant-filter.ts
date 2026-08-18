/** Treatment plant / public works exclusion helpers for directory eligibility. */

const TREATMENT_NAME_PATTERNS = [
  /\bwastewater\s+treatment\b/i,
  /\bwater\s+treatment\s+plant\b/i,
  /\bsewage\s+treatment\b/i,
  /\bpublic\s+works\b/i,
  /\bsewer\s+(?:department|utility|billing)\b/i,
]

const TREATMENT_HOST_PATTERNS = [/\.gov\b/i]

export function looksLikeTreatmentPlant(input: {
  name?: string
  categoryName?: string
  website?: string
}): boolean {
  const blob = `${input.name || ''} ${input.categoryName || ''}`
  if (TREATMENT_NAME_PATTERNS.some((p) => p.test(blob))) return true
  if (input.categoryName === 'Wastewater treatment plant') return true
  if (input.categoryName === 'Government office' && /sewer|wastewater/i.test(blob)) return true
  const host = input.website || ''
  if (TREATMENT_HOST_PATTERNS.some((p) => p.test(host)) && /wastewater|publicworks|sewer/i.test(host)) {
    return true
  }
  return false
}
