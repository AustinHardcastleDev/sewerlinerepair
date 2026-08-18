'use client'

import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ContractorDotMap } from './ContractorDotMap'
import { FilteredContractors } from './FilteredContractors'
import type { ContractorListItem, ContractorMapItem } from '@/lib/contractor-model'

type Payload = {
  zip: string
  radius: number
  center: { lat: number; lng: number; label: string } | null
  list: ContractorListItem[]
  map: ContractorMapItem[]
  error?: string
}

export function NearMeResults({ payload }: { payload: Payload | null }) {
  const params = useSearchParams()
  const zip = params.get('zip') || ''

  const empty = useMemo(() => {
    if (!zip) return 'Enter a ZIP above to search the national directory.'
    if (!payload) return 'Looking up that ZIP…'
    if (payload.error) return payload.error
    if (payload.list.length === 0) {
      return `No researched listings within ${payload.radius} miles of ${payload.zip}. Try a wider radius or open your state list.`
    }
    return null
  }, [zip, payload])

  useEffect(() => {
    if (!zip) return
    const target =
      document.getElementById('near-me-map') ||
      document.getElementById('near-me-results')
    if (!target) return
    // Wait a tick so the map section is in the layout before scrolling.
    const id = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => window.clearTimeout(id)
  }, [zip, payload?.zip, payload?.list.length])

  if (!zip) {
    return (
      <p className="mt-8 text-[16px] text-[var(--color-muted)]">{empty}</p>
    )
  }

  if (!payload || payload.error || payload.list.length === 0) {
    return (
      <p id="near-me-results" className="mt-8 text-[16px] text-[var(--color-body)]">
        {empty}
      </p>
    )
  }

  return (
    <div id="near-me-results" className="mt-10 space-y-10">
      <div>
        <h2 className="t-section">
          {payload.list.length.toLocaleString()} contractors within{' '}
          {payload.radius} miles of {payload.zip}
        </h2>
        <p className="t-body-sm mt-2">
          Sorted by featured placement, then distance, then sewer-specific
          review count.
        </p>
      </div>
      {payload.center ? (
        <div id="near-me-map" className="scroll-mt-28">
          <ContractorDotMap
            contractors={payload.map}
            title={`Near ${payload.zip}`}
            center={payload.center}
            radiusMiles={payload.radius}
          />
        </div>
      ) : null}
      <FilteredContractors
        contractors={payload.list}
        title={`Within ${payload.radius} miles`}
        eyebrow="Near-me list"
      />
    </div>
  )
}
