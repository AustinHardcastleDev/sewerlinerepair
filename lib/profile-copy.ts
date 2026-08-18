import type { Contractor } from './contractor-model'
import {
  residentialConfidence,
  sewerReviewCount,
  normalizeReviewTags,
} from './contractor-model'
import { getGeneratedProfile } from './generated-profiles'
import { hedgeCredentialClaims } from './claim-hedge'
import { truncateText } from './seo'

type EvidenceTier = 'rich' | 'medium' | 'thin'

function locationLabel(
  contractor: Pick<Contractor, 'city' | 'stateAbbr' | 'state'>,
): string {
  if (contractor.city) return `${contractor.city}, ${contractor.stateAbbr}`
  return contractor.state
}

function dedicatedPagePath(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')
    return path || null
  } catch {
    return null
  }
}

function residentialDedicatedPage(contractor: Contractor): string | null {
  return (
    contractor.lanes?.residential_sewer?.dedicatedPage ||
    contractor.dedicatedPage ||
    null
  )
}

function residentialMentions(contractor: Contractor): number {
  return (
    contractor.lanes?.residential_sewer?.mentions ||
    contractor.sewerMentions ||
    0
  )
}

function secondaryCategories(contractor: Contractor): string[] {
  const primary = (contractor.categoryName || '').toLowerCase()
  return (contractor.categories || [])
    .filter((category) => category && category.toLowerCase() !== primary)
    .slice(0, 2)
}

function dominantSiteLanguage(contractor: Contractor): string | null {
  const related = contractor.relatedMentions || {
    lateralRepair: 0,
    mainLineRepair: 0,
    trenchlessLining: 0,
    pipeBursting: 0,
    excavation: 0,
    cameraInspection: 0,
    hydroJetting: 0,
    rootRemoval: 0,
    cleanoutInstall: 0,
    sewerBackup: 0,
    residential: 0,
    commercial: 0,
    municipal: 0,
  }
  const entries = [
    { label: 'trenchless lining', count: related.trenchlessLining },
    { label: 'pipe bursting', count: related.pipeBursting },
    { label: 'lateral repair', count: related.lateralRepair },
    { label: 'excavation', count: related.excavation },
    { label: 'camera inspection', count: related.cameraInspection },
  ]
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)

  if (entries.length === 0) return null
  const top = entries[0]
  if (entries.length === 1) return top.label
  return `${top.label} and ${entries[1].label}`
}

function topReviewThemes(
  contractor: Contractor,
  limit: number,
): { label: string; matchedReviewCount: number }[] {
  const tags = normalizeReviewTags(
    contractor.sewerScopedTags?.length
      ? contractor.sewerScopedTags
      : contractor.reviewTags,
  )
  return [...tags]
    .sort((a, b) => b.matchedReviewCount - a.matchedReviewCount)
    .slice(0, limit)
}

function getEvidenceTier(contractor: Contractor): EvidenceTier {
  const confidence = residentialConfidence(contractor)
  const tagCount =
    contractor.sewerScopedTags?.length || contractor.reviewTags?.length || 0
  const topTag = topReviewThemes(contractor, 1)[0]
  const strongTags =
    topTag &&
    (topTag.matchedReviewCount >= 3 || sewerReviewCount(contractor) >= 3)

  if (
    confidence === 'explicit' &&
    (residentialDedicatedPage(contractor) || tagCount >= 2 || strongTags)
  ) {
    return 'rich'
  }
  if (
    confidence !== 'medium' ||
    (contractor.reviewsCount || 0) >= 5 ||
    tagCount >= 1 ||
    sewerReviewCount(contractor) >= 1
  ) {
    return 'medium'
  }
  return 'thin'
}

