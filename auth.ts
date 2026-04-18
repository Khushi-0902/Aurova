import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'
import { AUTH_OTP_PENDING_COOKIE } from '@/lib/auth-otp-cookie'
import { verifyOtpChallenge } from '@/lib/otp-token'

function timingSafeOtp(expected: string, actual: string): boolean {
  if (expected.length !== actual.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(actual, 'utf8'))
  } catch {
    return false
  }
}

const emailOtpProvider = Credentials({
  id: 'email-otp',
  name: 'Email',
  credentials: {
    email: { label: 'Email', type: 'email' },
    name: { label: 'Name', type: 'text' },
    otp: { label: 'Code', type: 'text' },
  },
  async authorize(credentials) {
    const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
    const name = (credentials?.name as string | undefined)?.trim()
    const otp = (credentials?.otp as string | undefined)?.replace(/\s/g, '') ?? ''
    if (!email || !name || !/^\d{6}$/.test(otp)) return null

    const jar = await cookies()
    const raw = jar.get(AUTH_OTP_PENDING_COOKIE)?.value
    if (!raw) return null

    let payload: { email: string; name: string; otp: string }
    try {
      payload = await verifyOtpChallenge(raw)
    } catch {
      return null
    }

    if (payload.email !== email) return null
    if (payload.name.trim() !== name) return null
    if (!timingSafeOtp(payload.otp, otp)) return null

    jar.delete(AUTH_OTP_PENDING_COOKIE)

    return {
      id: email,
      email,
      name: payload.name.trim(),
    }
  },
})

const googleId = process.env.AUTH_GOOGLE_ID?.trim()
const googleSecret = process.env.AUTH_GOOGLE_SECRET?.trim()

const providers: NextAuthConfig['providers'] =
  googleId && googleSecret
    ? [
        Google({
          clientId: googleId,
          clientSecret: googleSecret,
        }),
        emailOtpProvider,
      ]
    : [emailOtpProvider]

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/signin',
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? user.email ?? undefined
        if (user.email) token.email = user.email
        if (user.name) token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? session.user.email ?? ''
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
