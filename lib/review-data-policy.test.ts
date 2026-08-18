import { describe, expect, it } from 'vitest'
import rights from '../docs/research/data-rights.json'
import contractors from './data/contractors.fixture.json'
import { sewerReviewCount } from './contractor-model'

describe('review data policy', () => {
  it('blocks AggregateRating and raw review excerpts', () => {
    expect(rights.fields.overallRating.display).toBe(false)
    expect(rights.fields.rawReviewText.display).toBe(false)
    expect(rights.fields.reviewExcerpt.display).toBe(false)
    expect(rights.reviewOperations.publicOverallGoogleRating).toBe('blocked')
  })

  it('permits sewer-review counts for the public badge', () => {
    expect(rights.fields.sewerReviewCount.display).toBe(true)
    expect(rights.reviewOperations.publicSewerReviewBadge).toBe('permitted')
  })

  it('does not store raw snippets on extracted contractors', () => {
    const withSnippets = contractors.filter(
      (c) => Array.isArray(c.sewerReviewSnippets) && c.sewerReviewSnippets.length > 0,
    )
    expect(withSnippets).toHaveLength(0)
  })

  it('keeps overall Google star ratings out of the public review UI contract', () => {
    expect(rights.reviewOperations.publicOverallGoogleRating).toBe('blocked')
    expect(rights.fields.overallReviewCount.display).toBe(true)
  })

  it('never treats overall Google count as the sewer badge', () => {
    const sample = contractors.find(
      (c) => (c.reviewsCount || 0) > 0 && sewerReviewCount(c) === 0,
    )
    expect(sample).toBeTruthy()
    expect(sewerReviewCount(sample!)).not.toBe(sample!.reviewsCount)
  })
})
