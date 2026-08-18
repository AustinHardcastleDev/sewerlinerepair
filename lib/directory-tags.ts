import { contractors } from './contractors'
import type { Contractor } from './contractor-model'
import { normalizeReviewTags } from './contractor-model'
import {
  BRAND_TAGS,
  MIN_NATIONAL_BRAND_INSTALLERS,
  MIN_NATIONAL_TAG_STATES,
  MIN_STATE_BRAND_INSTALLERS,
  contractorHasBrand,
  type BrandTag,
} from './method-meta'
import {
  type DirectoryTag,
  type DirectoryTagKind,
  NATIONAL_TAG_MAP_LIMIT,
  NATIONAL_TAG_PREVIEW_LIMIT,
  DIRECTORY_LIST_PREVIEW_LIMIT,
  DIRECTORY_MAP_PREVIEW_LIMIT,
  getTagH1,
  getTagMetaDescription,
  getTagSeoTitle,
} from './tag-seo'

export {
  type DirectoryTag,
  type DirectoryTagKind,
  NATIONAL_TAG_MAP_LIMIT,
  NATIONAL_TAG_PREVIEW_LIMIT,
  DIRECTORY_LIST_PREVIEW_LIMIT,
  DIRECTORY_MAP_PREVIEW_LIMIT,
  getTagH1,
  getTagMetaDescription,
  getTagSeoTitle,
}

type FAQItem = { q: string; a: string }

export const MIN_NATIONAL_TAG_INSTALLERS = MIN_NATIONAL_BRAND_INSTALLERS
export const MIN_STATE_TAG_INSTALLERS = MIN_STATE_BRAND_INSTALLERS


function hasReviewTag(contractor: Contractor, tagId: string): boolean {
  const tags = [
    ...normalizeReviewTags(contractor.sewerScopedTags),
    ...normalizeReviewTags(contractor.reviewTags),
  ]
  return tags.some((tag) => tag.id === tagId)
}

/** Prefer sewer-scoped review tags only (not generic business reviews). */
function hasSewerScopedTag(contractor: Contractor, tagId: string): boolean {
  return normalizeReviewTags(contractor.sewerScopedTags).some(
    (tag) => tag.id === tagId,
  )
}

/** Intent filters backed by website / review signal (not method tags). */
export const INTENT_TAGS: DirectoryTag[] = [
  {
    slug: 'emergency-backup',
    id: 'sewer_backup_emergency',
    kind: 'intent',
    label: 'Sewer backup emergency',
    shortLabel: 'Emergency',
    groupLabel: 'Emergency services',
    eyebrow: 'Emergency signal',
    description:
      'Contractors with sewer backup or emergency response signal. Confirm after-hours availability and structural repair scope beyond clearing.',
    matches: (contractor) =>
      (contractor.relatedMentions?.sewerBackup || 0) > 0 ||
      hasSewerScopedTag(contractor, 'sewer_backup_emergency'),
  },
]

function brandToDirectoryTag(brand: BrandTag): DirectoryTag {
  return {
    slug: brand.slug,
    id: brand.id,
    kind: 'brand',
    label: brand.label,
    shortLabel: brand.shortLabel,
    groupLabel: 'Method',
    eyebrow: 'Method signal',
    description: brand.description,
    matches: (contractor) => contractorHasBrand(contractor, brand.id),
  }
}

export const DIRECTORY_TAGS: DirectoryTag[] = [
  ...INTENT_TAGS,
  ...BRAND_TAGS.map(brandToDirectoryTag),
]

export function getDirectoryTagBySlug(slug: string): DirectoryTag | undefined {
  return DIRECTORY_TAGS.find((tag) => tag.slug === slug)
}

export function getContractorsByTag(tag: DirectoryTag): Contractor[] {
  return contractors.filter((contractor) => tag.matches(contractor))
}

export function getContractorsByTagInState(
  tag: DirectoryTag,
  stateSlug: string,
): Contractor[] {
  return contractors.filter(
    (contractor) =>
      contractor.stateSlug === stateSlug && tag.matches(contractor),
  )
}

export function directoryTagCounts(): {
  tag: DirectoryTag
  count: number
}[] {
  return DIRECTORY_TAGS.map((tag) => ({
    tag,
    count: getContractorsByTag(tag).length,
  })).filter((row) => row.count > 0)
}

export function intentTagCounts(): { tag: DirectoryTag; count: number }[] {
  return directoryTagCounts().filter((row) => row.tag.kind === 'intent')
}

export function nationalTagQualifies(tag: DirectoryTag): boolean {
  const matches = getContractorsByTag(tag)
  if (matches.length < MIN_NATIONAL_TAG_INSTALLERS) return false
  const states = new Set(matches.map((c) => c.stateSlug))
  return states.size >= MIN_NATIONAL_TAG_STATES
}

export function stateTagQualifies(
  stateSlug: string,
  tag: DirectoryTag,
): boolean {
  return (
    getContractorsByTagInState(tag, stateSlug).length >= MIN_STATE_TAG_INSTALLERS
  )
}

export function getStateDirectoryTags(stateSlug: string): DirectoryTag[] {
  return DIRECTORY_TAGS.filter((tag) => stateTagQualifies(stateSlug, tag))
}

