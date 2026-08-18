import { getStateEditorial } from '@/lib/state-editorial'

export function StateEditorial({ stateSlug }: { stateSlug: string }) {
  const editorial = getStateEditorial(stateSlug)
  if (!editorial) return null

  const repairContext =
    editorial.homeRepairContext?.trim() || editorial.costContext?.trim() || ''

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-12 lg:px-10">
      <div className="panel p-5 sm:p-6 md:p-8">
        <span className="eyebrow">State market notes</span>
        <div className="mt-6 space-y-6">
          <EditorialBlock
            title="Contractor landscape"
            body={editorial.marketOverview}
          />
          {repairContext ? (
            <EditorialBlock
              title="Housing and repair context"
              body={repairContext}
            />
          ) : null}
          <EditorialBlock title="Before you call" body={editorial.buyerNote} />
        </div>
        {editorial.verifiedAsOf ? (
          <p className="meta meta-soft mt-6">
            State notes grounded in the documented sewer research record and
            verified as of {editorial.verifiedAsOf}. Not legal advice. Confirm
            lateral ownership, permits, and licensing with your local authority.
          </p>
        ) : null}
      </div>
    </section>
  )
}

function EditorialBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0">
      <h2 className="t-heading">{title}</h2>
      <p className="t-body-sm mt-2 max-w-3xl">{body}</p>
    </div>
  )
}
