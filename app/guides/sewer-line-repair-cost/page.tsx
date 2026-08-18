import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Sewer line repair cost',
  description:
    'A useful quote starts with diagnosis and access, not a national average. Separate pipe work from restoration, permits, and right-of-way fees before you compare bids.',
  path: '/guides/sewer-line-repair-cost',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Why shouldn’t I trust a single national average?',
    a: 'Published averages blend unrelated jobs: spot repairs, full replacements, trenchless lining, and open-cut work under different access conditions. Use them only as a reminder that scope drives price.',
  },
  {
    q: 'What line items should every quote separate?',
    a: 'Ask for camera/locate, pipe method and length, cleanouts, excavation or trenchless access, surface restoration, permits/fees, and contingency for surprises found after opening the line.',
  },
  {
    q: 'Can trenchless cost less than digging?',
    a: 'Sometimes, especially when landscaping or hardscape restoration would dominate an open-cut job. Collapsed pipe, missing cleanouts, or diameter changes can make excavation the cheaper honest path.',
  },
  {
    q: 'Do emergency backups cost more?',
    a: 'After-hours response, temporary clearing, and structural repair are different scopes. Paying for a clear-and-camera visit does not lock the repair method.',
  },
  {
    q: 'Should I pick the lowest bid?',
    a: 'Only after the bids cover the same length, method assumptions, restoration boundary, permit ownership, and warranty exclusions. A cheaper lump sum often dropped restoration or inspection.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'EPA: septic systems and sewer basics', href: 'https://www.epa.gov/septic' },
  { label: 'ICC: International Plumbing Code overview', href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/' },
  { label: 'NASTT: trenchless resources', href: 'https://nastt.org/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Cost"
      title="Sewer line repair cost"
      lead="A useful quote starts with diagnosis and access, not a national average. Separate pipe work from restoration, permits, and right-of-way fees before you compare bids."
      faqs={FAQS}
      slug="sewer-line-repair-cost"
      sources={SOURCES}
    >
      <h2>Start with the cost stack</h2>
      <p>
        Price moves with seven durable factors: diagnosis, access, method, pipe
        length, depth and diameter, restoration, permits, and right-of-way work.
        If a bid collapses those into one lump sum, you cannot compare it to
        another contractor.
      </p>
      <p>
        This site does not publish a national sticker price. Those figures mix
        emergency jetting, a ten-foot spot repair, and a full-yard replacement
        as if they were the same product. Your job is one of those things, not
        all of them.
      </p>

      <h2>Diagnosis before method</h2>
      <p>
        Camera footage and a locate explain where the defect sits relative to
        the cleanout, foundation, and property line. Footage alone does not
        prove that lining, bursting, or full replacement is required.
      </p>
      <p>
        A first visit that relieves a backup is a service call. The structural
        repair quote should come after you have a recording, distance marks, and
        a written defect map. If those are missing, you are pricing a guess.
      </p>

      <h2>Access and restoration</h2>
      <p>
        A short break under a lawn is a different job from the same break under
        a driveway, slab, or city sidewalk. Restoration standards, and who owns
        them, often rival the pipe work.
      </p>
      <p>
        Ask where pits or trenches will land, what gets put back, and whether
        landscaping, concrete, or asphalt is included or listed as an allowance.
        Street and sidewalk work can add municipal fees and finish standards
        that do not apply in a private yard.
      </p>

      <h2>How to compare bids</h2>
      <p>
        Normalize quotes to the same length, method assumptions, restoration
        boundaries, permit responsibility, and warranty exclusions. Reject bids
        that skip a written camera finding.
      </p>
      <p>
        If one contractor proposes lining and another proposes open-cut, that is
        not a price contest yet. It is two different scopes. Get the reason each
        method fits or fails on this pipe, then compare dollars inside one
        method, or compare two complete packages that include restoration.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Written camera/locate summary attached to the bid</li>
        <li>Method options with reasons each fits or fails</li>
        <li>Itemized restoration and permit ownership</li>
        <li>Warranty length, what voids it, and who performs follow-up</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
