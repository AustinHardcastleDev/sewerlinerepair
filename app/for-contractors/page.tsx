import { ContactForm } from '@/components/ContactForm'
import { TOTAL_INSTALLERS, TOTAL_STATES } from '@/lib/contractors'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'For Sewer Contractors',
  description: `Correct a listing, understand how ${SITE.name} works, and how to request removal.`,
  path: '/for-contractors',
})

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'For Contractors', href: '/for-contractors' },
]

export default function ForContractorsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <BreadcrumbListJsonLd items={CRUMBS} />
      <BreadcrumbNav items={CRUMBS} />

      <span className="eyebrow mt-8">A note to contractors</span>
      <h1 className="t-display mt-4">
        Correct an entry. Improve your signal. Ask to be removed.
      </h1>

      <p className="t-body mt-6 text-[19px]">
        If you&apos;re listed here, it&apos;s because your website showed residential sewer
        repair signal when we checked it. You can fix the entry, strengthen
        the public signal, or ask us to remove it.
      </p>

      <div className="prose-content mt-10">
        <h2>How the list works</h2>
        <p>
          {SITE.name} is a buyer-first directory of{' '}
          {TOTAL_INSTALLERS.toLocaleString()} contractors across {TOTAL_STATES}{' '}
          states, sorted by real website signal, not marketing claims.
        </p>
        <ol>
          <li>
            We search for sewer contractors state by state and dedupe by place
            ID.
          </li>
          <li>
            We crawl each contractor&apos;s own website for sewer line
            signal: dedicated sewer pages, repeated mentions, service scope.
          </li>
          <li>
            We assign a confidence tier and write a short listing so buyers can
            scan before they click through.
          </li>
        </ol>
        <p>
          A listing is not an endorsement. It is a better place to start for
          buyers who would otherwise begin from a blank search. Featured rows
          are labeled when they appear.
        </p>

        <h2>Get added</h2>
        <p>
          Missing from the list? Send the URL of the page on your site that shows
          sewer line installation work. We will check the signal and add
          you if it fits the directory standard.
        </p>

        <h2>Correct your entry</h2>
        <p>
          Phone number changed? Service area shifted? Wrong city? Send the
          correction with your listing URL or Google Maps link so we match the
          right profile.
        </p>

        <h2>Improve your signal</h2>
        <p>
          The list sorts by website signal. A dedicated sewer line page,
          clear scope (install and service), photos, and process content help
          buyers, and may improve your tier on the next research pass.
        </p>

        <h2>Get removed</h2>
        <p>
          Don&apos;t want to be listed? Send a removal request with your listing
          URL. We take it down within a few business days.
        </p>
      </div>

      <div className="mt-12">
        <ContactForm
          topic="Contractor listing update"
          intro="Send a correction, addition request, removal request, or stronger sewer page for review."
          includeCompany
          includeListingUrl
          buttonLabel="Send contractor update"
        />
      </div>
    </article>
  )
}
