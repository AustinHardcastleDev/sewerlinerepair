import { permanentRedirect } from 'next/navigation'

/** Retired financing article → insurance guide. */
export default function DeferredInterestRedirectPage() {
  permanentRedirect('/guides/insurance-and-sewer-backup')
}
