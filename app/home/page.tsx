import { MarketingHome } from '@/components/home/marketing-home'
import type { ComingSoonItem } from '@/components/home/coming-soon-section'
import {
  buildEventsBySlug,
  fetchActiveEvents,
  fetchComingSoonProperties,
  fetchCuratedListings,
  fetchDemographics,
  fetchStats,
  fetchTestimonials,
} from '@/lib/data/content'

// Re-fetch from Supabase at most once a minute, so new content shows up
// without a redeploy.
export const revalidate = 60

export default async function HomePage() {
  const [curated, comingSoonRaw, events, stats, testimonials, demographics] = await Promise.all([
    fetchCuratedListings(),
    fetchComingSoonProperties(),
    fetchActiveEvents(),
    fetchStats(),
    fetchTestimonials(),
    fetchDemographics(),
  ])

  // Keep only upcoming events (this runs on the server, so the wall-clock read
  // is safe and won't cause a client hydration mismatch).
  const now = Date.now()
  const upcomingEvents = events.filter((e) => new Date(e.startsAt).getTime() >= now)
  const eventsBySlug = buildEventsBySlug(upcomingEvents)
  const comingSoon: ComingSoonItem[] = comingSoonRaw.map((c) => ({
    ...c,
    events: eventsBySlug[c.slug] ?? [],
  }))

  return (
    <MarketingHome
      curated={curated}
      comingSoon={comingSoon}
      eventsBySlug={eventsBySlug}
      stats={stats}
      testimonials={testimonials}
      demographics={demographics}
    />
  )
}
