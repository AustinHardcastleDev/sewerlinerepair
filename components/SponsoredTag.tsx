/** Labels a featured listing placement. */
export function FeaturedTag({ className = '' }: { className?: string }) {
  return (
    <span className={`tag-sponsored ${className}`.trim()}>Featured</span>
  )
}

/** @deprecated Use FeaturedTag. Kept as an alias for existing imports. */
export function SponsoredTag({ className = '' }: { className?: string }) {
  return <FeaturedTag className={className} />
}
