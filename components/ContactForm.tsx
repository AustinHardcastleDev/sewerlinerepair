'use client'

import { FormEvent, useState } from 'react'
import { Button } from './Button'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm({
  topic = 'General question',
  intro = 'Send the details and we will route it to the right place.',
  includeCompany = false,
  includeListingUrl = false,
  buttonLabel = 'Send message',
}: {
  topic?: string
  intro?: string
  includeCompany?: boolean
  includeListingUrl?: boolean
  buttonLabel?: string
}) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError('')
    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Something went wrong. Please try again.')
      }
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-0 rounded-card border border-[var(--color-border)] bg-[var(--color-panel)] p-5 sm:p-7"
    >
      <input type="hidden" name="topic" value={topic} />
      <label className="hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <span className="eyebrow">Contact form</span>
      <h2 className="t-heading mt-3">{topic}</h2>
      <p className="t-body-sm mt-3">{intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        {includeCompany ? <Field label="Company" name="company" /> : null}
        {includeListingUrl ? (
          <Field label="Listing or website URL" name="listingUrl" />
        ) : null}
      </div>
      <label className="mt-4 block">
        <span className="meta">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-btn border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 text-[16px] text-[var(--color-ink)]"
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : buttonLabel}
        </Button>
        {status === 'sent' ? (
          <span className="text-[14px] font-semibold text-[var(--color-ink)]">
            Sent. We will follow up if a reply is needed.
          </span>
        ) : null}
        {status === 'error' ? (
          <span className="text-[14px] text-red-700">{error}</span>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block min-w-0">
      <span className="meta">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-btn border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 text-[16px] text-[var(--color-ink)]"
      />
    </label>
  )
}
