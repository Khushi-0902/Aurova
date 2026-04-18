'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from '@/components/auth/session-provider'
import { WishlistProvider } from '@/components/wishlist/wishlist-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </SessionProvider>
  )
}
