import { NextResponse } from 'next/server'
import { SITE } from '@/lib/site'

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'austin@hometeamtechnology.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL

type ContactPayload = {
  topic?: string
  name?: string
  email?: string
  message?: string
  company?: string
  listingUrl?: string
  website?: string
}

function clean(value: unknown) {
  return String(value || '').trim().slice(0, 2000)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  let payload: ContactPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  if (clean(payload.website)) {
    return NextResponse.json({ ok: true })
  }

  const topic = clean(payload.topic) || 'General question'
  const name = clean(payload.name)
  const email = clean(payload.email)
  const company = clean(payload.company)
  const listingUrl = clean(payload.listingUrl)
  const message = clean(payload.message)

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Please add your name, email, and message.' },
      { status: 400 },
    )
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: 'Please use a valid email address.' },
      { status: 400 },
    )
  }

  if (!process.env.RESEND_API_KEY || !FROM_EMAIL) {
    return NextResponse.json(
      {
        error:
          'Email delivery is not configured yet. Add RESEND_API_KEY and CONTACT_FROM_EMAIL before using this form in production.',
      },
      { status: 503 },
    )
  }

  const subject = `[${SITE.name}] ${topic}`
  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 16px;">${escapeHtml(topic)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
      ${listingUrl ? `<p><strong>Listing URL:</strong> ${escapeHtml(listingUrl)}</p>` : ''}
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="white-space: pre-line;">${escapeHtml(message)}</p>
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject,
      html,
    }),
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: 'The message could not be sent. Please try again.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
