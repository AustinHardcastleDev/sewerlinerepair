import { GuideLayout } from '@/components/GuideLayout'
import { pageMetadata } from '@/lib/seo'
import type { FAQItem } from '@/components/FAQ'
import {
  GUIDE_AUTHOR,
  GUIDE_REVIEWED_LABEL,
  type GuideSource,
} from '@/lib/guide-provenance'

export const metadata = pageMetadata({
  title: 'Insurance and sewer backup',
  description:
    'Do not assume a homeowners policy pays for sewer backup or the lateral itself. Read the current declarations and endorsements.',
  path: '/guides/insurance-and-sewer-backup',
  type: 'article',
})

const FAQS: FAQItem[] = [
  {
    q: 'Does standard homeowners cover sewer backup?',
    a: 'Often not without a backup endorsement or similar rider. Policies differ. Verify yours.',
  },
  {
    q: 'Is service-line coverage the same thing?',
    a: 'No. Service-line riders, backup endorsements, flood policies, and municipal responsibility answer different losses.',
  },
  {
    q: 'Can this guide tell me what I will be paid?',
    a: 'No. Coverage amounts, exclusions, and waiting periods come from your current policy and insurer. A blog summary is not your declarations page.',
  },
]

const SOURCES: GuideSource[] = [
  { label: 'FEMA: flood insurance context', href: 'https://www.fema.gov/flood-insurance' },
]

export default function Page() {
  return (
    <GuideLayout
      eyebrow="Insurance"
      title="Insurance and sewer backup"
      lead="Do not assume a homeowners policy pays for sewer backup or the lateral itself. Read the current declarations and endorsements."
      faqs={FAQS}
      slug="insurance-and-sewer-backup"
      sources={SOURCES}
    >
      <h2>Distinguish the products</h2>
      <p>
        Backup endorsements, service-line coverage, flood insurance, and
        maintenance exclusions are different. A blog summary is not your policy.
        Interior backup damage, the buried lateral, and a flood event can all
        look similar on a wet floor and fall under different paper.
      </p>
      <p>
        Manufacturer material warranties and contractor labor warranties are also
        different from insurance. One may cover a liner. Another may cover
        workmanship. Neither replaces a backup endorsement unless your policy
        says so.
      </p>

      <h2>What to do after a backup</h2>
      <p>
        Document damage, call your insurer or agent, and keep the camera file.
        Do not treat contractor marketing as coverage advice. If a municipal
        lateral program exists in your city, that is a third path, with its own
        eligibility rules and deadlines.
      </p>
      <p>
        Restoration of landscaping, driveways, and interiors should be scoped in
        the repair contract even when you hope insurance will contribute. Get
        the repair scope in writing first, then let the insurer respond to that
        scope.
      </p>

      <h2>What this guide will not claim</h2>
      <p>
        No coverage amount, no typical reimbursement, and no promise that a
        given failure is or is not excluded. Read the current declarations with
        your agent or state insurance department resources.
      </p>

      <h2>Checklist</h2>
      <ul>
        <li>Current policy declarations reviewed with agent</li>
        <li>Backup endorsement and service-line rider checked separately</li>
        <li>Camera file and photos retained</li>
        <li>No coverage amount claimed from this guide</li>
      </ul>
      <p>
        {GUIDE_REVIEWED_LABEL} · Author: {GUIDE_AUTHOR.name}. Built from the
        project research briefs; city-specific fees and coverage amounts must be
        verified against current primary sources before you spend.
      </p>
    </GuideLayout>
  )
}
