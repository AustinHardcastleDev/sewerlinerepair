import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { SITE, SITE_URL, NAV, HEADER_NAV, LIST_BASE } from '@/lib/site'
import { OG_IMAGE } from '@/lib/seo'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
  other: {
    'ahrefs-site-verification':
      '0cb1693e4567a41fefb6db906b7846dfa7bd9b967bc9f5573be3a6c2c2e7de2f',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="ltlRZNpHY795dPY+Li4YPg"
          async
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b-[3px] border-[var(--color-accent)] bg-[var(--color-band)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 flex-col gap-1.5">
          <span className="break-words text-[25px] font-extrabold leading-none tracking-[-0.035em] text-white">
            SewerLineRepair
            <span className="text-[var(--color-accent)]">List</span>
          </span>
          <span className="meta text-[var(--color-band-muted)]">
            {SITE.tagline}
          </span>
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium sm:w-auto sm:justify-end sm:gap-x-5 md:gap-x-7 md:text-[15px]">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--color-band-body)] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="band-dark mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-10">
        <div>
          <div className="text-[22px] font-extrabold leading-none tracking-[-0.035em] text-white">
            SewerLineRepair
            <span className="text-[var(--color-accent)]">List</span>
          </div>
          <p className="mt-4 max-w-sm text-[16px] leading-[1.65] text-[var(--color-band-body)]">
            We check contractor websites for real sewer line repair work,
            then sort the list so buyers can start with a cleaner place to
            call. Independent research across 50 states.
          </p>
        </div>
        <div>
          <div className="eyebrow-bare text-[var(--color-band-muted)]">The list</div>
          <ul className="mt-4 space-y-2 text-[16px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[var(--color-band-body)] transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow-bare text-[var(--color-band-muted)]">Research</div>
          <ul className="mt-4 space-y-2 text-[16px]">
            <li>
              <Link
                href="/guides"
                className="text-[var(--color-band-body)] transition-colors hover:text-white"
              >
                All buyer guides
              </Link>
            </li>
            <li>
              <Link
                href="/guides/sewer-line-repair-cost"
                className="text-[var(--color-band-body)] transition-colors hover:text-white"
              >
                Repair cost guide
              </Link>
            </li>
            <li>
              <Link
                href={`${LIST_BASE}/near-me`}
                className="text-[var(--color-band-body)] transition-colors hover:text-white"
              >
                Contractors near me
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow-bare text-[var(--color-band-muted)]">Reach us</div>
          <p className="mt-4 text-[16px] leading-[1.65] text-[var(--color-band-body)]">
            Contractor with a correction? Buyer with a question? Send it over.
          </p>
          <Link className="link mt-3 inline-block text-[16px]" href="/contact">
            Open the contact form
          </Link>
          <Link className="link mt-2 block text-[16px]" href="/privacy">
            Privacy disclosure
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t px-4 sm:px-6 lg:px-10 band-hairline">
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 text-[14px] text-[var(--color-band-muted)]">
          <div>© {new Date().getFullYear()} {SITE.name}. Independent research.</div>
          <div className="meta max-w-full break-words text-[var(--color-band-muted)]">
            Website signal · Buyer-first research
          </div>
        </div>
      </div>
    </footer>
  )
}
