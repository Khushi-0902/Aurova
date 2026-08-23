import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

import { auth } from '@/auth'
import { getUserWishlist, mergeUserWishlist, setUserWishlist } from '@/lib/data/wishlist'
import { isSupabaseAdminConfigured } from '@/lib/supabase/admin'

async function currentUserEmail(): Promise<string | null> {
  const session = await auth()
  const email = session?.user?.email
  return email ? email.trim().toLowerCase() : null
}

function parseSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((s): s is string => typeof s === 'string')
}

/** Signals to the client that DB sync isn't set up, so it can use localStorage. */
function notConfigured() {
  return NextResponse.json({ error: 'wishlist_not_configured' }, { status: 503 })
}

// Current user's saved slugs.
export async function GET() {
  if (!isSupabaseAdminConfigured()) return notConfigured()
  const email = await currentUserEmail()
  if (!email) return NextResponse.json({ slugs: [] })
  try {
    return NextResponse.json({ slugs: await getUserWishlist(email) })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

// Replace the current user's saved set.
export async function PUT(req: Request) {
  if (!isSupabaseAdminConfigured()) return notConfigured()
  const email = await currentUserEmail()
  if (!email) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as { slugs?: unknown } | null
  try {
    const saved = await setUserWishlist(email, parseSlugs(body?.slugs))
    return NextResponse.json({ slugs: saved })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

// Merge guest slugs into the current user's set (used right after sign-in).
export async function POST(req: Request) {
  if (!isSupabaseAdminConfigured()) return notConfigured()
  const email = await currentUserEmail()
  if (!email) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as { slugs?: unknown } | null
  try {
    const merged = await mergeUserWishlist(email, parseSlugs(body?.slugs))
    return NextResponse.json({ slugs: merged })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
