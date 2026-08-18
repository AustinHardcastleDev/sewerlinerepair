import type { Contractor } from './contractor-model'
import { residentialConfidence } from './contractor-model'
import type { Metro } from './metro-list'
import { METRO_RADIUS_MILES, getMetrosByState } from './metro-list'
import { getStateEditorial } from './state-editorial'
import metroEditorialData from './data/metro-editorial.json'

export type MetroEditorial = {
  intro: string
  marketNote: string
  cityClusters: { city: string; count: number }[]
  metaDescription?: string
  source: 'flash' | 'composed'
}

type GeneratedMetroEditorial = {
  intro?: string
  marketNote?: string
  metaDescription?: string
  generatedAt?: string
  model?: string
}

const generatedEditorial = metroEditorialData as Record<
  string,
  GeneratedMetroEditorial
>

export function metroEditorialKey(metro: Metro): string {
  return `${metro.stateSlug}/${metro.slug}`
}

function getGeneratedMetroEditorial(
  metro: Metro,
): GeneratedMetroEditorial | undefined {
  const entry = generatedEditorial[metroEditorialKey(metro)]
  if (!entry?.intro?.trim() || !entry?.marketNote?.trim()) return undefined
  return entry
}

function cityClusters(
  nearby: Contractor[],
  limit = 4,
): { city: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const contractor of nearby) {
    const city = (contractor.city || '').trim()
    if (!city) continue
    counts.set(city, (counts.get(city) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, limit)
}

function densityLabel(count: number): 'thin' | 'moderate' | 'solid' | 'busy' {
  if (count >= 80) return 'busy'
  if (count >= 35) return 'solid'
  if (count >= 12) return 'moderate'
  return 'thin'
}

function variantIndex(seed: string, modulo: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash % modulo
}

function withoutEmDashes(value: string): string {
  return value.replace(/\u2014/g, ', ').replace(/\s+,/g, ',').replace(/,\s*,/g, ',')
}

function formatClusters(
  clusters: { city: string; count: number }[],
): string | null {
  if (clusters.length === 0) return null
  const parts = clusters.map((row) => `${row.city} (${row.count})`)
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
}

function landscapeSentence(
  metro: Metro,
  editorial: ReturnType<typeof getStateEditorial>,
): string | null {
  if (!editorial) return null
  const bits: string[] = []
  if (editorial.licensingNote?.trim()) {
    bits.push(
      `Licensing context for ${metro.state}: ${withoutEmDashes(editorial.licensingNote.trim())}`,
    )
  }
  if (editorial.buyerNote?.trim()) {
    bits.push(withoutEmDashes(editorial.buyerNote.trim()))
  }
  const repair =
    editorial.homeRepairContext?.trim() || editorial.costContext?.trim()
  if (bits.length === 0 && repair) {
    bits.push(withoutEmDashes(repair))
  }
  if (bits.length === 0) return null
  return bits.slice(0, 2).join(' ')
}

/**
 * Prefer Flash-written landscape intros from metro-editorial.json.
 * Falls back to the deterministic composer when a metro is missing.
 */
export function getMetroEditorial(
  metro: Metro,
  nearby: Contractor[],
): MetroEditorial {
  const generated = getGeneratedMetroEditorial(metro)
  if (generated) {
    return {
      intro: withoutEmDashes(generated.intro!.trim()),
      marketNote: withoutEmDashes(generated.marketNote!.trim()),
      cityClusters: cityClusters(nearby),
      metaDescription: generated.metaDescription?.trim()
        ? withoutEmDashes(generated.metaDescription.trim())
        : undefined,
      source: 'flash',
    }
  }
  return composeMetroEditorial(metro, nearby)
}

/**
 * Unique metro intro + market note composed from nearby contractor signal
 * and state editorial facts. Deterministic for a given metro + nearby set.
 */
export function composeMetroEditorial(
  metro: Metro,
  nearby: Contractor[],
): MetroEditorial {
  const clusters = cityClusters(nearby)
  const clusterPhrase = formatClusters(clusters)
  const explicit = nearby.filter((i) => residentialConfidence(i) === 'explicit').length
  const high = nearby.filter((i) => residentialConfidence(i) === 'high').length
  const medium = nearby.filter((i) => residentialConfidence(i) === 'medium').length
  const density = densityLabel(nearby.length)
  const siblings = getMetrosByState(metro.stateSlug).filter(
    (entry) => entry.slug !== metro.slug,
  )
  const isLargest =
    getMetrosByState(metro.stateSlug)[0]?.slug === metro.slug &&
    getMetrosByState(metro.stateSlug).length > 1
  const editorial = getStateEditorial(metro.stateSlug)
  const v = variantIndex(`${metro.stateSlug}:${metro.slug}`, 3)

  const leadOptions = [
    `Residential sewer line repair near ${metro.name} usually means calling across plumbers and sewer contractors within about ${METRO_RADIUS_MILES} miles, not just offices inside city limits.`,
    `${metro.name}, ${metro.stateAbbr} buyers looking for sewer line repair hit the same category blur as everywhere else: the useful shops are mixed in with drain cleaning and septic work.`,
    `If you need sewer repair near ${metro.name}, start with shops that show residential sewer repair work on their own websites, then confirm scope and travel from your address.`,
  ]

  const countOptions = [
    `This directory lists ${nearby.length} researched contractors with offices inside that ${METRO_RADIUS_MILES}-mile ring (${explicit} with a dedicated sewer page, ${high} with repeated signal, ${medium} with at least one clear mention).`,
    `Within ${METRO_RADIUS_MILES} miles of ${metro.name} we found ${nearby.length} researched listings: ${explicit} dedicated sewer pages, ${high} repeated-signal shops, and ${medium} single-mention starts.`,
    `${nearby.length} researched contractors sit within ${METRO_RADIUS_MILES} miles of ${metro.name}. ${explicit} lead with a dedicated sewer page; ${high + medium} more show sewer signal worth a first call.`,
  ]

  let densitySentence = ''
  if (density === 'busy') {
    densitySentence = `That is a busy metro list by national standards, so filters for sewer-specific reviews help more here than in thinner markets.`
  } else if (density === 'solid') {
    densitySentence = `That is a solid metro shortlist: enough options to compare scopes without drowning in statewide noise.`
  } else if (density === 'moderate') {
    densitySentence = `Coverage is moderate. Widen to the full ${metro.state} list if your ZIP sits on the edge of the ring.`
  } else {
    densitySentence = `Coverage is thin inside the ring. Use the statewide ${metro.state} page if you need a wider net.`
  }

  const clusterSentence = clusterPhrase
    ? v === 0
      ? `Directory pins cluster most around ${clusterPhrase}.`
      : v === 1
        ? `The densest city clusters in this radius are ${clusterPhrase}.`
        : `Most of the nearby listings concentrate in ${clusterPhrase}.`
    : ''

  const sizeSentence = isLargest
    ? `${metro.name} is the largest metro page we publish in ${metro.state}.`
    : siblings.length > 0
      ? `Other ${metro.stateAbbr} metro pages include ${siblings
          .slice(0, 3)
          .map((s) => s.name)
          .join(', ')}${siblings.length > 3 ? ', and more' : ''}.`
      : `${metro.name} is currently the only metro page we publish for ${metro.state}.`

  const intro = [
    leadOptions[v],
    countOptions[v],
    densitySentence,
    clusterSentence,
    sizeSentence,
    'Sorted by distance, then sewer-specific review count. Website signal is a starting filter, not an endorsement.',
  ]
    .filter(Boolean)
    .join(' ')

  const landscape = landscapeSentence(metro, editorial)
  const ownership =
    `Before you compare bids near ${metro.name}, confirm who owns the lateral section, whether a camera locate is included, and how trenchless vs open-cut restoration is priced.`

  const marketNote = [landscape, ownership].filter(Boolean).join(' ')

  // Prefer a tight market note even if state editorial is missing pieces.
  const fallbackNote = `Ask who owns the lateral section, whether a camera locate is included, and how restoration and warranty work after repair. Use the ${nearby.length} researched listings near ${metro.name} as a place to start, then verify recent lateral repair work yourself.`

  return {
    intro: withoutEmDashes(intro),
    marketNote: withoutEmDashes(marketNote.trim() || fallbackNote),
    cityClusters: clusters,
    source: 'composed',
  }
}

export function getMetroSeoTitle(metro: Metro, nearbyCount: number): string {
  if (nearbyCount <= 0) {
    return `Sewer Line Repair Near ${metro.name}, ${metro.stateAbbr}`
  }
  if (nearbyCount === 1) {
    return `1 Sewer Repair Contractor Near ${metro.name}, ${metro.stateAbbr}`
  }
  return `${nearbyCount} Sewer Repair Contractors Near ${metro.name}`
}

export function getMetroMetaDescription(
  metro: Metro,
  nearbyCount: number,
  explicitCount: number,
): string {
  const generated = getGeneratedMetroEditorial(metro)
  if (generated?.metaDescription?.trim()) {
    return withoutEmDashes(generated.metaDescription.trim()).slice(0, 160)
  }
  const pageProof =
    explicitCount === 1
      ? '1 dedicated sewer page'
      : `${explicitCount} dedicated sewer pages`
  return `Compare ${nearbyCount} researched sewer line contractors within ${METRO_RADIUS_MILES} miles of ${metro.name}, ${metro.stateAbbr}. ${pageProof}. Sorted by distance and website signal.`
}
