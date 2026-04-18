import { inferAreaKeyFromLabel, type HomePropertyCard, type SearchAreaValue } from '@/lib/property-data'

export type FeaturedBadge = 'premium' | 'new' | 'popular' | 'featured'

export interface FeaturedListing {
  id: string
  slug: string | null
  name: string
  location: string
  image: string
  beds: number
  baths: number
  sqft: number
  /** Lowest room rent for this listing (same as card “from” price) */
  priceMonthly: number
  badge: FeaturedBadge
  /** Must match home location filter option */
  areaKey: SearchAreaValue
}

const PLACEHOLDER_IMAGES = {
  kor: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=700&fit=crop',
  ind: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=900&h=700&fit=crop',
  wf: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=700&fit=crop',
  bel: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop',
} as const

/** Budget `<select>` values → max monthly rent (₹) for “from” price on lowest room */
export function budgetKeyToMaxMonthly(budgetKey: string): number | null {
  const n = parseInt(budgetKey, 10)
  if (!budgetKey || !Number.isFinite(n) || n <= 0) return null
  return n * 1000
}

export function filterFeaturedListings(
  items: FeaturedListing[],
  location: string,
  budgetKey: string,
): FeaturedListing[] {
  const maxRent = budgetKeyToMaxMonthly(budgetKey)
  return items.filter((item) => {
    if (location && item.areaKey !== location) return false
    if (maxRent != null && item.priceMonthly > maxRent) return false
    return true
  })
}

export function getFeaturedListings(live: HomePropertyCard[]): FeaturedListing[] {
  const out: FeaturedListing[] = []
  const first = live[0]
  if (first) {
    const area = first.areaKey || inferAreaKeyFromLabel(first.location)
    if (area) {
      out.push({
        id: first.slug,
        slug: first.slug,
        name: first.name,
        location: first.location,
        image: first.image,
        beds: 4,
        baths: 3,
        sqft: 1850,
        priceMonthly: first.rentFrom,
        badge: 'premium',
        areaKey: area,
      })
    }
  }
  out.push(
    {
      id: 'soon-kor',
      slug: null,
      name: 'Koramangala Comfort',
      location: 'Koramangala, 5th Block, Bangalore',
      image: PLACEHOLDER_IMAGES.kor,
      beds: 3,
      baths: 2,
      sqft: 1280,
      priceMonthly: 16000,
      badge: 'new',
      areaKey: 'Koramangala',
    },
    {
      id: 'soon-ind',
      slug: null,
      name: 'Indiranagar Indie',
      location: '100 Feet Road, Indiranagar',
      image: PLACEHOLDER_IMAGES.ind,
      beds: 3,
      baths: 3,
      sqft: 1420,
      priceMonthly: 22000,
      badge: 'popular',
      areaKey: 'Indiranagar',
    },
    {
      id: 'soon-wf',
      slug: null,
      name: 'Whitefield Wanderer',
      location: 'ITPL Main Road, Whitefield',
      image: PLACEHOLDER_IMAGES.wf,
      beds: 4,
      baths: 3,
      sqft: 1650,
      priceMonthly: 15000,
      badge: 'featured',
      areaKey: 'Whitefield',
    },
    {
      id: 'soon-bel',
      slug: null,
      name: 'Bellandur Breeze',
      location: 'Bellandur, Outer Ring Road',
      image: PLACEHOLDER_IMAGES.bel,
      beds: 3,
      baths: 2,
      sqft: 1100,
      priceMonthly: 14000,
      badge: 'new',
      areaKey: 'Bellandur',
    },
  )
  return out
}

export const STATS = [
  { id: 'res', icon: 'users' as const, value: '2,500+', label: 'Happy residents' },
  { id: 'prop', icon: 'map' as const, value: '150+', label: 'Properties' },
  { id: 'cities', icon: 'trend' as const, value: '12', label: 'Cities' },
  { id: 'rate', icon: 'award' as const, value: '4.9', label: 'Average rating' },
]

export const DEMOGRAPHICS = [
  { pct: '45%', label: 'Tech professionals', color: 'text-sky-700' },
  { pct: '30%', label: 'Creative industries', color: 'text-rose-600' },
  { pct: '25%', label: 'Entrepreneurs', color: 'text-amber-600' },
] as const

export const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'The virtual tour feature helped me book my apartment from Delhi. Best decision I made. The team was incredibly supportive.',
    name: 'Rahul Mehta',
    role: 'Product Manager',
    meta: 'Moved to Bangalore',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
  },
  {
    id: 't2',
    quote:
      'Absolutely loved my stay — community vibes are incredible, and the location is perfect for young professionals.',
    name: 'Priya S.',
    role: 'Designer',
    meta: 'HSR Layout',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
  },
  {
    id: 't3',
    quote: 'Transparent pricing and responsive property managers. Aurova made relocation painless.',
    name: 'Ananya K.',
    role: 'Engineer',
    meta: 'Indiranagar',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
  },
  {
    id: 't4',
    quote: 'Month-to-month flexibility with premium amenities — unmatched for consultants who travel.',
    name: 'Rahul M.',
    role: 'Consultant',
    meta: 'Koramangala',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop',
  },
] as const
