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
    title: 'Trenchless sewer repair vs excavation',
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
    title: 'CIPP lining vs pipe bursting',
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

const RELATED_GUIDES: Record<string, string[]> = {
  'sewer-line-repair-cost': [
    'sewer-line-repair-vs-replacement',
    'trenchless-vs-excavation',
    'insurance-and-sewer-backup',
  ],
  'sewer-line-repair-vs-replacement': [
    'sewer-line-repair-cost',
    'pipe-lining-vs-pipe-bursting',
    'sewer-camera-inspection-explained',
  ],
  'trenchless-vs-excavation': [
    'pipe-lining-vs-pipe-bursting',
    'sewer-line-repair-vs-replacement',
    'sewer-line-repair-cost',
  ],
  'questions-to-ask-sewer-contractor': [
    'sewer-line-repair-process',
    'who-is-responsible-for-sewer-lateral',
    'sewer-line-permits-and-right-of-way',
  ],
  'sewer-line-repair-process': [
    'sewer-camera-inspection-explained',
    'sewer-line-permits-and-right-of-way',
    'questions-to-ask-sewer-contractor',
  ],
  'pipe-lining-vs-pipe-bursting': [
    'trenchless-vs-excavation',
    'sewer-line-repair-vs-replacement',
    'sewer-line-repair-cost',
  ],
  'sewer-line-permits-and-right-of-way': [
    'who-is-responsible-for-sewer-lateral',
    'sewer-line-repair-process',
    'questions-to-ask-sewer-contractor',
  ],
  'sewer-camera-inspection-explained': [
    'sewer-line-repair-process',
    'sewer-line-repair-vs-replacement',
    'questions-to-ask-sewer-contractor',
  ],
  'who-is-responsible-for-sewer-lateral': [
    'sewer-line-permits-and-right-of-way',
    'insurance-and-sewer-backup',
    'questions-to-ask-sewer-contractor',
  ],
  'insurance-and-sewer-backup': [
    'sewer-line-repair-cost',
    'who-is-responsible-for-sewer-lateral',
    'questions-to-ask-sewer-contractor',
  ],
}

const RELATED_DIRECTORY: Record<string, { href: string; label: string }[]> = {
  'sewer-line-repair-cost': [
    { href: '/contractors/near-me', label: 'Sewer line repair near me' },
    { href: '/contractors', label: 'Sewer line repair by state' },
  ],
  'sewer-line-repair-vs-replacement': [
    { href: '/contractors/tags/pipe-bursting', label: 'Pipe bursting contractors' },
    { href: '/contractors/tags/open-cut', label: 'Open-cut excavation contractors' },
  ],
  'trenchless-vs-excavation': [
    { href: '/contractors/tags/trenchless', label: 'Trenchless sewer contractors' },
    { href: '/contractors/tags/open-cut', label: 'Open-cut excavation contractors' },
  ],
  'pipe-lining-vs-pipe-bursting': [
    { href: '/contractors/tags/cipp', label: 'CIPP lining contractors' },
    { href: '/contractors/tags/pipe-bursting', label: 'Pipe bursting contractors' },
  ],
  'questions-to-ask-sewer-contractor': [
    { href: '/contractors/near-me', label: 'Sewer line repair near me' },
  ],
  'sewer-line-repair-process': [
    { href: '/contractors', label: 'Browse contractors by state' },
  ],
  'sewer-camera-inspection-explained': [
    { href: '/contractors/near-me', label: 'Find contractors near me' },
  ],
  'sewer-line-permits-and-right-of-way': [
    { href: '/contractors', label: 'Sewer line repair by state' },
  ],
  'who-is-responsible-for-sewer-lateral': [
    { href: '/contractors', label: 'Sewer line repair by state' },
  ],
  'insurance-and-sewer-backup': [
    { href: '/contractors/tags/emergency-backup', label: 'Sewer backup emergency contractors' },
  ],
}

export function relatedGuides(slug: string): GuideMeta[] {
  return (RELATED_GUIDES[slug] ?? [])
    .map((item) => getGuide(item))
    .filter((guide): guide is GuideMeta => Boolean(guide))
}

export function relatedDirectoryLinks(
  slug: string,
): { href: string; label: string }[] {
  return RELATED_DIRECTORY[slug] ?? []
}
