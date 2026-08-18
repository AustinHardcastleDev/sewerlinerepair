import type { ReactNode } from 'react'

type ContainerWidth = 'default' | 'narrow' | 'tight'

const WIDTHS: Record<ContainerWidth, string> = {
  default: 'max-w-6xl px-4 sm:px-6 lg:px-10',
  narrow: 'max-w-4xl px-4 sm:px-6 lg:px-10',
  tight: 'max-w-2xl px-4 sm:px-6',
}

export function Container({
  children,
  width = 'default',
  className = '',
}: {
  children: ReactNode
  width?: ContainerWidth
  className?: string
}) {
  return (
    <div className={`mx-auto ${WIDTHS[width]} ${className}`.trim()}>{children}</div>
  )
}

export function Eyebrow({
  children,
  tone = 'chip',
  className = '',
}: {
  children: ReactNode
  tone?: 'chip' | 'bare'
  className?: string
}) {
  return (
    <span className={`${tone === 'chip' ? 'eyebrow' : 'eyebrow-bare'} ${className}`.trim()}>
      {children}
    </span>
  )
}

/**
 * Section anatomy: yellow eyebrow chip, hairline rule, heavy heading,
 * optional subtitle. Matches the sibling site's section rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  meta,
  as: Heading = 'h2',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div>
      {eyebrow || meta ? (
        <div className="flex flex-wrap items-center gap-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <div className="rule hidden min-w-8 flex-1 sm:block" />
          {meta ? <span className="meta">{meta}</span> : null}
        </div>
      ) : null}
      <Heading className={`${Heading === 'h1' ? 't-display' : 't-section'} mt-4`}>
        {title}
      </Heading>
      {subtitle ? (
        <p className="t-body mt-4 max-w-2xl">{subtitle}</p>
      ) : null}
    </div>
  )
}
