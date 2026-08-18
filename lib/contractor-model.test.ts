import { describe, expect, it } from 'vitest'
import { normalizeReviewTags } from './contractor-model'

describe('normalizeReviewTags', () => {
  it('turns bare tag ids into labeled records', () => {
    const tags = normalizeReviewTags(['transparent_pricing', 'professional_crew'])
    expect(tags).toEqual([
      {
        id: 'transparent_pricing',
        label: 'transparent pricing',
        matchedReviewCount: 1,
      },
      {
        id: 'professional_crew',
        label: 'professional crew',
        matchedReviewCount: 1,
      },
    ])
  })

  it('keeps existing records and fills a missing label', () => {
    const tags = normalizeReviewTags([
      { id: 'lateral_repair', label: '', matchedReviewCount: 4 },
    ])
    expect(tags[0].label).toBe('lateral repair')
    expect(tags[0].matchedReviewCount).toBe(4)
  })
})
