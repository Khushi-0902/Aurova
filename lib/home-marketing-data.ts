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
  /** Must match home location filter option (empty if it can't be inferred) */
  areaKey: SearchAreaValue | ''
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

/** Badge assigned to each real property card, cycling for visual variety. */
const LIVE_BADGES: FeaturedBadge[] = ['premium', 'featured', 'popular', 'new']

/**
 * Builds the featured list: every published property (real, clickable cards),
 * followed by the "coming soon" placeholders loaded from the database. Real
 * properties are ordered by their `sort_order` (already applied to `live`), so
 * the grid grows automatically as you add homes.
 */
export function getFeaturedListings(
  live: HomePropertyCard[],
  comingSoon: FeaturedListing[],
): FeaturedListing[] {
  const liveListings: FeaturedListing[] = live.map((card, i) => ({
    id: card.slug,
    slug: card.slug,
    name: card.name,
    location: card.location,
    image: card.image,
    beds: card.beds,
    baths: card.baths,
    sqft: card.sqft,
    priceMonthly: card.rentFrom,
    badge: LIVE_BADGES[i % LIVE_BADGES.length],
    areaKey: card.areaKey || inferAreaKeyFromLabel(card.location),
  }))
  return [...liveListings, ...comingSoon]
}
