import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Sewer line repair vs replacement',
  description:
    'Spot repair and full replacement answer different pipe conditions. Choose after a locate, not after a single backup event.',
  path: '/guides/sewer-line-repair-vs-replacement',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Does a backup mean I need a full replacement?',
    a: 'No. Backups can come from grease, roots, a localized break, or a grade problem. Camera evidence should drive the decision.',
  },
  {
    q: 'When is spot repair enough?',
    a: 'When the defect is localized, the surrounding pipe is sound, and access allows a durable repair without leaving known defects in place.',
  },
  {
    q: 'When does full replacement win?',
    a: 'Multiple defects, brittle host pipe, severe offset joints, or diameter/material changes that block trenchless options.',
  },
  {
    q: 'Is lining a repair or a replacement?',
    a: 'Lining renews the interior of an existing host. Bursting and open-cut install a new pipe. Ask which one you are buying, and what happens if the host cannot accept it.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'EPA: septic systems and sewer basics', href: 'https://www.epa.gov/septic' },
  { label: 'NASTT: trenchless resources', href: 'https://nastt.org/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Decision"
      title="Sewer line repair vs replacement"
      lead="Spot repair and full replacement answer different pipe conditions. Choose after a locate, not after a single backup event."
      faqs={FAQS}
      slug="sewer-line-repair-vs-replacement"
      sources={SOURCES}
    >
      <h2>Separate diagnosis from method</h2>
      <p>
        First establish what failed and where. Only then compare spot repair,
        sectional lining, full lining, bursting, or open-cut replacement. A
        backup is a symptom. The camera file is the evidence.
      </p>
      <p>
        Drain cleaning and root cutting can restore flow for a while without
        closing the opening that let roots in. If the joint or crack is still
        there, treat clearing as relief, not the structural answer.
      </p>

      <h2>Host-pipe condition matters</h2>
      <p>
        Lining needs a host that can accept the liner. Bursting needs a path and
        room for the new pipe. Neither erases every upstream defect
        automatically. Clay, cast iron, Orangeburg, PVC, and ABS fail in
        different ways, so material notes on the camera report are not trivia.
      </p>
      <p>
        A single offset under a lawn can be a candidate for a short excavation
        or a sectional repair. A run with repeated offsets, bellies, and
        brittle pipe is a different conversation. Ask what would be left in the
        ground if you only fix the worst spot.
      </p>

      <h2>Replacement is not always safer</h2>
      <p>
        Full replacement resets the run you dig or burst, but it also expands
        restoration, permit, and disruption cost. Match the method to the defect
        map. Replacing more pipe than the evidence supports is still a waste.
      </p>
      <p>
        Capacity is a separate question from leaks. If the line is undersized or
        the grade is wrong, lining the existing path may not solve backups.
        Bursting or open-cut can change diameter when the geometry allows.
        Confirm that need with the locate, not with a sales script.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Defect map with distances from cleanout or foundation</li>
        <li>Host-pipe material and condition notes</li>
        <li>Written reason spot repair would leave residual risk, or would not</li>
        <li>Fallback if lining or bursting cannot complete</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
