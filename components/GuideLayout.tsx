import Link from 'next/link'
import { BreadcrumbListJsonLd, BreadcrumbNav } from './Breadcrumbs'
import { FAQ, type FAQItem } from './FAQ'
import { ButtonLink } from './Button'
import { relatedDirectoryLinks, relatedGuides } from '@/lib/guides'
import { LIST_BASE } from '@/lib/site'
import {
  DEFAULT_GUIDE_SOURCES,
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  guideArticleJsonLd,
  type GuideSource,
} from '@/lib/guide-provenance'
import type { ReactNode } from 'react'

export function GuideLayout({
  eyebrow,
  title,
  lead,
  children,
  faqs,
  slug,
  sources = DEFAULT_GUIDE_SOURCES,
}: {
  eyebrow: string
  title: string
  lead: string
  children: ReactNode
  faqs: FAQItem[]
  slug: string
  sources?: GuideSource[]
}) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: title, href: `/guides/${slug}` },
  ]

  const articleLd = guideArticleJsonLd({
    title,
    description: lead,
    slug,
    sources,
  })
  const moreGuides = relatedGuides(slug)
  const directoryLinks = relatedDirectoryLinks(slug)

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <BreadcrumbListJsonLd items={crumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <BreadcrumbNav items={crumbs} />
      <span className="eyebrow mt-8">{eyebrow}</span>
      <h1 className="t-display mt-4">{title}</h1>
      <p className="meta mt-4">
        By{' '}
        <Link href={GUIDE_AUTHOR.url} className="link">
          {GUIDE_AUTHOR.name}
        </Link>
        <span className="mx-2 text-[var(--color-border)]">·</span>
        {GUIDE_REVIEWED_LABEL}
      </p>
      <p className="t-body mt-6 text-[19px]">{lead}</p>
      <div className="prose-content mt-10">{children}</div>

      <aside className="mt-12 rounded-card border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <h2 className="t-heading text-[22px]">Sources</h2>
        <p className="t-body-sm mt-2">
          Figures and code references in this guide come from the sources below.
          Confirm local labor rates, AHJ rules, and current code or utility
          guidance before you hire.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-[var(--color-body)]">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {moreGuides.length > 0 || directoryLinks.length > 0 ? (
        <aside className="mt-12">
          <h2 className="t-heading text-[22px]">Keep reading</h2>
          <ul className="mt-4 space-y-2 text-[16px]">
            {moreGuides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className="link">
                  {guide.title}
                </Link>
              </li>
            ))}
            {directoryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="mt-12 rounded-card border border-[var(--color-ink)] bg-[var(--color-panel)] p-6">
        <h2 className="t-heading">Ready to find who to call?</h2>
        <p className="t-body-sm mt-2">
          Open your state page or search by ZIP for a distance-sorted list.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={LIST_BASE}>Browse by state</ButtonLink>
          <ButtonLink href={`${LIST_BASE}/near-me`} variant="secondary">
            Search near me
          </ButtonLink>
        </div>
      </div>
      <FAQ items={faqs} />
      <p className="mt-10 text-[14px] text-[var(--color-muted)]">
        <Link href="/guides" className="link">
          ← All buyer guides
        </Link>
      </p>
    </article>
  )
}
