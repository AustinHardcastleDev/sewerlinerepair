import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'CIPP Lining vs Pipe Bursting',
  description:
    'CIPP pipe lining renews the host from inside. Pipe bursting replaces the sewer line by breaking the old pipe outward. They are not interchangeable.',
  path: '/guides/pipe-lining-vs-pipe-bursting',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Which is better?',
    a: 'Neither universally. Lining preserves the existing path; bursting installs a new pipe and needs a pull path plus room for pits.',
  },
  {
    q: 'Can lining fix a collapse?',
    a: 'Severe collapses often need excavation or bursting. A liner cannot span every void.',
  },
  {
    q: 'Does lining restore original capacity?',
    a: 'Not in every case. A liner occupies some interior space. If capacity or grade is the problem, bursting or open-cut may be the better fit.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'ICC: International Plumbing Code overview', href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/' },
  { label: 'NASTT: trenchless resources', href: 'https://nastt.org/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Trenchless"
      title="CIPP lining vs pipe bursting"
      lead="CIPP lining renews the host from inside. Pipe bursting replaces the run by breaking the old pipe outward. They are not interchangeable."
      faqs={FAQS}
      slug="pipe-lining-vs-pipe-bursting"
      sources={SOURCES}
    >
      <h2>CIPP lining</h2>
      <p>
        Cured-in-place pipe inserts a resin-saturated liner that is cured inside
        the existing host. It is strongest when the host is continuous enough to
        accept that cure and when cleanouts exist. Ask about laterals, wrinkling
        risk, and post-cure camera proof.
      </p>
      <p>
        Lining keeps the existing path. That is useful when the route is right
        and the defects are the kind a liner can span. It is the wrong tool when
        the host is collapsed, badly offset, or missing sections, or when you
        need a larger diameter.
      </p>

      <h2>Pipe bursting</h2>
      <p>
        Bursting pulls a new pipe while fracturing the old one outward. It is
        strongest when you want a new pipe, possibly a larger one, and soil
        conditions allow displacement. Ask about nearby utilities, pit
        locations, and fusion or joint details.
      </p>
      <p>
        Bursting needs a continuous pull path and clearance. Tight easements,
        adjacent gas or water lines, and certain fittings can block it. When
        bursting cannot finish, the fallback is usually excavation. Get that
        fallback in writing.
      </p>

      <h2>How to choose between them</h2>
      <p>
        Start with the defect map, host material, and whether you need more
        capacity. Then compare access pits, restoration, and what happens if the
        chosen method stops mid-run. Do not treat “trenchless” as one product.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Post-install camera included</li>
        <li>Written fallback if lining or bursting cannot complete</li>
        <li>Pit locations and restoration boundaries on the bid</li>
        <li>Confirmation of diameter and grade goals</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
