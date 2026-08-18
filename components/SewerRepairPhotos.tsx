import Image from 'next/image'

/** Hero visual for the homepage. Uses committed public asset path. */
export function HeroSewerPhoto() {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)]">
      <Image
        src="/images/sewer/lateral-repair-hero.jpg"
        alt="Crew assessing a residential sewer lateral repair beside a home foundation"
        width={1600}
        height={1200}
        priority
        sizes="(max-width: 768px) 100vw, 45vw"
        className="aspect-[4/3] h-full w-full object-cover"
      />
    </figure>
  )
}
