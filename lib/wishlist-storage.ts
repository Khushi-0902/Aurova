/** Anonymous wishlist (guest) */
export const WISHLIST_ANON_KEY = 'aurova-wishlist'

export function wishlistUserKey(email: string): string {
  return `aurova-wishlist:user:${email.trim().toLowerCase()}`
}

export function parseWishlistJson(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is string => typeof s === 'string' && s.length > 0)
      .map((s) => s.trim().toLowerCase())
  } catch {
    return []
  }
}

export function readWishlistSlugs(storageKey: string): string[] {
  if (typeof window === 'undefined') return []
  return parseWishlistJson(localStorage.getItem(storageKey))
}

export function writeWishlistSlugs(storageKey: string, slugs: string[]): void {
  if (typeof window === 'undefined') return
  const unique = [...new Set(slugs.map((s) => s.trim().toLowerCase()).filter(Boolean))]
  localStorage.setItem(storageKey, JSON.stringify(unique))
}

export function mergeWishlistSlugs(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])]
}

/** After OTP / Google sign-in: merge guest list into account list and clear guest key. */
export function mergeAnonymousWishlistIntoUser(email: string): string[] {
  if (typeof window === 'undefined') return []
  const userKey = wishlistUserKey(email)
  const anon = readWishlistSlugs(WISHLIST_ANON_KEY)
  const existing = readWishlistSlugs(userKey)
  const merged = mergeWishlistSlugs(existing, anon)
  writeWishlistSlugs(userKey, merged)
  localStorage.removeItem(WISHLIST_ANON_KEY)
  return merged
}

/** Before sign-out: copy account list to guest key so the same homes stay visible while logged out. */
export function copyUserWishlistToAnonymous(email: string): void {
  if (typeof window === 'undefined') return
  const userKey = wishlistUserKey(email)
  const userSlugs = readWishlistSlugs(userKey)
  writeWishlistSlugs(WISHLIST_ANON_KEY, userSlugs)
}
