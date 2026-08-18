export const SEARCH_RADII = [25, 50, 75, 100] as const
export const DEFAULT_SEARCH_RADIUS = 50
export const NEAR_ME_SEARCH_STORAGE_KEY =
  'sewerlinerepairlist:near-me-search:v1'

export type SearchRadius = (typeof SEARCH_RADII)[number]

export function normalizeZip(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value
  return String(raw || '').replace(/\D/g, '').slice(0, 5)
}

export function normalizeRadius(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return SEARCH_RADII.includes(parsed as SearchRadius)
    ? parsed
    : DEFAULT_SEARCH_RADIUS
}

export type StoredNearMeSearch = {
  zip: string
  radius: number
}

export function buildNearMeSearchUrl(radius: number): string {
  const safeRadius = normalizeRadius(String(radius))
  return `/contractors/near-me?zip=&radius=${safeRadius}`
}

export function saveNearMeSearch(
  storage: Storage,
  zip: string,
  radius: number,
): boolean {
  const safeZip = normalizeZip(zip)
  const safeRadius = normalizeRadius(String(radius))

  if (safeZip.length !== 5) {
    clearNearMeSearch(storage)
    return false
  }

  try {
    storage.setItem(
      NEAR_ME_SEARCH_STORAGE_KEY,
      JSON.stringify({ zip: safeZip, radius: safeRadius }),
    )
    return true
  } catch {
    return false
  }
}

export function readNearMeSearch(storage: Storage): StoredNearMeSearch | null {
  try {
    const raw = storage.getItem(NEAR_ME_SEARCH_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StoredNearMeSearch>
    const zip = normalizeZip(parsed.zip)
    const radius = Number(parsed.radius)

    if (
      zip.length !== 5 ||
      !SEARCH_RADII.includes(radius as SearchRadius)
    ) {
      clearNearMeSearch(storage)
      return null
    }

    return { zip, radius }
  } catch {
    clearNearMeSearch(storage)
    return null
  }
}

export function clearNearMeSearch(storage: Storage) {
  try {
    storage.removeItem(NEAR_ME_SEARCH_STORAGE_KEY)
  } catch {
    // Storage access can be denied; search UI must remain usable.
  }
}
