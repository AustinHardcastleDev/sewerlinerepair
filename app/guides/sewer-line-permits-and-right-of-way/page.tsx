import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Sewer line permits and right-of-way',
  description:
    'Private-yard work and public right-of-way work follow different rules. Confirm who pulls the permit before the first shovel or pit.',
  path: '/guides/sewer-line-permits-and-right-of-way',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Who usually pulls the permit?',
    a: 'Often the licensed contractor named on the job, but some cities require the property owner as applicant. Ask in writing.',
  },
  {
    q: 'What changes in the right-of-way?',
    a: 'Traffic control, restoration standards, bond/fee schedules, and inspection timing can all change once work enters street or sidewalk.',
  },
  {
    q: 'Does a statewide plumbing code mean statewide permits?',
    a: 'No. Most states adopt IPC or UPC with local amendments. Permits and inspections stay local even under a statewide code.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'ICC: International Plumbing Code overview', href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/' },
  { label: 'IAPMO: Uniform Plumbing Code', href: 'https://www.iapmo.org/' },
  { label: 'Call 811', href: 'https://call811.com/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Codes"
      title="Sewer line permits and right-of-way"
      lead="Private-yard work and public right-of-way work follow different rules. Confirm who pulls the permit before the first shovel or pit."
      faqs={FAQS}
      slug="sewer-line-permits-and-right-of-way"
      sources={SOURCES}
    >
      <h2>Private property vs right-of-way</h2>
      <p>
        A cleanout in the yard is not the same jurisdiction as a tie-in under
        the street. Do not apply one city’s property-line rule nationwide. Work
        in a street, sidewalk, easement, or alley can need a separate municipal
        approval on top of the plumbing permit.
      </p>
      <p>
        Lateral ownership ordinances are often municipal, not statewide. The
        permit applicant, the inspection hold points, and the restoration
        standard can all change at the curb even when the same contractor is
        doing the work.
      </p>

      <h2>Inspection reality</h2>
      <p>
        Some cities want to see bedding or joints before backfill. Restoration
        that starts too early can force rework. Put the inspection sequence in
        the contract so nobody is guessing on the day of the pour.
      </p>
      <p>
        Contractor licensing may be plumbing contractor, specialty sewer, or
        excavator depending on the state. Confirm the license class matches the
        work, especially if the job crosses from private yard into public
        right-of-way.
      </p>

      <h2>811 and private locates</h2>
      <p>
        Call 811 marks public utilities. Private lateral locating is a separate
        contractor responsibility unless the local program says otherwise. Both
        belong on the pre-work checklist.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Permit number and applicant name on the contract</li>
        <li>Right-of-way fees and restoration standards itemized when applicable</li>
        <li>Inspection hold points written down before digging</li>
        <li>811 ticket plus private-locate plan</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
