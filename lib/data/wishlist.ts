import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

function normalizeSlugs(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return []
  const cleaned = slugs
    .filter((s): s is string => typeof s === 'string')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set(cleaned)]
}

/** All saved property slugs for a user, oldest first. */
export async function getUserWishlist(email: string): Promise<string[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('wishlists')
    .select('slug')
    .eq('user_email', email)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => r.slug as string)
}

/** Replace a user's entire saved set with `slugs`. Returns the stored set. */
export async function setUserWishlist(email: string, slugs: string[]): Promise<string[]> {
  const admin = getSupabaseAdmin()
  const clean = normalizeSlugs(slugs)

  // Simple + reliable for a personal-sized list: clear, then insert the set.
  const { error: delErr } = await admin.from('wishlists').delete().eq('user_email', email)
  if (delErr) throw delErr

  if (clean.length > 0) {
    const rows = clean.map((slug) => ({ user_email: email, slug }))
    const { error: insErr } = await admin.from('wishlists').insert(rows)
    if (insErr) throw insErr
  }
  return clean
}

/** Merge guest slugs into a user's saved set (union). Returns the merged set. */
export async function mergeUserWishlist(email: string, guestSlugs: string[]): Promise<string[]> {
  const existing = await getUserWishlist(email)
  const merged = [...new Set([...existing, ...normalizeSlugs(guestSlugs)])]
  return setUserWishlist(email, merged)
}
