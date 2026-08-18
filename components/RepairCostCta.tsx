import Link from 'next/link'
import { ButtonLink } from './Button'

export function RepairCostCta({
  title = 'Separate diagnosis, method, and restoration before you compare bids.',
  body = 'National averages hide the real cost stack. Use the cost and insurance guides to frame questions before deposits land.',
  linkLabel = 'Read sewer line repair cost →',
}: {
  title?: string
  body?: string
  linkLabel?: string
}) {
  return (
    <aside className="band-dark rounded-card px-6 py-8 sm:px-8">
      <span className="eyebrow-bare text-[var(--color-band-muted)]">Cost & coverage</span>
      <h2 className="mt-3 text-[26px] font-extrabold leading-[1.1] tracking-[-0.035em] text-white sm:text-[30px]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-[var(--color-band-body)]">
        {body}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/guides/sewer-line-repair-cost" variant="primary">
          {linkLabel}
        </ButtonLink>
        <ButtonLink href="/guides/insurance-and-sewer-backup" variant="secondary">
          Insurance & sewer backup →
        </ButtonLink>
      </div>
      <p className="mt-4 text-[13px] text-[var(--color-band-muted)]">
        Or browse{' '}
        <Link href="/guides" className="link">
          all buyer guides
        </Link>
        .
      </p>
    </aside>
  )
}
