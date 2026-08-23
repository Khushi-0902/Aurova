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

/**
 * Builds the featured list: the first live property (as a "premium" card),
 * followed by the "coming soon" placeholders loaded from the database.
 */
export function getFeaturedListings(
  live: HomePropertyCard[],
  comingSoon: FeaturedListing[],
): FeaturedListing[] {
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
  out.push(...comingSoon)
  return out
}
