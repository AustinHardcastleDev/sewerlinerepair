/**
 * Design tokens mirrored in TypeScript for the places CSS variables can't
 * reach: Leaflet marker options, canvas/OG image drawing, inline SVG.
 * Source of truth for the values is app/globals.css.
 */

export const COLORS = {
  page: '#FFFFFF',
  panel: '#F7F6F2',
  sponsorSurface: '#FFFCF2',

  ink: '#131210',
  body: '#514D45',
  muted: '#78736A',
  faint: '#A8A296',

  border: '#DCD9CF',
  panelBorder: '#E4E1D7',

  accent: '#FFC61A',
  accentInk: '#17140B',

  band: '#131210',
  bandHairline: '#33302A',
  bandBody: '#ADA89C',
  bandMuted: '#8B877C',
} as const

export const RADII = {
  chip: 2,
  button: 3,
  card: 4,
} as const

/** Tile-layer tint. Applied via CSS to .gil-map .leaflet-tile-pane. */
export const MAP_TILE_FILTER = 'grayscale(0.88) contrast(0.92) brightness(1.06)'

export type PinCategory = 'sponsored' | 'dedicated' | 'repeated' | 'signal'

type PinSpec = {
  /** Rendered diameter in px. Non-sponsored pins scale with review count. */
  color: string
  label: string
  minSize: number
  maxSize: number
  /** Keeps sponsored pins above the rest of the marker pane. */
  zIndexOffset: number
}

/**
 * Yellow = sponsored only. Signal tiers read as ink → muted → faint.
 */
export const PIN_SPECS: Record<PinCategory, PinSpec> = {
  sponsored: {
    color: COLORS.accent,
    label: 'Featured',
    minSize: 16,
    maxSize: 16,
    zIndexOffset: 1000,
  },
  dedicated: {
    color: COLORS.ink,
    label: 'Dedicated sewer page',
    minSize: 11,
    maxSize: 14,
    zIndexOffset: 0,
  },
  repeated: {
    color: COLORS.muted,
    label: 'Repeated signal',
    minSize: 9,
    maxSize: 12,
    zIndexOffset: 0,
  },
  signal: {
    color: COLORS.faint,
    label: 'Signal found',
    minSize: 7,
    maxSize: 10,
    zIndexOffset: 0,
  },
}

/** Legend order: sponsored first, then the signal tiers. */
export const PIN_LEGEND_ORDER: PinCategory[] = [
  'sponsored',
  'dedicated',
  'repeated',
  'signal',
]
