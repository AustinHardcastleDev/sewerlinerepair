export const SITE = {
  name: 'SewerLineRepairList',
  domain: 'www.sewerlinerepairlist.com',
  url: 'https://www.sewerlinerepairlist.com',
  tagline: "Find someone who's done it before.",
  description:
    'A buyer-first directory of sewer line repair contractors across 50 states. Find contractors whose websites show residential lateral, trenchless, or excavation repair work.',
}

/** Base path for the directory. */
export const LIST_BASE = '/contractors'

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
export const SITE_URL = configuredUrl || SITE.url

export const NAV = [
  { href: '/', label: 'Home' },
  { href: LIST_BASE, label: 'States' },
  { href: `${LIST_BASE}/near-me`, label: 'Near Me' },
  { href: '/guides/sewer-line-repair-cost', label: 'Cost guide' },
  { href: '/about', label: 'About' },
  { href: '/for-contractors', label: 'For Contractors' },
]

/** Top nav omits States and For Contractors so the bar stays one line on mobile. */
export const HEADER_NAV = NAV.filter(
  (item) => item.href !== LIST_BASE && item.href !== '/for-contractors',
)
