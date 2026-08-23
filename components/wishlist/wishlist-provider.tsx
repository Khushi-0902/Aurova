'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from '@/components/auth/session-provider'
import {
  WISHLIST_ANON_KEY,
  mergeAnonymousWishlistIntoUser,
  readWishlistSlugs,
  wishlistUserKey,
  writeWishlistSlugs,
} from '@/lib/wishlist-storage'

type WishlistContextValue = {
  slugs: string[]
  hydrated: boolean
  isWishlisted: (slug: string) => boolean
  toggleWishlist: (slug: string) => void
  addWishlist: (slug: string) => void
  removeWishlist: (slug: string) => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase()
}

/** POST/PUT to the wishlist API. Returns the server's slugs, or null if the
 *  API isn't available (not signed in server-side, or DB sync not configured),
 *  so callers can fall back to localStorage. */
async function callWishlistApi(
  method: 'POST' | 'PUT',
  slugs: string[],
): Promise<string[] | null> {
  try {
    const res = await fetch('/api/wishlist', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { slugs?: unknown }
    return Array.isArray(data.slugs) ? (data.slugs as string[]) : null
  } catch {
    return null
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const email = session?.user?.email ? normalizeSlug(session.user.email) : null

  const [slugs, setSlugs] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Runs when the auth identity settles or changes (guest ↔ a signed-in user).
  useEffect(() => {
    if (status === 'loading') return
    if (typeof window === 'undefined') return

    // Guest: localStorage only.
    if (!email) {
      setSlugs(readWishlistSlugs(WISHLIST_ANON_KEY))
      setHydrated(true)
      return
    }

    // Signed in: show the cached list instantly, then reconcile with the DB.
    const userKey = wishlistUserKey(email)
    const guest = readWishlistSlugs(WISHLIST_ANON_KEY)
    setSlugs(readWishlistSlugs(userKey))
    setHydrated(true)

    let cancelled = false
    void (async () => {
      // Merge any guest saves into the account and get back the full list.
      const merged = await callWishlistApi('POST', guest)
      if (cancelled) return
      if (merged) {
        setSlugs(merged)
        writeWishlistSlugs(userKey, merged) // keep a local cache for instant loads
        if (guest.length > 0) localStorage.removeItem(WISHLIST_ANON_KEY)
      } else {
        // DB sync unavailable → preserve the old localStorage-only behaviour.
        setSlugs(mergeAnonymousWishlistIntoUser(email))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [email, status])

  // Persist a new set to the right place (DB + cache when signed in, else localStorage).
  const persist = useCallback(
    (next: string[]) => {
      if (typeof window === 'undefined') return
      if (email) {
        writeWishlistSlugs(wishlistUserKey(email), next)
        void callWishlistApi('PUT', next)
      } else {
        writeWishlistSlugs(WISHLIST_ANON_KEY, next)
      }
    },
    [email],
  )

  const isWishlisted = useCallback((slug: string) => slugs.includes(normalizeSlug(slug)), [slugs])

  const addWishlist = useCallback(
    (slug: string) => {
      const s = normalizeSlug(slug)
      if (!s) return
      setSlugs((prev) => {
        if (prev.includes(s)) return prev
        const next = [...prev, s]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const removeWishlist = useCallback(
    (slug: string) => {
      const s = normalizeSlug(slug)
      setSlugs((prev) => {
        if (!prev.includes(s)) return prev
        const next = prev.filter((x) => x !== s)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const toggleWishlist = useCallback(
    (slug: string) => {
      const s = normalizeSlug(slug)
      if (!s) return
      setSlugs((prev) => {
        const next = prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const value = useMemo(
    () => ({
      slugs,
      hydrated,
      isWishlisted,
      toggleWishlist,
      addWishlist,
      removeWishlist,
      count: slugs.length,
    }),
    [slugs, hydrated, isWishlisted, toggleWishlist, addWishlist, removeWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return ctx
}
