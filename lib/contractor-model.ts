import type { PinCategory } from './tokens'

export type SewerLane = 'residential_sewer' | 'commercial_sewer' | 'municipal_infra'
export type SewerConfidence = 'explicit' | 'high' | 'medium'
export type EvidenceSource = 'website' | 'google_maps' | 'google_review' | 'official_directory'
export type EvidenceStatus = 'verified' | 'claimed' | 'inferred' | 'not_found'
export type MethodRelationship =
  | 'mentions'
  | 'claims_to_perform'
  | 'certified'
  | 'authorized'
  | 'listed_in_official_directory'

export type EvidenceRecord = {
  sourceType: EvidenceSource
  sourceUrl: string
  capturedAt: string
  excerpt?: string
  status: EvidenceStatus
  storagePolicy: 'persist' | 'place_id_only' | 'ephemeral' | 'legal_review'
  publicDisplay: 'none' | 'derived_only' | 'attributed_excerpt' | 'full_record'
}

export type LaneEvidence = {
  confidence: SewerConfidence
  reasoning: string
  dedicatedPage: string | null
  mentions: number
  score: number
  evidenceIds: string[]
}

export type MethodEvidence = {
  method: string
  relationship: MethodRelationship
  evidenceIds: string[]
}

export type CredentialEvidence = {
  credential:
    | 'plumbing_contractor_license'
    | 'sewer_contractor_license'
    | 'trenchless_manufacturer_authorized'
    | 'municipal_prequalified'
  subjectType: 'company' | 'technician' | 'unknown'
  status: EvidenceStatus
  evidenceIds: string[]
}

export type ContractorReviewTagId =
  | 'lateral_repair'
  | 'main_line_repair'
  | 'trenchless_lining'
  | 'pipe_bursting'
  | 'excavation'
  | 'camera_inspection'
  | 'hydro_jetting'
  | 'root_removal'
  | 'cleanout_install'
  | 'sewer_backup_emergency'
  | 'commercial_sewer'
  | 'municipal_infra'
  | 'permitting_inspections'
  | 'city_coordination'
  | 'clear_scope_explanation'
  | 'transparent_pricing'
  | 'warranty_followup'
  | 'restoration_landscaping'
  | 'schedule_reliability'
  | 'communication'
  | 'professional_crew'
  | 'quality_workmanship'
  | 'cleanup'
  | 'minimized_disruption'

/** @deprecated Prefer ContractorReviewTagId */
export type ContractorReviewTag = ContractorReviewTagId

export type ContractorReviewTagRecord = {
  id: ContractorReviewTagId | string
  label: string
  matchedReviewCount: number
}

/** Extract sometimes stores scoped tags as bare ids. Normalize before display. */
export function normalizeReviewTags(
  tags?: Array<string | ContractorReviewTagRecord> | null,
): ContractorReviewTagRecord[] {
  if (!tags?.length) return []
  const out: ContractorReviewTagRecord[] = []
  for (const tag of tags) {
    if (typeof tag === 'string') {
      const id = tag.trim()
      if (!id) continue
      out.push({
        id,
        label: id.replace(/_/g, ' '),
        matchedReviewCount: 1,
      })
      continue
    }
    const id = String(tag?.id || '').trim()
    if (!id) continue
    out.push({
      id,
      label: (tag.label || id).replace(/_/g, ' '),
      matchedReviewCount: Number(tag.matchedReviewCount) || 1,
    })
  }
  return out
}

export type ContractorReviewSnippet = {
  text?: string
  publishedAt: string | null
  lane: SewerLane
  tags: ContractorReviewTagId[]
  sourceUrl?: string
  displayPermission: 'none' | 'attributed_excerpt'
}

export type Contractor = {
  id: string
  placeId: string
  slug: string
  name: string
  city: string
  state: string
  stateAbbr: string
  stateSlug: string
  address: string
  phone: string
  emails?: string[]
  website: string
  lat: number | null
  lng: number | null
  reviewsCount: number | null
  totalScore: number | null
  categoryName: string
  categories: string[]
  fitForDirectory: 'high'
  primaryLane: SewerLane
  lanes: Partial<Record<SewerLane, LaneEvidence>>
  relatedMentions: {
    lateralRepair: number
    mainLineRepair: number
    trenchlessLining: number
    pipeBursting: number
    excavation: number
    cameraInspection: number
    hydroJetting: number
    rootRemoval: number
    cleanoutInstall: number
    sewerBackup: number
    residential: number
    commercial: number
    municipal: number
  }
  evidence: Record<string, EvidenceRecord>
  methodEvidence: MethodEvidence[]
  credentialEvidence: CredentialEvidence[]
  primaryMethods: string[]
  /** @deprecated alias of primaryMethods during UI migration */
  primaryBrands?: string[]
  sourceKeywords: string[]
  reviewTags?: ContractorReviewTagRecord[]
  sewerReviewCountByLane?: Partial<Record<SewerLane, number>>
  sewerReviewShareByLane?: Partial<Record<SewerLane, number>>
  sewerScopedTags?: ContractorReviewTagRecord[]
  sewerReviewSnippets?: ContractorReviewSnippet[]
  sourceCheckedAt: string
  reviewsCheckedAt?: string
  sponsored?: boolean
  /** @deprecated transitional compatibility while UI migrates */
  writeup?: string
  sewerReasoning?: string
  /** @deprecated use lanes.residential_sewer.mentions */
  sewerMentions?: number
  /** @deprecated use lanes.residential_sewer.dedicatedPage */
  dedicatedPage?: string | null
}

