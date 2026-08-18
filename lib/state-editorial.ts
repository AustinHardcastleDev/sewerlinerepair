import editorialData from './data/state-editorial.json'

export type StateEditorial = {
  marketOverview: string
  /** Preferred Flash field for repair landscape context. */
  homeRepairContext?: string
  /** Legacy alias retained for composed metro fallbacks. */
  costContext?: string
  buyerNote: string
  metaDescription?: string
  licensingNote?: string
  verifiedAsOf?: string
  generatedAt?: string
  model?: string
  source?: string
}

const editorial = editorialData as Record<string, StateEditorial>

export function getStateEditorial(stateSlug: string): StateEditorial | undefined {
  const entry = editorial[stateSlug]
  if (!entry?.marketOverview?.trim()) return undefined
  return entry
}

export function hasStateEditorial(stateSlug: string): boolean {
  return Boolean(getStateEditorial(stateSlug))
}
