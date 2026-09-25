import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Trenchless Sewer Repair vs Excavation',
  description:
    'Trenchless sewer repair fits when the host pipe cooperates. Open-cut excavation is the honest answer for collapses, grade changes, and bad access.',
  path: '/guides/trenchless-vs-excavation',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Is trenchless always less disruptive?',
    a: 'It usually reduces surface damage, but pits, cleanout work, and restoration still exist. Collapsed sections may still require digging.',
  },
  {
    q: 'Can every lateral be lined?',
    a: 'No. Severe collapse, major offsets, abandoned fittings, or incompatible diameters can block lining or bursting.',
  },
  {
    q: 'What should I ask before I approve trenchless?',
    a: 'Where the pits go, what conditions force a switch to excavation, whether a post-install camera is included, and who pays if the method cannot finish.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'ICC: International Plumbing Code overview', href: 'https://www.iccsafe.org/products-and-services/i-codes/2018-i-codes/ipc/' },
  { label: 'NASTT: trenchless resources', href: 'https://nastt.org/' },
  { label: 'Call 811', href: 'https://call811.com/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Methods"
      title="Trenchless sewer repair vs excavation"
      lead="Trenchless sewer repair fits when the host pipe cooperates. Open-cut is the honest answer for collapses, grade changes, and bad access."
      faqs={FAQS}
      slug="trenchless-vs-excavation"
      sources={SOURCES}
    >
      <h2>What trenchless is good at</h2>
      <p>
        CIPP lining and pipe bursting can renew a run with limited yard damage
        when the host pipe and access points cooperate. That is the honest
        promise: less surface disruption when geometry, cleanouts, and pipe
        condition allow it.
      </p>
      <p>
        Marketing that says “no digging ever” overreaches. Most trenchless jobs
        still need access pits, cleanout work, or a small excavation at the
        connection. Compare restoration scopes, not slogans.
      </p>

      <h2>What excavation still owns</h2>
      <p>
        Open-cut remains the honest answer for many collapses, complex fittings,
        unknown utility conflicts, or when the city requires exposed joints for
        inspection. It is also the path when you need a diameter or grade change
        that lining cannot deliver.
      </p>
      <p>
        Adjacent utilities, groundwater, depth, and easement limits can force
        digging even when a liner would otherwise fit. Call 811 marks public
        utilities. Private lateral locating is a separate scope unless your city
        program says otherwise.
      </p>

      <h2>Decision rule</h2>
      <p>
        Ask which defects the proposed method cannot see or cannot fix. If the
        answer is vague, keep digging options on the table. A contractor who
        can explain the fallback is more useful than one who only sells one
        method.
      </p>
      <p>
        Host-pipe integrity, bends, fittings, diameter changes, depth,
        groundwater, cleanout access, and restoration cost all belong in that
        conversation. CIPP and bursting each have different geometric limits.
        Treat them as two tools, not as one “trenchless” product.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Confirm cleanout access and pit locations</li>
        <li>Ask what conditions would force a switch to excavation mid-job</li>
        <li>Compare restoration scopes, not only pipe unit prices</li>
        <li>Require a post-install camera or test before final payment</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
