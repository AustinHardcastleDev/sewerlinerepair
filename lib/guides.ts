export type GuideMeta = {
  slug: string
  title: string
  description: string
  eyebrow: string
  phase: 'P0' | 'P1' | 'P2'
  primaryKeyword: string
}

/** Canonical Task 11 guide set from the autonomous build playbook. */
export const GUIDES: GuideMeta[] = [
  {
    slug: 'sewer-line-repair-cost',
    title: 'Sewer line repair cost',
    description:
      'What residential lateral repair actually costs: diagnosis, access, method, length/depth, restoration, permits, and right-of-way factors without fabricated national quotes.',
    eyebrow: 'Cost',
    phase: 'P0',
    primaryKeyword: 'sewer line repair cost',
  },
  {
    slug: 'sewer-line-repair-vs-replacement',
    title: 'Sewer line repair vs replacement',
    description:
      'How to decide between spot repair and full replacement after a camera locate, without treating footage alone as proof of one method.',
    eyebrow: 'Decision',
    phase: 'P0',
    primaryKeyword: 'sewer line repair vs replacement',
  },
  {
    slug: 'trenchless-vs-excavation',
    title: 'Trenchless vs excavation',
    description:
      'When CIPP lining or pipe bursting fits, when open-cut is the honest answer, and why lining and bursting are not universal substitutes for excavation.',
    eyebrow: 'Methods',
    phase: 'P0',
    primaryKeyword: 'trenchless sewer repair vs excavation',
  },
  {
    slug: 'questions-to-ask-sewer-contractor',
    title: 'Questions to ask a sewer contractor',
    description:
      'A first-call checklist: lateral ownership, camera documentation, method options, permits, restoration, warranty path, and red flags from real complaints.',
    eyebrow: 'Hiring',
    phase: 'P0',
    primaryKeyword: 'questions to ask sewer contractor',
  },
  {
    slug: 'sewer-line-repair-process',
    title: 'Sewer line repair process',
    description:
      'What happens from the backup call to the final inspection, and why camera locates, city permits, and restoration usually set the clock.',
    eyebrow: 'Process',
    phase: 'P1',
    primaryKeyword: 'sewer line repair process',
  },
  {
    slug: 'pipe-lining-vs-pipe-bursting',
    title: 'Pipe lining vs pipe bursting',
    description:
      'How CIPP and bursting differ, when each fails, and what cleanouts, host-pipe condition, and access change.',
    eyebrow: 'Trenchless',
    phase: 'P1',
    primaryKeyword: 'cipp lining vs pipe bursting',
  },
  {
    slug: 'sewer-line-permits-and-right-of-way',
    title: 'Sewer line permits and right-of-way',
    description:
      'What most cities require before and after a lateral repair, who typically pulls the permit, and how right-of-way work changes ownership of the job.',
    eyebrow: 'Codes',
    phase: 'P1',
    primaryKeyword: 'sewer line repair permits',
  },
  {
    slug: 'sewer-camera-inspection-explained',
    title: 'Sewer camera inspection explained',
    description:
      'Why a locate matters, what a useful recording shows, and how diagnosis differs from method selection.',
    eyebrow: 'Diagnostics',
    phase: 'P2',
    primaryKeyword: 'sewer camera inspection explained',
  },
  {
    slug: 'who-is-responsible-for-sewer-lateral',
    title: 'Who is responsible for the sewer lateral?',
    description:
      'Where homeowner responsibility usually ends, how cities differ, and why one jurisdiction’s rule is never a national rule.',
    eyebrow: 'Ownership',
    phase: 'P2',
    primaryKeyword: 'who is responsible for sewer lateral',
  },
  {
    slug: 'insurance-and-sewer-backup',
    title: 'Insurance and sewer backup',
    description:
      'How sewer backup endorsements, service-line coverage, maintenance exclusions, and municipal responsibility differ, and why you must check your own policy.',
    eyebrow: 'Insurance',
    phase: 'P2',
    primaryKeyword: 'sewer backup insurance',
  },
]

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}
