import type { Contractor } from './contractor-model'

export type DirectoryTagKind = 'brand' | 'intent'

export type DirectoryTag = {
  slug: string
  id: string
  kind: DirectoryTagKind
  label: string
  shortLabel: string
  description: string
  groupLabel: string
  eyebrow: string
  matches: (contractor: Contractor) => boolean
}

/** Cap for national tag HTML: state grid + first N cards, not the full set. */
export const NATIONAL_TAG_PREVIEW_LIMIT = 75
export const NATIONAL_TAG_MAP_LIMIT = 200
/** Same caps on dense state and metro hubs so HTML stays crawlable. */
export const DIRECTORY_LIST_PREVIEW_LIMIT = NATIONAL_TAG_PREVIEW_LIMIT
export const DIRECTORY_MAP_PREVIEW_LIMIT = NATIONAL_TAG_MAP_LIMIT

type TagCopy = Pick<DirectoryTag, 'slug' | 'label' | 'shortLabel' | 'description'>

export function getTagSeoTitle(
  tag: TagCopy,
  count: number,
  stateName?: string,
): string {
  if (tag.slug === 'cipp') {
    if (stateName) {
      if (count <= 0) return `CIPP Lining Contractors in ${stateName}`
      if (count === 1) return `1 CIPP Lining Contractor in ${stateName}`
      return `${count} CIPP Lining Contractors in ${stateName}`
    }
    return 'CIPP Lining Contractors'
  }

  if (tag.slug === 'trenchless') {
    if (stateName) {
      return count > 0
        ? `${count} Trenchless Contractors in ${stateName}`
        : `Trenchless Contractors in ${stateName}`
    }
    return 'Trenchless Sewer Contractors'
  }

  if (tag.slug === 'emergency-backup' || tag.slug === 'sewer_backup_emergency') {
    if (stateName) {
      return count > 0
        ? `${count} Emergency Sewer Pros in ${stateName}`
        : `Emergency Sewer Repair in ${stateName}`
    }
    return 'Sewer Backup Emergency Contractors'
  }

  if (stateName) {
    return count > 0
      ? `${count} ${tag.shortLabel} Contractors in ${stateName}`
      : `${tag.shortLabel} Contractors in ${stateName}`
  }
  return `${tag.label} Sewer Repair`
}

export function getTagMetaDescription(
  tag: TagCopy,
  count: number,
  stateName?: string,
): string {
  const where = stateName ? ` in ${stateName}` : ' across the national directory'
  if (tag.slug === 'cipp') {
    return `${count.toLocaleString()} researched CIPP lining contractors${where}. Website method signal only; confirm recent lateral lining jobs and warranty path directly.`
  }
  if (tag.slug === 'trenchless') {
    return `${count.toLocaleString()} researched contractors${where} with trenchless or lining signal. Sorted by website signal and sewer-specific reviews.`
  }
  if (tag.slug === 'emergency-backup' || tag.slug === 'sewer_backup_emergency') {
    return `${count.toLocaleString()} researched contractors${where} with sewer backup emergency language in reviews. Starting filter, not an endorsement.`
  }
  return `${count.toLocaleString()} researched contractors with ${tag.label} website signal${where}. ${tag.description}`
}

export function getTagH1(tag: TagCopy, stateName?: string): string {
  if (tag.slug === 'cipp') {
    return stateName
      ? `CIPP lining contractors in ${stateName}`
      : 'CIPP lining contractors'
  }
  if (tag.slug === 'trenchless') {
    return stateName
      ? `Trenchless sewer repair in ${stateName}`
      : 'Trenchless sewer contractors'
  }
  if (tag.slug === 'emergency-backup' || tag.slug === 'sewer_backup_emergency') {
    return stateName
      ? `Sewer backup emergency contractors in ${stateName}`
      : 'Sewer backup emergency contractors'
  }
  return stateName
    ? `${tag.label} sewer repair in ${stateName}`
    : `${tag.label} sewer repair`
}
