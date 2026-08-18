'use client'

import { useEffect, useMemo, useRef } from 'react'
import type {
  LayerGroup as LeafletLayerGroup,
  Map as LeafletMap,
  LatLngBounds as LeafletLatLngBounds,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SewerConfidence } from '@/lib/contractor-model'
import { pinCategory } from '@/lib/contractor-model'
import { COLORS, PIN_SPECS, type PinCategory } from '@/lib/tokens'

export type LeafletMarker = {
  id: string
  name: string
  href: string
  city?: string
  stateAbbr: string
  lat: number
  lng: number
  primaryLane?: string
  confidence?: SewerConfidence
  sponsored?: boolean
  reviewsCount: number | null
  sewerReviewCount?: number | null
  totalScore?: number | null
  distanceMiles?: number
}

export type LeafletCenter = {
  lat: number
  lng: number
  label?: string
}

type Props = {
  markers: LeafletMarker[]
  center?: LeafletCenter
  radiusMiles?: number
  title: string
  emptyText: string
}

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export function LeafletContractorMap({
  markers,
  center,
  radiusMiles,
  title,
  emptyText,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null)
  const layerRef = useRef<LeafletLayerGroup | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const stableMarkers = useMemo(() => markers, [markers])

  useEffect(() => {
    if (!hostRef.current || mapRef.current || stableMarkers.length === 0) return

    let cancelled = false

    async function setupMap() {
      const L = await import('leaflet')
      if (!hostRef.current || cancelled) return

      const map = L.map(hostRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      })

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 18,
      }).addTo(map)

      mapRef.current = map
      drawLayer(L)
    }

    setupMap()

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [stableMarkers.length])

  useEffect(() => {
    let cancelled = false

    async function updateLayer() {
      if (!mapRef.current || stableMarkers.length === 0) return
      const L = await import('leaflet')
      if (cancelled) return
      drawLayer(L)
    }

    updateLayer()

    return () => {
      cancelled = true
    }
  }, [stableMarkers, center, radiusMiles])

  function drawLayer(L: typeof import('leaflet')) {
    const map = mapRef.current
    if (!map || stableMarkers.length === 0) return

    layerRef.current?.remove()

    const layer = L.layerGroup().addTo(map)
    const bounds = L.latLngBounds([]) as LeafletLatLngBounds

    if (center) {
      L.marker([center.lat, center.lng], {
        icon: L.divIcon({
          className: 'gil-map-center',
          html: '<span></span>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .bindPopup(`<strong>${escapeHtml(center.label || 'Search point')}</strong>`)
        .addTo(layer)
      bounds.extend([center.lat, center.lng])

      if (radiusMiles) {
        L.circle([center.lat, center.lng], {
          radius: radiusMiles * 1609.344,
          color: COLORS.ink,
          fillColor: COLORS.ink,
          fillOpacity: 0.04,
          opacity: 0.4,
          weight: 2,
        }).addTo(layer)
      }
    }

    for (const marker of stableMarkers) {
      const category = pinCategory({ sponsored: marker.sponsored, confidence: marker.confidence || "medium" })
      const size = markerSize(category, marker.reviewsCount || 0)

      L.marker([marker.lat, marker.lng], {
        icon: L.divIcon({
          className: `gil-pin gil-pin-${category}`,
          html: pinHtml(category, size),
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
        zIndexOffset: PIN_SPECS[category].zIndexOffset,
        keyboard: false,
      })
        .bindPopup(popupHtml(marker, category))
        .addTo(layer)

      bounds.extend([marker.lat, marker.lng])
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: radiusMiles ? 9 : 7 })
    }

    layerRef.current = layer
  }

  if (markers.length === 0) {
    return (
      <div className="grid min-h-[360px] place-items-center px-6 text-center text-[16px] text-[var(--color-body)]">
        {emptyText}
      </div>
    )
  }

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={title}
      className="gil-map relative isolate z-0 h-[360px] w-full bg-[var(--color-panel)] md:h-[520px]"
    />
  )
}

/** Sponsored pins are fixed. Other tiers scale within PIN_SPECS min/max. */
function markerSize(category: PinCategory, reviewsCount: number): number {
  const spec = PIN_SPECS[category]
  if (category === 'sponsored') return spec.minSize
  if (reviewsCount >= 100) return spec.maxSize
  if (reviewsCount >= 25) {
    return Math.round((spec.minSize + spec.maxSize) / 2)
  }
  return spec.minSize
}

function pinHtml(category: PinCategory, size: number): string {
  if (category === 'sponsored') return '<span></span>'
  return `<span style="width:${size}px;height:${size}px;background:${PIN_SPECS[category].color}"></span>`
}

function popupHtml(marker: LeafletMarker, category: PinCategory): string {
  const location = marker.city
    ? `${escapeHtml(marker.city)}, ${escapeHtml(marker.stateAbbr)}`
    : escapeHtml(marker.stateAbbr)
  const sewerN = marker.sewerReviewCount || 0
  const sewerLine =
    sewerN > 0
      ? `<div>${sewerN.toLocaleString()} sewer review${sewerN === 1 ? '' : 's'}</div>`
      : ''
  const distance =
    typeof marker.distanceMiles === 'number'
      ? `<div class="gil-map-popup-distance">${Math.round(marker.distanceMiles)} miles away</div>`
      : ''
  const sponsored =
    category === 'sponsored'
      ? '<div class="gil-map-popup-sponsored">Featured</div>'
      : ''

  return `
    <div class="gil-map-popup">
      ${sponsored}
      <a href="${escapeHtml(marker.href)}">${escapeHtml(marker.name)}</a>
      <div>${location}</div>
      ${sewerLine}
      ${distance}
    </div>
  `
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
