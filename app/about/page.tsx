import Link from 'next/link'
import { ContactForm } from '@/components/ContactForm'
import { ButtonLink } from '@/components/Button'
import { LIST_BASE, SITE } from '@/lib/site'
import { TOTAL_INSTALLERS, TOTAL_STATES } from '@/lib/contractors'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About this directory',
  description: `How ${SITE.name} checks contractor websites for sewer line signal and builds a buyer-first directory across 50 states.`,
  path: '/about',
})

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
]

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <BreadcrumbListJsonLd items={CRUMBS} />
      <BreadcrumbNav items={CRUMBS} />

      <span className="eyebrow mt-8">How the work gets done</span>
      <h1 className="t-display mt-4">We did the contractor research.</h1>

      <p className="t-body mt-6 text-[19px]">
        {SITE.name} is a working list of{' '}
        {TOTAL_INSTALLERS.toLocaleString()} residential sewer repair contractors
        across {TOTAL_STATES} states. It exists because the first question most
        buyers ask is also the messiest one: who is actually worth calling? We
        care whether the contractor has done this work before.
      </p>

      <div className="prose-content mt-10">
        <h2>Our standard</h2>
        <p>
          Every contractor on this list shows sewer line signal on their
          own website: a dedicated sewer page, repeated mentions, or clear
          repair-and-replacement scope. We do not treat a listing as an
          endorsement. We treat it as a better place to start.
        </p>
        <p>Contractors fall into confidence tiers sorted by signal strength:</p>
        <ul>
          <li>
            <strong>Explicit:</strong> dedicated sewer line page, the
            strongest signal we track.
          </li>
          <li>
            <strong>Strong:</strong> repeated sewer mentions across the site.
          </li>
          <li>
            <strong>Moderate:</strong> at least one clear mention, worth verifying
            on a first call.
          </li>
        </ul>

        <h2>The method</h2>
        <ol>
          <li>
            <strong>Statewide search.</strong> Multiple terms per state,
            covering sewer contractor, sewer line, whole-house
            sewer, and related labels. Different companies use different
            language.
          </li>
          <li>
            <strong>Dedupe by place ID.</strong> The same company appears under
            multiple searches. We collapse duplicates so the list stays usable.
          </li>
          <li>
            <strong>Website crawl.</strong> We follow internal pages and look for
            sewer signal where buyers would check: services, FAQs, galleries.
          </li>
          <li>
            <strong>Confidence scoring.</strong> Dedicated pages first. Repeated
            mentions next. Single mentions after that.
          </li>
          <li>
            <strong>Editorial review.</strong> We drop obvious mismatches and keep
            entries that give buyers a plausible next call.
          </li>
        </ol>

        <h2>Freshness</h2>
        <p>
          Website and review evidence for the national directory was last
          checked in <strong>August 2026</strong>. Profile copy may paraphrase
          public website language; credential claims such as licensed,
          certified, or manufacturer-authorized status are not independently verified
          here. Confirm them directly with the shop.
        </p>

        <h2>What we&apos;re not</h2>
        <p>
          We&apos;re not a marketplace, not a lead-gen funnel, and not a
          contractor verification program. We have not met most of the
          contractors on the list. Ask for references, verify licenses, and read
          contracts carefully. Good contractors expect those questions.
        </p>
        <h2>Buyer guides</h2>
        <p>
          The directory gives you a place to start. Our{' '}
          <Link href="/guides">buyer guides</Link> cover repair cost, trenchless
          vs open-cut, permits, and hiring, grounded in research, not vendor
          marketing. We lead with durable principles, and dated figures carry
          the year.
        </p>
      </div>

      <div className="mt-10">
        <ContactForm
          topic={`Question for ${SITE.name}`}
          intro="Flag an contractor, correct an entry, or ask a buyer question. Specific notes are easier to route."
          includeListingUrl
        />
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href={LIST_BASE}>Browse states</ButtonLink>
        <ButtonLink href="/guides" variant="secondary">
          Buyer guides
        </ButtonLink>
      </div>
    </article>
  )
}
