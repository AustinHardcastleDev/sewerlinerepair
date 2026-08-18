'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './Button'

export function ZipSearchForm({
  title = 'Search contractors by ZIP',
  body = 'Enter a ZIP and get a distance-sorted list from our researched contractor coordinates nationwide.',
  compact = false,
  defaultRadius = 50,
}: {
  title?: string
  body?: string
  compact?: boolean
  defaultRadius?: number
}) {
  const router = useRouter()
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState(String(defaultRadius))

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = zip.replace(/\D/g, '').slice(0, 5)
    if (cleaned.length !== 5) return
    router.push(
      `/contractors/near-me?zip=${cleaned}&radius=${encodeURIComponent(radius)}#near-me-map`,
    )
  }

  return (
    <div
      className={
        compact
          ? 'rounded-card border border-[var(--color-border)] bg-[var(--color-panel)] p-5 sm:p-6'
          : 'rounded-card border border-[var(--color-ink)] bg-[var(--color-page)] p-6 sm:p-8'
      }
    >
      <h2 className={compact ? 't-heading' : 't-section'}>{title}</h2>
      <p className="t-body-sm mt-2 max-w-2xl">{body}</p>
      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="block min-w-0 flex-1">
          <span className="meta">ZIP code</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="37203"
            className="mt-2 w-full rounded-btn border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 text-[16px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
          />
        </label>
        <label className="block w-full sm:w-36">
          <span className="meta">Radius</span>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="mt-2 w-full rounded-btn border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 text-[16px] text-[var(--color-ink)]"
          >
            {[25, 50, 75, 100].map((r) => (
              <option key={r} value={r}>
                {r} miles
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" className="sm:mb-0">
          Search
        </Button>
      </form>
    </div>
  )
}