function composeIdentitySentence(contractor: Contractor): string {
  const loc = locationLabel(contractor)
  const extras = secondaryCategories(contractor)
  const pagePath = dedicatedPagePath(residentialDedicatedPage(contractor))

  if (pagePath) {
    return `${contractor.name} operates from ${loc} and publishes a dedicated sewer page at ${pagePath}.`
  }

  const topTags = topReviewThemes(contractor, 2)
  if (topTags.length > 0 && topTags[0].matchedReviewCount >= 3) {
    const leadTag = topTags[0].label.toLowerCase()
    const second =
      topTags[1] && topTags[1].matchedReviewCount >= 2
        ? ` and ${topTags[1].label.toLowerCase()}`
        : ''
    return `${contractor.name} in ${loc} shows up repeatedly in permitted sewer-tagged reviews mentioning ${leadTag}${second}.`
  }

  const category = contractor.categoryName || 'contractor'
  if (extras.length > 0) {
    return `${contractor.name} is listed as a ${category.toLowerCase()} in ${loc}, with Google categories that also include ${extras.join(' and ').toLowerCase()}.`
  }

  return `${contractor.name} is a ${category.toLowerCase()} based in ${loc}.`
}

function composeWebsiteSentence(contractor: Contractor): string | null {
  const mentions = residentialMentions(contractor)
  const siteLanguage = dominantSiteLanguage(contractor)
  const confidence = residentialConfidence(contractor)

  if (confidence === 'explicit') {
    const base = `Their website mentions sewer line repair ${mentions} time${mentions === 1 ? '' : 's'}`
    if (siteLanguage) {
      return `${base}, with heavier ${siteLanguage} language across the site.`
    }
    return `${base} and markets sewer repair or replacement directly to homeowners.`
  }

  if (confidence === 'high') {
    return `Their website repeats sewer repair language ${mentions} times, but does not lead with a dedicated sewer page.`
  }

  if (confidence === 'medium') {
    if (siteLanguage) {
      return `Their website references sewer repair ${mentions} time${mentions === 1 ? '' : 's'} while talking more about ${siteLanguage} work.`
    }
    return `Their website references sewer repair ${mentions} time${mentions === 1 ? '' : 's'}.`
  }

  return null
}

function composeReviewThemesSentence(contractor: Contractor): string | null {
  // Do not invent or display Google overall ratings as sewer proof when review
  // fields are not permitted. Only mention sewer-scoped counts when present.
  const sewerCount = sewerReviewCount(contractor)
  const topTags = topReviewThemes(contractor, 3)

  if (topTags.length > 0 && sewerCount > 0) {
    const themeParts = topTags.map((tag) => {
      const count =
        tag.matchedReviewCount > 1 ? ` (${tag.matchedReviewCount} mentions)` : ''
      return `${tag.label.toLowerCase()}${count}`
    })
    return `${sewerCount} sewer-specific review${sewerCount === 1 ? '' : 's'}; tagged language most often mentions ${themeParts.join(', ')}.`
  }

  if (sewerCount > 0) {
    return `${sewerCount} sewer-specific review${sewerCount === 1 ? '' : 's'} in the permitted sample.`
  }
  return null
}

function composeThinLead(contractor: Contractor): string {
  const loc = locationLabel(contractor)
  const website = composeWebsiteSentence(contractor)

  if (website) {
    return `${contractor.name} in ${loc} is a light file in this directory: ${website.replace(/\.$/, '')}. Verify sewer line scope, ownership, permits, and restoration before you spend time on a quote.`
  }
  return `${contractor.name} in ${loc} has limited website signal in our dataset. Treat this as a starting lead, not a confirmed sewer repair specialist.`
}

export function composeProfileLead(contractor: Contractor): string {
  const tier = getEvidenceTier(contractor)
  if (tier === 'thin') return composeThinLead(contractor)

  const sentences = [composeIdentitySentence(contractor)]
  const website = composeWebsiteSentence(contractor)
  const reviews = composeReviewThemesSentence(contractor)

  if (website) sentences.push(website)
  if (reviews) sentences.push(reviews)

  return sentences.slice(0, tier === 'rich' ? 3 : 2).join(' ')
}

