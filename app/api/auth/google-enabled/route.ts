import { NextResponse } from 'next/server'
import { isGoogleOAuthConfigured } from '@/lib/google-oauth-env'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Whether Google OAuth is configured on this deployment (reads env at request time). */
export async function GET() {
  return NextResponse.json({ googleEnabled: isGoogleOAuthConfigured() })
}
