import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Questions to ask a sewer contractor',
  description:
    'A first call should clarify ownership, diagnosis, method choices, permits, restoration, and warranty, not just a same-day price.',
  path: '/guides/questions-to-ask-sewer-contractor',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'What is the most important first question?',
    a: 'Who owns the section that failed (homeowner lateral, shared line, or municipal main), and how will that be confirmed?',
  },
  {
    q: 'Should I hire the first crew that clears the backup?',
    a: 'Clearing and structural repair can be different companies. Keep the camera file and get a written repair scope before authorizing major work.',
  },
  {
    q: 'What red flags show up on a first call?',
    a: 'A same-day replacement price with no camera file, a refusal to name the method, or a contract that leaves restoration and permits as “to be determined.”',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'EPA: septic systems and sewer basics', href: 'https://www.epa.gov/septic' },
  { label: 'Call 811', href: 'https://call811.com/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Hiring"
      title="Questions to ask a sewer contractor"
      lead="A first call should clarify ownership, diagnosis, method choices, permits, restoration, and warranty, not just a same-day price."
      faqs={FAQS}
      slug="questions-to-ask-sewer-contractor"
      sources={SOURCES}
    >
      <h2>Ownership and access</h2>
      <p>
        Ask where the property-line, cleanout, or main-connection boundary is
        for your city, and who opens public right-of-way if needed. That answer
        decides who pays and who pulls the permit.
      </p>
      <p>
        Shared laterals on older lots and multifamily buildings can split
        responsibility. If more than one house sits on the line, get the
        recorded arrangement before you authorize a full replacement.
      </p>

      <h2>Evidence and method</h2>
      <p>
        Request the recording, a defect map, and at least one alternative method
        with reasons it was rejected. A contractor who only sells lining, or
        only sells digging, still needs to explain why the other path fails
        here.
      </p>
      <p>
        Drain cleaning, camera work, and structural repair are not the same
        product. Confirm which one you are buying today, and whether the same
        company will do the follow-on work.
      </p>

      <h2>Money and risk</h2>
      <p>
        Confirm permit puller, inspection timing, restoration limits,
        change-order triggers, and what voids the warranty. Ask for the legal
        entity on the contract and proof of license and insurance for that
        entity, not a trade name on a truck.
      </p>
      <p>
        Directory inclusion here means website signal of sewer work. It is not a
        license verification or an endorsement. Those checks are still yours.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>License and insurance proof for the legal entity on the contract</li>
        <li>Camera file retained by you</li>
        <li>Itemized bid with method and restoration boundaries</li>
        <li>Written warranty and exclusions</li>
        <li>Who calls 811 and who locates the private lateral</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