export function composeProfileSubhead(contractor: Contractor): string {
  const loc = locationLabel(contractor)
  const pagePath = dedicatedPagePath(residentialDedicatedPage(contractor))
  const topTag = topReviewThemes(contractor, 1)[0]
  const confidence = residentialConfidence(contractor)
  const mentions = residentialMentions(contractor)

  if (pagePath) {
    return `Dedicated sewer page · ${mentions} site mention${mentions === 1 ? '' : 's'} · ${loc}`
  }

  if (topTag && topTag.matchedReviewCount >= 3) {
    return `Review signal: ${topTag.label.toLowerCase()} · ${loc}`
  }

  if (confidence === 'explicit') {
    return `Strong website sewer signal · ${loc}`
  }

  if (confidence === 'high') {
    return `Repeated sewer language on site · ${loc}`
  }

  return `Sewer repair mention found on site · ${loc}`
}

export function composeReviewSummary(contractor: Contractor): string | null {
  if (sewerReviewCount(contractor) < 1) return null
  const topTags = topReviewThemes(contractor, 2)
  if (topTags.length === 0) return null

  const lead = topTags[0]
  const second = topTags[1]
  const leadPhrase = `${lead.label.toLowerCase()} (${lead.matchedReviewCount} tagged mention${lead.matchedReviewCount === 1 ? '' : 's'})`

  if (second && second.matchedReviewCount >= 2) {
    return `Across permitted sewer-tagged reviews, ${leadPhrase} is the most common theme, followed by ${second.label.toLowerCase()}.`
  }

  return `Across permitted sewer-tagged reviews, ${leadPhrase} is the most common theme.`
}

function isFullContractor(
  contractor: Pick<Contractor, 'id' | 'writeup'> & Partial<Contractor>,
): contractor is Contractor {
  return Boolean(contractor.relatedMentions) && typeof contractor.primaryLane === 'string'
}

/** Prefer Gemini Flash copy, then rule-based composition, then stored writeup. */
export function getProfileLead(
  contractor: Pick<Contractor, 'id' | 'writeup' | 'name' | 'primaryLane'> &
    Partial<Contractor>,
): string {
  const generated = getGeneratedProfile(contractor)
  if (generated?.lead) return hedgeCredentialClaims(generated.lead)
  if (isFullContractor(contractor)) {
    return hedgeCredentialClaims(composeProfileLead(contractor))
  }
  return hedgeCredentialClaims(
    contractor.writeup ||
      `${contractor.name} shows sewer line website signal. Confirm licensing, scope, and recent work directly.`,
  )
}

export function getProfileSubhead(contractor: Contractor): string {
  const generated = getGeneratedProfile(contractor)
  if (generated?.subhead) return hedgeCredentialClaims(generated.subhead)
  return hedgeCredentialClaims(composeProfileSubhead(contractor))
}

export function getReviewSummaryText(contractor: Contractor): string | null {
  const generated = getGeneratedProfile(contractor)
  if (generated?.reviewSummary) {
    return hedgeCredentialClaims(generated.reviewSummary)
  }
  const composed = composeReviewSummary(contractor)
  return composed ? hedgeCredentialClaims(composed) : null
}

export function getFaqSewerAnswer(contractor: Contractor): string | null {
  const generated = getGeneratedProfile(contractor)
  if (generated?.faqSewerAnswer) {
    return hedgeCredentialClaims(generated.faqSewerAnswer)
  }
  return null
}

export function getProfileMetaDescription(
  contractor: Contractor,
  fallback: string,
): string {
  const generated = getGeneratedProfile(contractor)
  if (generated?.metaDescription) {
    return hedgeCredentialClaims(generated.metaDescription)
  }
  return hedgeCredentialClaims(fallback)
}

/**
 * SERP title: shorten company name first so “Sewer Repair Contractor” + city/state stay.
 * Used as an absolute title (no long site-name suffix).
 */
export function getProfileSeoTitle(contractor: Contractor): string {
  const loc = locationLabel(contractor)
  const suffix = ` Sewer Repair Contractor in ${loc}`
  const nameBudget = Math.max(18, 58 - suffix.length)
  const name = truncateText(contractor.name, nameBudget).replace(/…$/, '').trim()
  return `${name}${suffix}`
}
