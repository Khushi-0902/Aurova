/**
 * Sends a one-time sign-in code. Configure RESEND_API_KEY + RESEND_FROM for production.
 * Without Resend, logs the code on the server (local development only).
 */
export async function sendSignInOtpEmail(to: string, code: string, name: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  // Falls back to Resend's shared sandbox sender, which works without verifying
  // a domain. Note: the sandbox sender can ONLY deliver to the email address
  // that owns your Resend account. For real users, verify your own domain at
  // https://resend.com/domains and set RESEND_FROM (e.g. "Aurova <noreply@aurovaliving.in>").
  const from = process.env.RESEND_FROM || 'Aurova <onboarding@resend.dev>'

  const subject = 'Your Aurova sign-in code'
  const html = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your one-time sign-in code is:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:6px;font-family:ui-monospace,monospace">${escapeHtml(code)}</p>
    <p>This code expires in 10 minutes. If you didn&apos;t request it, you can ignore this email.</p>
  `

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Aurova auth] OTP for ${to}: ${code} (RESEND_API_KEY not set)`)
    } else {
      console.error('[Aurova auth] RESEND_API_KEY missing; cannot send OTP in production')
      throw new Error('Email delivery is not configured')
    }
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 403 && text.includes('domain is not verified')) {
      throw new Error(
        'Email domain not verified in Resend. Verify your sending domain at https://resend.com/domains and set RESEND_FROM to an address on it (e.g. "Aurova <noreply@aurovaliving.in>"), or unset RESEND_FROM to use the Resend sandbox sender for testing.',
      )
    }
    throw new Error(`Failed to send email: ${text}`)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
