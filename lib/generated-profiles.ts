import generatedData from './data/generated-profiles.json'
import type { Contractor } from './contractor-model'

export type GeneratedProfileCopy = {
  subhead: string
  lead?: string
  reviewSummary: string | null
  faqSewerAnswer: string
  metaDescription: string
  generatedAt: string
  model: string
}

const generated = generatedData as unknown as Record<string, GeneratedProfileCopy>

export function getGeneratedProfile(
  contractor: Pick<Contractor, 'id'>,
): GeneratedProfileCopy | undefined {
  return generated[contractor.id]
}

export function hasGeneratedProfile(contractor: Pick<Contractor, 'id'>): boolean {
  return Boolean(generated[contractor.id]?.lead)
}

export function generatedProfileCount(): number {
  return Object.keys(generated).length
}
