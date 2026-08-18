import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Sewer camera inspection explained',
  description:
    'A useful camera visit produces a recording, distance marks, and a plain-language defect map, not just a verbal “needs replacement.”',
  path: '/guides/sewer-camera-inspection-explained',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Is a camera the same as a repair quote?',
    a: 'No. Diagnosis informs method selection; it does not automatically select lining, bursting, or open-cut.',
  },
  {
    q: 'What should I keep?',
    a: 'Your own copy of the recording and a written distance-to-defect note from a known cleanout or clean reference point.',
  },
  {
    q: 'Can I reuse one camera file with other bidders?',
    a: 'Yes, and you should. Bring the same file to every bidder so method arguments share one evidence base.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'EPA: septic systems and sewer basics', href: 'https://www.epa.gov/septic' },
  { label: 'NASSCO assessment programs', href: 'https://www.nassco.org/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Diagnostics"
      title="Sewer camera inspection explained"
      lead="A useful camera visit produces a recording, distance marks, and a plain-language defect map, not just a verbal “needs replacement.”"
      faqs={FAQS}
      slug="sewer-camera-inspection-explained"
      sources={SOURCES}
    >
      <h2>What good footage shows</h2>
      <p>
        Material, joints, roots, cracks, bellies, offsets, and the relationship
        to cleanouts and the foundation. A verbal “it is shot” is not a defect
        map. Distance marks from a documented reference let the next bidder
        argue about the same pipe.
      </p>
      <p>
        Camera inspection documents visible interior conditions. It does not
        replace locating, ownership research, or permit review. A belly that
        holds water, a collapsed section, and a root-invaded joint can look
        similar on a rushed walkthrough and very different on a marked file.
      </p>

      <h2>How to use it</h2>
      <p>
        Bring the same file to every bidder so method arguments share one
        evidence base. If a contractor will not work from your recording, ask
        why. A second camera can be reasonable when access changed or the first
        file is unreadable. It should not be a way to restart the sales pitch.
      </p>
      <p>
        Ask for a written list of defects with distances, a note on host-pipe
        material, and whether the operator reached the main or stopped short.
        Incomplete footage is still useful, but it should be labeled incomplete.
      </p>

      <h2>Diagnosis is not the method</h2>
      <p>
        Footage can support lining, bursting, spot repair, or open-cut. It does
        not pick one by itself. Drain cleaning and hydro jetting can make the
        camera possible. They are not structural repair.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Recording file in your possession</li>
        <li>Defect distances from a documented reference</li>
        <li>Note on whether the camera reached the main</li>
        <li>Host-pipe material and visible defect types</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
