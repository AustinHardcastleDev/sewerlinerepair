import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Who is responsible for the sewer lateral?',
  description:
    'Homeowner responsibility usually covers the private lateral to a city-defined point, but that point is local, not national.',
  path: '/guides/who-is-responsible-for-sewer-lateral',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Is the city always responsible past the property line?',
    a: 'No. Some cities stop at the main, the curb, the cleanout, or another marked point. Treat every city page as local only.',
  },
  {
    q: 'What about shared laterals?',
    a: 'Multifamily or older shared lines can split responsibility among owners. Get the recorded arrangement before authorizing work.',
  },
  {
    q: 'Can a municipal program pay part of the bill?',
    a: 'Some cities run lateral assistance or reimbursement programs. Those rules, amounts, and deadlines come from the current city page, not from a national guide.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'EPA: septic systems and sewer basics', href: 'https://www.epa.gov/septic' },
  { label: 'EPA wastewater resources', href: 'https://www.epa.gov/' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Ownership"
      title="Who is responsible for the sewer lateral?"
      lead="Homeowner responsibility usually covers the private lateral to a city-defined point, but that point is local, not national."
      faqs={FAQS}
      slug="who-is-responsible-for-sewer-lateral"
      sources={SOURCES}
    >
      <h2>Use local primary sources</h2>
      <p>
        A residential sewer lateral is the private pipe that carries wastewater
        from the building to the public sewer or a septic system. Ownership of
        that pipe, and of the connection point, varies by jurisdiction.
      </p>
      <p>
        Read your city’s utility or public-works page for the current boundary.
        Examples from Nashville, Austin, or Los Angeles are examples, not
        statewide rules. Do not copy a neighbor city’s curb rule onto your lot.
      </p>

      <h2>Why it changes the bid</h2>
      <p>
        Ownership decides who pays, who permits, and whether municipal programs
        apply. A break on the house side of the cleanout is a different invoice
        from a break under the street, even when the same crew is standing in
        your yard.
      </p>
      <p>
        Shared laterals, alley connections, and older combined systems add
        another layer. If more than one building sits on the line, pause until
        you know who must sign and who must pay.
      </p>

      <h2>Septic vs public sewer</h2>
      <p>
        If the house drains to a septic tank, the “city main” question does not
        apply in the same way. Tank, distribution, and drainfield work is a
        different product from structural sewer-lateral repair. Confirm which
        system you have before you compare contractors.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>City utility page saved with retrieval date</li>
        <li>Cleanout location confirmed on site</li>
        <li>Shared-line or easement documents checked when relevant</li>
        <li>Permit applicant named before work starts</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
