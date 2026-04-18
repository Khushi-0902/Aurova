'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [slugs, setSlugs] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const loadedStorageKeyRef = useRef<string | null>(null)

  const storageKey =
    status === 'authenticated' && session?.user?.email
      ? wishlistUserKey(session.user.email)
      : WISHLIST_ANON_KEY

  useLayoutEffect(() => {
    if (status === 'loading') return
    if (typeof window === 'undefined') return

    if (loadedStorageKeyRef.current === storageKey) return

    if (status === 'authenticated' && session?.user?.email) {
      const merged = mergeAnonymousWishlistIntoUser(session.user.email)
      setSlugs(merged)
    } else {
      setSlugs(readWishlistSlugs(WISHLIST_ANON_KEY))
    }

    loadedStorageKeyRef.current = storageKey
    setHydrated(true)
  }, [session?.user?.email, status, storageKey])

  useLayoutEffect(() => {
    if (!hydrated || status === 'loading') return
    writeWishlistSlugs(storageKey, slugs)
  }, [slugs, hydrated, storageKey, status])

  const isWishlisted = useCallback(
    (slug: string) => slugs.includes(slug.trim().toLowerCase()),
    [slugs],
  )

  const addWishlist = useCallback((slug: string) => {
    const s = slug.trim().toLowerCase()
    if (!s) return
    setSlugs((prev) => (prev.includes(s) ? prev : [...prev, s]))
  }, [])

  const removeWishlist = useCallback((slug: string) => {
    const s = slug.trim().toLowerCase()
    setSlugs((prev) => prev.filter((x) => x !== s))
  }, [])

  const toggleWishlist = useCallback((slug: string) => {
    const s = slug.trim().toLowerCase()
    if (!s) return
    setSlugs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }, [])

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
