import { ContactForm } from '@/components/ContactForm'
import { BreadcrumbListJsonLd, BreadcrumbNav } from '@/components/Breadcrumbs'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Contact the directory',
  description: `Send a contractor correction, listing suggestion, buyer question, or update request for ${SITE.name}.`,
  path: '/contact',
})

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact' },
]

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
      <BreadcrumbListJsonLd items={CRUMBS} />
      <BreadcrumbNav items={CRUMBS} />

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
