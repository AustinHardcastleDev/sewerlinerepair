import Link from 'next/link'
import {
  DIRECTORY_TAGS,
  getTopStateLinksForTag,
  nationalTagQualifies,
  stateTagQualifies,
  type DirectoryTag,
} from '@/lib/directory-tags'
import { LIST_BASE } from '@/lib/site'

export function DirectoryTagCrossLinks({
  tag,
  stateSlug,
  stateName,
}: {
  tag: DirectoryTag
  stateSlug?: string
  stateName?: string
}) {
  const stateLinks = getTopStateLinksForTag(tag)
  const otherTags = DIRECTORY_TAGS.filter((item) => {
    if (item.id === tag.id) return false
    if (stateSlug) return stateTagQualifies(stateSlug, item)
    return nationalTagQualifies(item)
  })
  const otherIntent = otherTags.filter((item) => item.kind === 'intent')
  const otherBrand = otherTags.filter((item) => item.kind === 'brand')

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
      {stateSlug && stateName ? (
        <p className="t-body-sm">
          Viewing {tag.shortLabel} in {stateName}.{' '}
          <Link href={`${LIST_BASE}/tags/${tag.slug}`} className="link">
            See the national {tag.shortLabel} list
          </Link>
          {' · '}
          <Link href={`${LIST_BASE}/${stateSlug}`} className="link">
            All {stateName} contractors
          </Link>
        </p>
      ) : null}

      {stateLinks.length > 0 ? (
        <div className={stateSlug ? 'mt-8' : ''}>
          <h2 className="t-heading text-[20px]">
            {tag.shortLabel} by state
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {stateLinks.map((entry) => (
              <Link
                key={entry.stateSlug}
                href={`${LIST_BASE}/${entry.stateSlug}/tags/${tag.slug}`}
                className="rounded-btn border border-[var(--color-border)] px-3 py-1.5 text-[14px] font-semibold"
              >
                {entry.stateAbbr}{' '}
                <span className="tabular text-[var(--color-muted)]">
                  {entry.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {otherIntent.length > 0 ? (
        <div className="mt-8">
          <h2 className="t-heading text-[20px]">Emergency services</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherIntent.map((item) => (
              <Link
                key={item.slug}
                href={
                  stateSlug
                    ? `${LIST_BASE}/${stateSlug}/tags/${item.slug}`
                    : `${LIST_BASE}/tags/${item.slug}`
                }
                className="rounded-btn border border-[var(--color-border)] px-3 py-1.5 text-[14px] font-semibold"
              >
                {item.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {otherBrand.length > 0 ? (
        <div className="mt-8">
          <h2 className="t-heading text-[20px]">Method filters</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherBrand.map((item) => (
              <Link
                key={item.slug}
                href={
                  stateSlug
                    ? `${LIST_BASE}/${stateSlug}/tags/${item.slug}`
                    : `${LIST_BASE}/tags/${item.slug}`
                }
                className="rounded-btn border border-[var(--color-border)] px-3 py-1.5 text-[14px] font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
