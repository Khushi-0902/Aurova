/**
 * Data-access layer. Everything the site displays is read from Supabase here.
 *
 * Server Components call these directly (they're async). Client components
 * receive the results as props. There is no hardcoded fallback: if a query
 * fails, the error surfaces (a page may error) rather than serving stale data.
 */
import { getSupabase } from '@/lib/supabase/client'
import {
  buildHomePropertyCards,
  type HomePropertyCard,
  type Property,
  type SearchAreaValue,
} from '@/lib/property-data'
import { getFeaturedListings, type FeaturedBadge, type FeaturedListing } from '@/lib/home-marketing-data'

export type StatItem = { id: string; icon: 'users' | 'map' | 'trend' | 'award'; value: string; label: string }
export type TestimonialItem = {
  id: string
  quote: string
  name: string
  role: string
  meta: string
  rating: number
  avatar: string
}
export type DemographicItem = { pct: string; label: string; color: string }

// --- Properties -------------------------------------------------------------

/** All published properties, ordered for the home grid. */
export async function fetchAllProperties(): Promise<Property[]> {
  const { data, error } = await getSupabase()
    .from('properties')
    .select('data')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => row.data as Property)
}

/** A single property by slug, or undefined if it doesn't exist. */
export async function fetchPropertyBySlug(slug: string): Promise<Property | undefined> {
  const { data, error } = await getSupabase()
    .from('properties')
    .select('data')
    .eq('slug', slug.trim().toLowerCase())
    .eq('published', true)
    .maybeSingle()

  if (error) throw error
  return (data?.data as Property) ?? undefined
}

/** Home-grid cards, derived from the published properties. */
export async function fetchHomePropertyCards(): Promise<HomePropertyCard[]> {
  const properties = await fetchAllProperties()
  return buildHomePropertyCards(properties)
}

// --- Marketing content ------------------------------------------------------

/** "Coming soon" placeholder listings on the home page. */
export async function fetchComingSoonListings(): Promise<FeaturedListing[]> {
  const { data, error } = await getSupabase()
    .from('coming_soon_listings')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: null,
    name: r.name,
    location: r.location,
    image: r.image,
    beds: r.beds,
    baths: r.baths,
    sqft: r.sqft,
    priceMonthly: r.price_monthly,
    badge: r.badge as FeaturedBadge,
    areaKey: r.area_key as SearchAreaValue,
  }))
}

/** Full featured list: the first live property + the coming-soon placeholders. */
export async function fetchFeaturedListings(live: HomePropertyCard[]): Promise<FeaturedListing[]> {
  const comingSoon = await fetchComingSoonListings()
  return getFeaturedListings(live, comingSoon)
}

/** "By the numbers" stat cards. */
export async function fetchStats(): Promise<StatItem[]> {
  const { data, error } = await getSupabase()
    .from('site_stats')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({ id: r.id, icon: r.icon as StatItem['icon'], value: r.value, label: r.label }))
}

/** Resident testimonials. */
export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  const { data, error } = await getSupabase()
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    quote: r.quote,
    name: r.name,
    role: r.role,
    meta: r.meta,
    rating: r.rating,
    avatar: r.avatar,
  }))
}

/** Resident demographic breakdown cards. */
export async function fetchDemographics(): Promise<DemographicItem[]> {
  const { data, error } = await getSupabase()
    .from('demographics')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({ pct: r.pct, label: r.label, color: r.color }))
}
