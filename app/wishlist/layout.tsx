import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saved homes | Aurova',
  description: 'Properties you have saved on this device.',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
