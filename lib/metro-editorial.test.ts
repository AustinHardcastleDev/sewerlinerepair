import { describe, expect, it } from 'vitest'
import {
  composeMetroEditorial,
  getMetroSeoTitle,
  getMetroMetaDescription,
  metroEditorialKey,
} from './metro-editorial'
import { metros } from './metro-list'
import metroEditorialData from './data/metro-editorial.json'

describe('metro editorial', () => {
  it('produces a unique composed intro for every metro page', () => {
    const intros = new Set<string>()
    for (const metro of metros) {
      const editorial = composeMetroEditorial(metro, [])
      expect(editorial.intro.length).toBeGreaterThan(120)
      expect(editorial.intro).toContain(metro.name)
      expect(editorial.intro).not.toContain('—')
      expect(editorial.marketNote.length).toBeGreaterThan(40)
      expect(editorial.marketNote).not.toContain('—')
      expect(editorial.source).toBe('composed')
      expect(editorial.intro.toLowerCase()).not.toMatch(
        /\bfuel\b|\boutage\b|\bnec\b|\bstandby\b/,
      )
      intros.add(editorial.intro)
    }
    expect(intros.size).toBe(metros.length)
  })

  it('stores Flash editorial for every generated metro key', () => {
    const entries = Object.entries(
      metroEditorialData as Record<
        string,
        { intro?: string; marketNote?: string }
      >,
    )
    expect(entries.length).toBeGreaterThanOrEqual(267)
    for (const [key, rec] of entries) {
      expect(rec.intro?.trim().length, key).toBeGreaterThan(40)
      expect(rec.marketNote?.trim().length, key).toBeGreaterThan(40)
    }
    const metroKeys = new Set(metros.map((m) => metroEditorialKey(m)))
    for (const key of Object.keys(metroEditorialData)) {
      expect(metroKeys.has(key), key).toBe(true)
    }
  })

  it('keeps metro SEO titles short enough to retain the city name', () => {
    for (const metro of metros.slice(0, 40)) {
      const title = getMetroSeoTitle(metro, 0)
      expect(title).toContain(metro.name)
      const description = getMetroMetaDescription(metro, 0, 0)
      expect(description).toContain(metro.name)
      expect(description.length).toBeLessThanOrEqual(160)
    }
  })
})