export type ContractorListItem = Pick<
  Contractor,
  | 'id'
  | 'placeId'
  | 'slug'
  | 'name'
  | 'city'
  | 'state'
  | 'stateAbbr'
  | 'stateSlug'
  | 'lat'
  | 'lng'
  | 'reviewsCount'
  | 'totalScore'
  | 'categoryName'
  | 'primaryLane'
  | 'lanes'
  | 'primaryMethods'
  | 'primaryBrands'
  | 'sewerReviewCountByLane'
  | 'reviewTags'
  | 'sewerScopedTags'
  | 'sponsored'
> & {
  distanceMiles?: number
  writeup?: string
}

/** Minimum sewer-specific review thresholds used in list filters. */
export const SEWER_REVIEW_FILTERS = [
  { id: '1', min: 1, label: '1+ sewer reviews' },
  { id: '5', min: 5, label: '5+ sewer reviews' },
  { id: '10', min: 10, label: '10+ sewer reviews' },
] as const

export type SewerReviewFilterId = (typeof SEWER_REVIEW_FILTERS)[number]['id']

export function activeLaneConfidence(
  contractor: Pick<Contractor, 'lanes' | 'primaryLane'>,
  lane: SewerLane = 'residential_sewer',
): SewerConfidence | null {
  const hit = contractor.lanes?.[lane]?.confidence
  if (hit === 'explicit' || hit === 'high' || hit === 'medium') return hit
  return null
}

export function sewerReviewCount(
  contractor: Pick<Contractor, 'sewerReviewCountByLane'>,
  lane: SewerLane = 'residential_sewer',
): number {
  return contractor.sewerReviewCountByLane?.[lane] || 0
}

export function confidenceRank(confidence: SewerConfidence | null | undefined): number {
  if (confidence === 'explicit') return 0
  if (confidence === 'high') return 1
  if (confidence === 'medium') return 2
  return 9
}

export function confidenceLabel(confidence: SewerConfidence): string {
  if (confidence === 'explicit') return 'Explicit signal'
  if (confidence === 'high') return 'Strong signal'
  return 'Moderate signal'
}

export function confidenceDescription(confidence: SewerConfidence): string {
  if (confidence === 'explicit') {
    return 'The contractor website has a dedicated sewer repair or replacement page.'
  }
  if (confidence === 'high') {
    return 'The contractor website includes multiple clear sewer repair or replacement statements.'
  }
  return 'The contractor website includes at least one clear sewer repair or replacement statement.'
}

export function signalTier(confidence: SewerConfidence): PinCategory {
  if (confidence === 'explicit') return 'dedicated'
  if (confidence === 'high') return 'repeated'
  return 'signal'
}

/** Map marker category from residential confidence + sponsorship. */
export function pinCategory(input: {
  sponsored?: boolean
  confidence?: SewerConfidence | null
  lanes?: Contractor['lanes']
  primaryLane?: Contractor['primaryLane']
}): PinCategory {
  if (input.sponsored) return 'sponsored'
  const conf =
    input.confidence ||
    (input.lanes
      ? activeLaneConfidence(
          {
            lanes: input.lanes,
            primaryLane: input.primaryLane || 'residential_sewer',
          },
          'residential_sewer',
        )
      : null) ||
    'medium'
  return signalTier(conf)
}

export function residentialConfidence(
  contractor: Pick<Contractor, 'lanes' | 'primaryLane'>,
): SewerConfidence | null {
  return activeLaneConfidence(contractor, 'residential_sewer')
}

export function sortContractorsBySignal<
  T extends Pick<
    Contractor,
    'lanes' | 'primaryLane' | 'sponsored' | 'sewerReviewCountByLane'
  >,
>(rows: T[], lane: SewerLane = 'residential_sewer'): T[] {
  return [...rows].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    const confDiff =
      confidenceRank(activeLaneConfidence(a, lane)) -
      confidenceRank(activeLaneConfidence(b, lane))
    if (confDiff !== 0) return confDiff
    return sewerReviewCount(b, lane) - sewerReviewCount(a, lane)
  })
}

export function sortContractorsByDistanceSignal<
  T extends Pick<Contractor, 'lanes' | 'primaryLane' | 'sponsored' | 'sewerReviewCountByLane'> & {
    distanceMiles?: number
  },
>(rows: T[], lane: SewerLane = 'residential_sewer'): T[] {
  return [...rows].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    const da = a.distanceMiles ?? Number.POSITIVE_INFINITY
    const db = b.distanceMiles ?? Number.POSITIVE_INFINITY
    if (da !== db) return da - db
    return (
      confidenceRank(activeLaneConfidence(a, lane)) -
      confidenceRank(activeLaneConfidence(b, lane))
    )
  })
}

export type StateMeta = {
  name: string
  abbr: string
  slug: string
  totalListings: number
  explicitCount: number
  highCount: number
  mediumCount: number
  withPhone?: number
  withEmail?: number
  withWebsite?: number
  topCities?: string[]
}

export type ContractorMapItem = Pick<
  Contractor,
  | 'id'
  | 'slug'
  | 'name'
  | 'city'
  | 'stateAbbr'
  | 'stateSlug'
  | 'lat'
  | 'lng'
  | 'primaryLane'
  | 'lanes'
  | 'sponsored'
  | 'reviewsCount'
  | 'totalScore'
> & {
  confidence?: SewerConfidence | null
  sewerReviewCount?: number
  distanceMiles?: number
}
