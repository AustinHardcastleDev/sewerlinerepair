import { describe, expect, it } from 'vitest'
import { BRAND_TAGS, contractorHasBrand } from './method-meta'
import {
  getTagSeoTitle,
  NATIONAL_TAG_PREVIEW_LIMIT,
  DIRECTORY_LIST_PREVIEW_LIMIT,
  DIRECTORY_MAP_PREVIEW_LIMIT,
} from './tag-seo'

describe('directory tags', () => {
  it('defines sewer method and intent tags', () => {
    const slugs = BRAND_TAGS.map((t) => t.slug)
    expect(slugs).toContain('trenchless')
    expect(slugs).toContain('open-cut')
    expect(slugs).toContain('cipp')
    expect(slugs).not.toContain('service')
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('keeps state names in trenchless SEO titles', () => {
    const tag = BRAND_TAGS.find((t) => t.slug === 'trenchless')
    expect(tag).toBeTruthy()
    const title = getTagSeoTitle(tag!, 42, 'Tennessee')
    expect(title).toContain('Tennessee')
    expect(title).toContain('42')
    expect(title.toLowerCase()).not.toContain('dealer')
  })

  it('uses CIPP lining language, not dealer language', () => {
    const tag = BRAND_TAGS.find((t) => t.slug === 'cipp')
    expect(tag).toBeTruthy()
    const title = getTagSeoTitle(tag!, 12, 'Texas')
    expect(title).toContain('Texas')
    expect(title).toContain('CIPP')
    expect(title.toLowerCase()).not.toContain('dealer')
  })

  it('treats pipe_lining_cipp and excavation as CIPP / open-cut aliases', () => {
    expect(
      contractorHasBrand({ primaryMethods: ['pipe_lining_cipp'] }, 'cipp'),
    ).toBe(true)
    expect(
      contractorHasBrand({ primaryMethods: ['excavation'] }, 'open_cut'),
    ).toBe(true)
    expect(
      contractorHasBrand({ primaryMethods: ['camera_inspection'] }, 'cipp'),
    ).toBe(false)
  })

  it('exports a national preview cap under 100', () => {
    expect(NATIONAL_TAG_PREVIEW_LIMIT).toBeLessThanOrEqual(100)
    expect(NATIONAL_TAG_PREVIEW_LIMIT).toBeGreaterThanOrEqual(50)
    expect(DIRECTORY_LIST_PREVIEW_LIMIT).toBe(NATIONAL_TAG_PREVIEW_LIMIT)
    expect(DIRECTORY_MAP_PREVIEW_LIMIT).toBeLessThanOrEqual(200)
  })
})
