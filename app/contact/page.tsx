import Link from 'next/link'
import { ContactForm } from '@/components/ContactForm'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
  title: `Contact ${SITE.name}`,
  description: `Send a contractor correction, listing suggestion, buyer question, or update request for ${SITE.name}.`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <nav className="meta meta-soft mt-4 break-words">
        <Link href="/" className="hover:text-[var(--color-ink)]">
          Home
        </Link>
        <span className="mx-2 text-[var(--color-border)]">/</span>
        <span className="text-[var(--color-ink)]">Contact</span>
      </nav>

      <span className="eyebrow mt-8">Reach us</span>
      <h1 className="t-display mt-4">
        Send a correction, suggestion, or question.
      </h1>
      <p className="t-body mt-6 text-[19px]">
        Use the form for contractor updates, missing listings, buyer questions,
        or anything that should make the directory more useful. Specific
        beats vague.
      </p>

      <div className="mt-10">
        <ContactForm
          topic={`${SITE.name} contact`}
          intro="Tell us what needs attention. Contractor corrections are easiest when you include the listing URL or the contractor's website."
          includeCompany
          includeListingUrl
        />
      </div>
    </article>
  )
}
