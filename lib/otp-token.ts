import { createHmac, timingSafeEqual } from 'node:crypto'

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET must be set (min 16 characters). Generate with: openssl rand -base64 32')
  }
  return secret
}

function toBase64Url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromBase64Url(s: string): Buffer {
  let str = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (str.length % 4)) % 4
  str += '='.repeat(pad)
  return Buffer.from(str, 'base64')
}

export type OtpJwtPayload = {
  email: string
  name: string
  otp: string
}

/** Compact HS256 JWT for short-lived OTP cookie (no `jose` dependency). */
export async function signOtpChallenge(payload: OtpJwtPayload): Promise<string> {
  const secret = getAuthSecret()
  const header = toBase64Url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }), 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const bodyObj = { ...payload, iat: now, exp: now + 600 }
  const body = toBase64Url(Buffer.from(JSON.stringify(bodyObj), 'utf8'))
  const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest()
  const signature = toBase64Url(sig)
  return `${header}.${body}.${signature}`
}

export async function verifyOtpChallenge(token: string): Promise<OtpJwtPayload> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  const [headerB64, payloadB64, sigB64] = parts
  const secret = getAuthSecret()
  const expected = createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest()
  let received: Buffer
  try {
    received = fromBase64Url(sigB64)
  } catch {
    throw new Error('Invalid token')
  }
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    throw new Error('Invalid token')
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(fromBase64Url(payloadB64).toString('utf8')) as Record<string, unknown>
  } catch {
    throw new Error('Invalid token')
  }

  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }

  const { email, name, otp } = payload
  if (typeof email !== 'string' || typeof name !== 'string' || typeof otp !== 'string') {
    throw new Error('Invalid OTP token payload')
  }
  return { email, name, otp }
}
