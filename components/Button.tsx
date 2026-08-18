import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

function classesFor(variant: ButtonVariant, className?: string): string {
  return `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className || ''}`.trim()
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}) {
  return (
    <button className={classesFor(variant, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
  external = false,
}: {
  href: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
  external?: boolean
}) {
  if (external) {
    return (
      <a
        href={href}
        className={classesFor(variant, className)}
        rel="nofollow noopener"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classesFor(variant, className)}>
      {children}
    </Link>
  )
}
