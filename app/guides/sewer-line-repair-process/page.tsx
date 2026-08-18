import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Sewer line repair process',
  description:
    'Most timelines are set by camera locating, permits, and restoration, not by how fast a crew can open a trench.',
  path: '/guides/sewer-line-repair-process',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'What usually happens first?',
    a: 'A service call to relieve the backup, then a camera locate to map the defect before structural repair.',
  },
  {
    q: 'What slows jobs down?',
    a: 'Permit windows, utility locates, material lead times, weather, and inspection sequencing after the pipe work.',
  },
  {
    q: 'Is there a typical number of days?',
    a: 'No useful national figure. Permit lead times, right-of-way windows, and restoration standards vary by city. Ask your contractor for the local sequence, in writing.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'ICC: International Plumbing Code overview', href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/' },
  { label: 'Call 811', href: 'https://call811.com/' },
  { label: 'OSHA: excavation safety', href: 'https://www.osha.gov/excavations' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Process"
      title="Sewer line repair process"
      lead="Most timelines are set by camera locating, permits, and restoration, not by how fast a crew can open a trench."
      faqs={FAQS}
      slug="sewer-line-repair-process"
      sources={SOURCES}
    >
      <h2>Typical sequence</h2>
      <p>
        Relieve backup, then camera and locate, then method selection, then
        permits and utility locate, then repair or replacement, then inspection,
        then restoration, then warranty handoff. Emergency mitigation can sit in
        front of that sequence without locking the structural method.
      </p>
      <p>
        Skipping the locate to “save a day” usually costs a week later, when
        the crew hits a surprise fitting, a second break, or a city inspector
        who wanted to see the joint before backfill.
      </p>

      <h2>Where homeowners lose time</h2>
      <p>
        Approving a method without a defect map, or assuming the same crew that
        cleared the line automatically owns permits and restoration. Write those
        responsibilities down before work starts.
      </p>
      <p>
        Public utility marking through 811 is not the same as locating your
        private lateral. Weather, material lead times, and right-of-way windows
        also sit outside the crew’s digging speed. Ask which of those are on
        the critical path for your street.
      </p>

      <h2>Inspection and closeout</h2>
      <p>
        Some cities want to see bedding or joints before backfill. Post-repair
        camera or testing may be required before sign-off. Restoration that
        starts too early can force rework, which is why inspection timing belongs
        in the contract.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Agree on who schedules inspections</li>
        <li>Confirm restoration starts only after pass/fail inspection rules are clear</li>
        <li>Keep the pre- and post-repair camera files</li>
        <li>Confirm who calls 811 and who locates private utilities</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
