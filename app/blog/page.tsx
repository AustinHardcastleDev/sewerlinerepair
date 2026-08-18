import { permanentRedirect } from 'next/navigation'

/** Empty blog retired until real articles exist. */
export default function BlogRedirectPage() {
  permanentRedirect('/guides')
}
