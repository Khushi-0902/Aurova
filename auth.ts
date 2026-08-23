import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'
import { AUTH_OTP_PENDING_COOKIE } from '@/lib/auth-otp-cookie'
import { verifyOtpChallenge } from '@/lib/otp-token'
import { readGoogleOAuthEnv } from '@/lib/google-oauth-env'

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

/**
 * Prefer explicit IDs when present so both Auth.js names (`AUTH_GOOGLE_*`) and
 * common alternates (`GOOGLE_CLIENT_*`) work on any host. Otherwise `Google({})`
 * lets setEnvDefaults fill from `AUTH_GOOGLE_*` only.
 */
const { clientId: googleClientId, clientSecret: googleClientSecret } = readGoogleOAuthEnv()
const googleProvider =
  googleClientId && googleClientSecret
    ? Google({ clientId: googleClientId, clientSecret: googleClientSecret })
    : Google({})

const providers: NextAuthConfig['providers'] = [googleProvider, emailOtpProvider]

export const authConfig = {
  trustHost: true,
  /** Helps trace OAuth issues in the terminal during `npm run dev`. */
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  /**
   * Always log auth failures to stdout/stderr so they show in the terminal
   * (`npm run dev`) or host logs (Vercel → Deployment → Logs).
   */
  logger: {
    error(error) {
      const e = error as Error & { type?: string; cause?: unknown }
      console.error('[auth][error]', e.type ?? e.name, e.message, e.cause ?? e.stack)
    },
    warn(code) {
      console.warn('[auth][warn]', code)
    },
    debug(code, ...metadata: unknown[]) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[auth][debug]', code, ...metadata)
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; sub?: string; email?: string | null; name?: string | null }
        token.sub = u.id ?? u.sub ?? (u.email ? String(u.email) : undefined)
        if (u.email) token.email = u.email
        if (u.name) token.name = u.name
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
