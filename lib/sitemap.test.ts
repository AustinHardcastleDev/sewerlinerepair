import { describe, expect, it } from 'vitest'
import { LIST_BASE, SITE, SITE_URL } from './site'

describe('canonical host helpers', () => {
  it('uses an absolute https site URL', () => {
    expect(SITE_URL.startsWith('https://')).toBe(true)
    expect(SITE_URL.endsWith('/')).toBe(false)
  })

  it('keeps directory paths off the retired blog and installer hubs', () => {
    expect(LIST_BASE).toBe('/contractors')
    expect(LIST_BASE).not.toContain('blog')
    expect(LIST_BASE).not.toContain('installers')
  })

  it('defaults the public host to the playbook domain unless overridden', () => {
    expect(SITE.domain).toBe('www.sewerlinerepairlist.com')
    expect(SITE.url).toBe(`https://${SITE.domain}`)
  })
})
