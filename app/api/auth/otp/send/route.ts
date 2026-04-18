import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { AUTH_OTP_PENDING_COOKIE } from '@/lib/auth-otp-cookie'
import { signOtpChallenge } from '@/lib/otp-token'
import { sendSignInOtpEmail } from '@/lib/send-otp-email'

const bodySchema = z.object({
  email: z.string().email().max(320),
  name: z.string().trim().min(1, 'Name is required').max(120),
})

function randomSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const email = parsed.data.email.trim().toLowerCase()
    const name = parsed.data.name.trim()
    const code = randomSixDigitCode()
    const token = await signOtpChallenge({ email, name, otp: code })

    const jar = await cookies()
    jar.set(AUTH_OTP_PENDING_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    })

    await sendSignInOtpEmail(email, code, name)

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to send code'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
