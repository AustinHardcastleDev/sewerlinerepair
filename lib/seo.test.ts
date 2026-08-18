import { describe, expect, it } from 'vitest'
import { seoDescription, seoTitle, truncateText } from './seo'
import { getProfileSeoTitle } from './profile-copy'
import type { Contractor } from './contractor-model'

describe('seo helpers', () => {
  it('truncates on word boundaries', () => {
    expect(truncateText('alpha beta gamma', 12)).toBe('alpha beta…')
  })

  it('keeps short titles intact', () => {
    expect(seoTitle('12 Sewer Repair Contractors in Ohio')).toBe(
      '12 Sewer Repair Contractors in Ohio',
    )
  })

  it('caps descriptions without mid-word cuts when possible', () => {
    const long =
      'Compare 120 Ohio sewer line contractors with website signal research notes and dedicated sewer pages across the state market.'
    const out = seoDescription(long)
    expect(out.length).toBeLessThanOrEqual(155)
    expect(out.endsWith('…') || out.length <= 155).toBe(true)
  })
})

describe('getProfileSeoTitle', () => {
  it('preserves Sewer Repair Contractor and location when the name is long', () => {
    const contractor = {
      name: 'Very Long Named Electrical Contracting Services of Metro Atlanta LLC',
      city: 'Marietta',
      stateAbbr: 'GA',
      state: 'Georgia',
    } as Pick<Contractor, 'name' | 'city' | 'stateAbbr' | 'state'>
    const title = getProfileSeoTitle(contractor as Contractor)
    expect(title).toContain('Sewer Repair Contractor in Marietta, GA')
    expect(title.length).toBeLessThan(90)
  })
})