export function getStateCountsForTag(
  tag: DirectoryTag,
): { stateSlug: string; stateName: string; stateAbbr: string; count: number }[] {
  const counts = new Map<
    string,
    { stateSlug: string; stateName: string; stateAbbr: string; count: number }
  >()

  for (const contractor of contractors) {
    if (!tag.matches(contractor)) continue
    const existing = counts.get(contractor.stateSlug)
    if (existing) {
      existing.count += 1
      continue
    }
    counts.set(contractor.stateSlug, {
      stateSlug: contractor.stateSlug,
      stateName: contractor.state,
      stateAbbr: contractor.stateAbbr,
      count: 1,
    })
  }

  return [...counts.values()]
    .filter((entry) => entry.count >= MIN_STATE_TAG_INSTALLERS)
    .sort((a, b) => b.count - a.count)
}

export function getTopStateLinksForTag(
  tag: DirectoryTag,
  limit = 12,
): { stateSlug: string; stateName: string; stateAbbr: string; count: number }[] {
  return getStateCountsForTag(tag).slice(0, limit)
}

export function getTagIntro(
  tag: DirectoryTag,
  count: number,
  totalNational: number,
  stateName?: string,
): string {
  const countLabel = count.toLocaleString()
  if (tag.slug === 'cipp') {
    if (stateName) {
      return `${countLabel} researched shops in ${stateName} whose websites show CIPP lining signal. Website mention is not the same as a lining specialty; confirm recent residential lateral lining jobs, camera documentation, and warranty path with the shop.`
    }
    return `${countLabel} of ${totalNational.toLocaleString()} researched contractors whose websites show CIPP lining signal. This list is a website-signal shortlist, not a certified-installer directory. Confirm recent lining work and warranty path directly.`
  }
  if (tag.slug === 'trenchless') {
    const scope = stateName
      ? `in ${stateName}`
      : `of ${totalNational.toLocaleString()} researched nationally`
    return `${countLabel} contractors ${scope} with trenchless or lining signal on their website or in tagged reviews. ${tag.description}`
  }
  if (tag.slug === 'emergency-backup' || tag.slug === 'sewer_backup_emergency') {
    const scope = stateName
      ? `in ${stateName}`
      : `of ${totalNational.toLocaleString()} researched nationally`
    return `${countLabel} contractors ${scope} with sewer backup or after-hours language in permitted reviews. ${tag.description}`
  }
  if (stateName) {
    return `${countLabel} researched contractors in ${stateName} whose websites show ${tag.label} signal. ${tag.description}`
  }
  return `${countLabel} of ${totalNational.toLocaleString()} researched contractors whose websites show ${tag.label} signal. ${tag.description}`
}

export function getTagFaqs(
  tag: DirectoryTag,
  count: number,
  stateName?: string,
): FAQItem[] {
  if (tag.slug === 'cipp') {
    return [
      {
        q: stateName
          ? `Does a CIPP mention mean they specialize in lining in ${stateName}?`
          : 'Does a CIPP mention mean they specialize in lining?',
        a: 'Not necessarily. We record CIPP language that appears on contractor websites. Confirm recent residential lateral lining jobs, camera documentation, and local permit experience with the shop.',
      },
      {
        q: 'Is CIPP the same as drain cleaning or hydro jetting?',
        a: 'No. CIPP is a structural lining method. Drain cleaning, camera inspection, and hydro jetting can help diagnose or clear a line, but they do not independently prove a shop performs cured-in-place repair.',
      },
      {
        q: stateName
          ? `How many ${stateName} shops show CIPP signal?`
          : 'How many shops show CIPP signal?',
        a: `${count.toLocaleString()} researched contractors${stateName ? ` in ${stateName}` : ''} have CIPP on their website method list.`,
      },
      {
        q: 'Are these recommendations?',
        a: 'No. Method-filtered website signal is a starting filter, not an endorsement.',
      },
    ]
  }

  if (tag.slug === 'trenchless') {
    return [
      {
        q: 'What counts as trenchless signal?',
        a: 'Website language about CIPP lining, pipe bursting, or trenchless repair, or permitted sewer-tagged reviews that mention those methods. It is research signal, not a guarantee of method fit for your break.',
      },
      {
        q: 'Is this different from portable sewer shops?',
        a: 'Yes. This filter favors trenchless method language. Confirm cleanouts, host-pipe condition, and whether excavation remains necessary.',
      },
      {
        q: 'Are these recommendations?',
        a: 'No. Independently researched listings, not endorsements.',
      },
    ]
  }

  if (tag.slug === 'emergency-backup' || tag.slug === 'sewer_backup_emergency') {
    return [
      {
        q: 'Does this mean they handle after-hours backups?',
        a: 'Not automatically. These shops have sewer-scoped backup or emergency language. Confirm after-hours coverage and whether they repair the lateral or only clear the clog.',
      },
      {
        q: 'Is a backup the same as a structural sewer repair?',
        a: 'No. Clearing a clog is not the same as lining, bursting, or replacing a broken lateral. Ask what they found on camera and which repair methods they actually perform.',
      },
      {
        q: 'Are these recommendations?',
        a: 'No. Sewer-scoped review filters are a starting point, not endorsements.',
      },
    ]
  }

  return [
    {
      q: `Does a ${tag.label} mention mean they specialize in that method${stateName ? ` in ${stateName}` : ''}?`,
      a: 'Not necessarily. We record method language that appears on contractor websites. Confirm recent residential lateral jobs, camera documentation, and local permit experience with the shop.',
    },
    {
      q: 'Why filter by method if the directory is method-agnostic?',
      a: 'Because you might already know you want lining, bursting, or open-cut. The directory does not rank methods. This filter just makes it faster to find contractors who mention the method you have in mind.',
    },
    {
      q: 'Are these recommendations?',
      a: 'No. Method-filtered website signal is a starting filter, not an endorsement.',
    },
  ]
}
