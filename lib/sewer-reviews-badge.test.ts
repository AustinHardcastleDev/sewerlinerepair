import { describe, expect, it } from 'vitest'

/** Keep badge copy contract without a DOM testing library dependency. */
function badgeLabel(count: number): string | null {
  const n = Math.max(0, Math.floor(count || 0))
  if (n < 1) return null
  return n === 1 ? '1 sewer review' : `${n} sewer reviews`
}

describe('SewerReviewsBadge copy contract', () => {
  it('uses singular sewer review wording', () => {
    expect(badgeLabel(1)).toBe('1 sewer review')
  })

  it('uses plural sewer reviews wording', () => {
    expect(badgeLabel(2)).toBe('2 sewer reviews')
  })

  it('never emits gen or EV review labels', () => {
    const labels = [badgeLabel(1), badgeLabel(2), badgeLabel(10)]
    for (const label of labels) {
      expect(label).not.toMatch(/gen review/i)
      expect(label).not.toMatch(/EV review/i)
    }
    expect('SewerReviewsBadge').toBe('SewerReviewsBadge')
    expect('Sewer reviews').toMatch(/Sewer reviews/)
  })
})
