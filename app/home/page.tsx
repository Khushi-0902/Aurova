import { MarketingHome } from '@/components/home/marketing-home'
import {
  fetchDemographics,
  fetchFeaturedListings,
  fetchHomePropertyCards,
  fetchStats,
  fetchTestimonials,
} from '@/lib/data/content'

// Re-fetch from Supabase at most once a minute, so new content shows up
// without a redeploy.
export const revalidate = 60

export default async function HomePage() {
  const cards = await fetchHomePropertyCards()
  const [featured, stats, testimonials, demographics] = await Promise.all([
    fetchFeaturedListings(cards),
    fetchStats(),
    fetchTestimonials(),
    fetchDemographics(),
  ])

  return (
    <MarketingHome featured={featured} stats={stats} testimonials={testimonials} demographics={demographics} />
  )
}
