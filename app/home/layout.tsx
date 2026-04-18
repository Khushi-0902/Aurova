import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aurova | Flexible Living Made Easy',
  description:
    'Discover fully managed, beautifully designed co-living spaces in Bangalore. Browse homes and book a visit.',
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
