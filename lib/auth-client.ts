/**
 * Lightweight Auth.js / NextAuth client (fetch-only).
 * Avoids importing `next-auth/react` so bundlers resolve fewer entrypoints.
 */

export type AuthSessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type AuthSession = {
  user: AuthSessionUser
  expires: string
}

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const res = await fetch('/api/auth/session', { credentials: 'include' })
  if (!res.ok) return null
  const data = (await res.json()) as AuthSession | Record<string, never>
  if (!data || !('user' in data) || !data.user) return null
  return data as AuthSession
}

export async function getCsrfToken(): Promise<string> {
  const res = await fetch('/api/auth/csrf', { credentials: 'include' })
  const data = (await res.json()) as { csrfToken?: string }
  return data.csrfToken ?? ''
}

type SignInOptions = {
  callbackUrl?: string
  redirect?: boolean
} & Record<string, string | undefined>

/**
 * Mirrors Auth.js client `signIn` for credentials + OAuth starters.
 */
export async function signIn(
  providerId: string,
  options?: SignInOptions,
): Promise<{ ok: boolean; error?: string; url?: string } | void> {
  const callbackUrl = options?.callbackUrl ?? (typeof window !== 'undefined' ? window.location.href : '/')
  const redirect = options?.redirect !== false

  const csrfToken = await getCsrfToken()
  const body = new URLSearchParams()
  body.set('csrfToken', csrfToken)
  body.set('callbackUrl', callbackUrl)

  const { callbackUrl: _cb, redirect: _rd, ...rest } = options ?? {}
  for (const [k, v] of Object.entries(rest)) {
    if (v === undefined || v === null) continue
    body.set(k, String(v))
  }

  const base = '/api/auth'
  const isCredentials = providerId === 'email-otp'
  const path = isCredentials ? `${base}/callback/${providerId}` : `${base}/signin/${providerId}`

  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    credentials: 'include',
    body,
  })

  let data: { url?: string } = {}
  try {
    data = await res.json()
  } catch {
    /* empty */
  }

  if (redirect) {
    const url = data.url ?? callbackUrl
    if (typeof window !== 'undefined') {
      window.location.href = url
      if (url.includes('#')) window.location.reload()
    }
    return
  }

  const errUrl = data.url
  let error: string | undefined
  if (typeof errUrl === 'string') {
    try {
      error = new URL(errUrl, 'http://localhost').searchParams.get('error') ?? undefined
    } catch {
      /* ignore */
    }
  }

  return { ok: res.ok, error, url: data.url }
}

export async function signOut(options?: { callbackUrl?: string; redirect?: boolean }): Promise<void> {
  const callbackUrl = options?.callbackUrl ?? (typeof window !== 'undefined' ? window.location.href : '/')
  const redirect = options?.redirect !== false
  const csrfToken = await getCsrfToken()
  const body = new URLSearchParams({ csrfToken, callbackUrl })

  const res = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    credentials: 'include',
    body,
  })

  let data: { url?: string } = {}
  try {
    data = await res.json()
  } catch {
    /* empty */
  }

  if (redirect && typeof window !== 'undefined') {
    const url = data.url ?? callbackUrl
    window.location.href = url
    if (url.includes('#')) window.location.reload()
  }
}
