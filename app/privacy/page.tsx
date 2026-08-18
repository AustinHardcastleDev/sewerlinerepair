import Link from 'next/link'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Privacy Disclosure',
  description: `How ${SITE.name} handles contact form submissions and site analytics.`,
  path: '/privacy',
})

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Privacy', href: '/privacy' },
]

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbListJsonLd items={CRUMBS} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
        <BreadcrumbNav items={CRUMBS} />
        <span className="eyebrow mt-8">Privacy disclosure</span>
        <h1 className="t-display mt-4">
          What this site collects, and what it does not.
        </h1>
        <p className="t-body mt-6 text-[19px]">
          {SITE.name} is an independent research directory. This page
          describes how contact submissions and basic site analytics work today.
        </p>

        <div className="prose-content mt-10">
          <h2>Contact form</h2>
          <p>
            When you submit the contact form, we receive the fields you enter
            (name, email, message, and optional company or listing URL). That
            information is used to respond to corrections, listing requests, and
            buyer questions. Do not send sensitive financial or account
            credentials through the form.
          </p>

          <h2>Analytics</h2>
          <p>
            We may use privacy-focused analytics to understand aggregate
            traffic: pages viewed, referrers, and general device categories. We
            do not sell personal data from the directory or contact form to
            third-party lead buyers.
          </p>

          <h2>Third-party links</h2>
          <p>
            Contractor websites and utility pages linked from this site have their
            own privacy policies. We do not control what those sites collect when
            you leave {SITE.name}.
          </p>

          <h2>Questions</h2>
          <p>
            Privacy question or correction request? Use the{' '}
            <Link href="/contact">contact form</Link> and we will route it.
          </p>
        </div>
      </article>
    </>
  )
}
