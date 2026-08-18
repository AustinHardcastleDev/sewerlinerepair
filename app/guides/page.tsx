import Link from 'next/link'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { ButtonLink } from '@/components/Button'
import { GUIDES } from '@/lib/guides'
import { LIST_BASE } from '@/lib/site'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Sewer Line Repair Buyer Guides',
  description:
    'Practical sewer line guides: repair cost, trenchless vs open-cut, permits, contractors, and insurance. Grounded in research, not vendor marketing.',
  path: '/guides',
})

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/guides' },
]

export default function GuidesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
      <BreadcrumbListJsonLd items={CRUMBS} />
      <BreadcrumbNav items={CRUMBS} />
      <span className="eyebrow mt-8">Buyer guides</span>
      <h1 className="t-display mt-4">
        Practical next steps before you call a contractor.
      </h1>
      <p className="t-body mt-6 max-w-3xl text-[19px]">
        The directory gives you a place to start. These guides help you use it
        well: understand what a finished repair actually costs, when trenchless
        methods fit, what permits require, and the questions worth asking on a
        first call.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block min-w-0 rounded-card border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition-colors hover:border-[var(--color-ink)] sm:p-6"
          >
            <span className="meta">{guide.eyebrow}</span>
            <h2 className="t-heading mt-2">
              {guide.title}
            </h2>
            <p className="t-body-sm mt-3">{guide.description}</p>
            <div className="mt-5 text-[15px] font-semibold text-[var(--color-ink)]">
              Read guide →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-card border border-[var(--color-ink)] bg-[var(--color-panel)] p-6 sm:p-8">
        <h2 className="t-heading">Ready to find who to call?</h2>
        <p className="t-body-sm mt-3 max-w-2xl">
          Open your state page or search by ZIP for a distance-sorted list.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={LIST_BASE}>Browse by state</ButtonLink>
          <ButtonLink href={`${LIST_BASE}/near-me`} variant="secondary">
            Search near me
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
