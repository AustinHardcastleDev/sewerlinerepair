import { describe, expect, it } from 'vitest'
import { hedgeCredentialClaims } from './claim-hedge'

describe('hedgeCredentialClaims', () => {
  it('leaves ordinary Flash prose alone', () => {
    const text =
      'Acme Electric shows sewer line signal on a dedicated services page.'
    expect(hedgeCredentialClaims(text)).toBe(text)
  })

  it('softens licensed / certified / authorized dealer claims', () => {
    const text =
      'They are a licensed and certified shop and an authorized dealer for CIPP.'
    const out = hedgeCredentialClaims(text)
    expect(out).toMatch(/reportedly licensed/i)
    expect(out).toMatch(/reportedly certified/i)
    expect(out).toMatch(/confirm authorization/i)
    expect(out).not.toMatch(/\ban authorized dealer\b/i)
  })
})
