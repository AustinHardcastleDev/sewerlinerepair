import { describe, expect, it } from 'vitest'
import { collectionItemList, directoryProfileEntity, seoDescription, seoTitle, truncateText } from './seo'
import { getTagSeoTitle } from './tag-seo'
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

describe('directory and tag SEO', () => {
  it('keeps the directory profile as the entity URL', () => {
    expect(
      directoryProfileEntity('https://www.sewerlinerepairlist.com/contractors/tx/acme', 'https://acme.example'),
    ).toEqual({
      url: 'https://www.sewerlinerepairlist.com/contractors/tx/acme',
      sameAs: 'https://acme.example',
    })
    expect(directoryProfileEntity('https://example.com/p', '  ')).toEqual({
      url: 'https://example.com/p',
    })
  })

  it('builds an item list only from the supplied contractors', () => {
    const list = collectionItemList([
      { name: 'Acme', stateSlug: 'tx', slug: 'acme' },
    ])
    expect(list.numberOfItems).toBe(1)
    expect(list.itemListElement[0]?.url).toContain('/contractors/tx/acme')
  })

  it('title-cases pipe bursting method titles', () => {
    expect(
      getTagSeoTitle(
        {
          slug: 'pipe-bursting',
          label: 'Pipe bursting',
          shortLabel: 'Pipe bursting',
          description: 'Bursting signal',
        },
        12,
      ),
    ).toBe('Pipe Bursting Sewer Repair')
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
