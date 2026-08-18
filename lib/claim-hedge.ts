/**
 * Soft post-process for generated profile copy.
 * Keeps Flash prose intact while hedging credential claims we cannot verify.
 */

const ALREADY_HEDGED =
  /\b(reportedly|may be|confirm|not independently verified|self[- ]described)\b/i

/**
 * Hedge licensed / certified / authorized language without rewriting the rest.
 */
export function hedgeCredentialClaims(text: string): string {
  if (!text) return text
  if (!/\b(licensed|certified|authorized)\b/i.test(text)) return text
  if (ALREADY_HEDGED.test(text) && !/\bauthorized\s+dealer/i.test(text)) {
    // Still soften definitive authorized-dealer phrasing when present.
    return text.replace(
      /\b(an?\s+)?authorized\s+dealers?\b/gi,
      'a dealer (confirm authorization)',
    )
  }

  return text
    .replace(
      /\b(an?\s+)?authorized\s+dealers?\b/gi,
      'a dealer (confirm authorization)',
    )
    .replace(/\bauthorized\b/gi, 'reportedly authorized')
    .replace(/\blicensed\b/gi, 'reportedly licensed')
    .replace(/\bcertified\b/gi, 'reportedly certified')
}
