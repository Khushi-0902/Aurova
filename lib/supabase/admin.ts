import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client that uses the SERVICE ROLE key.
 *
 * This bypasses Row Level Security, so it must NEVER be imported into client
 * code. It's used for per-user wishlist reads/writes, where the trusted user
 * identity comes from the NextAuth session on the server (see the wishlist API
 * route), not from the browser.
 *
 * Throws if not configured. Callers should treat a throw as "wishlist sync not
 * set up" and degrade gracefully.
 */
let cached: SupabaseClient | undefined

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    )
  }

  cached = createClient(url, serviceKey, { auth: { persistSession: false } })
  return cached
}

/** True when the service-role key is available (wishlist sync is possible). */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
