import Link from 'next/link'
import { SITE, SITE_URL } from '@/lib/site'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function BreadcrumbNav({
  items,
  className = 'meta meta-soft break-words',
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? (
              <span className="mx-2 text-[var(--color-border)]">/</span>
            ) : null}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[var(--color-ink)]">
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-[var(--color-ink)] normal-case' : undefined}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export function BreadcrumbListJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null

  const absolute = items.map((item, index) => {
    const isLast = index === items.length - 1
    const href = item.href
      ? item.href.startsWith('http')
        ? item.href
        : `${SITE_URL}${item.href}`
      : isLast
        ? undefined
        : undefined
    return {
      label: item.label,
      href,
      isLast,
    }
  })

  // Include the current page even when it has no href (schema item = page URL omitted, name only).
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: absolute.map((item, index) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
      }
      if (item.href) entry.item = item.href
      return entry
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
