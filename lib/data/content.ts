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
  inferAreaKeyFromLabel,
  type Property,
} from '@/lib/property-data'
import { getFeaturedListings, type FeaturedListing } from '@/lib/home-marketing-data'

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

export type ComingSoonCard = {
  slug: string
  name: string
  /** Short area label, e.g. "Indiranagar" */
  area: string
  tagline: string
}

export type EventKind = 'movie' | 'gaming' | 'tour' | 'other'
export type PropertyEvent = {
  id: string
  propertySlug: string
  title: string
  kind: EventKind
  /** ISO timestamp */
  startsAt: string
  description: string
  /** Attendance fee in ₹; 0 means free */
  feeInr: number
}

// --- Properties (live / curated) -------------------------------------------

/** All published, LIVE properties, ordered for the home grid. */
export async function fetchAllProperties(): Promise<Property[]> {
  const { data, error } = await getSupabase()
    .from('properties')
    .select('data')
    .eq('published', true)
    .eq('status', 'live')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => row.data as Property)
}

/** A single LIVE property by slug, or undefined. Coming-soon slugs return undefined. */
export async function fetchPropertyBySlug(slug: string): Promise<Property | undefined> {
  const { data, error } = await getSupabase()
    .from('properties')
    .select('data')
    .eq('slug', slug.trim().toLowerCase())
    .eq('published', true)
    .eq('status', 'live')
    .maybeSingle()

  if (error) throw error
  return (data?.data as Property) ?? undefined
}

/** Curated (live) cards for the home grid. */
export async function fetchCuratedListings(): Promise<FeaturedListing[]> {
  const properties = await fetchAllProperties()
  return getFeaturedListings(buildHomePropertyCards(properties), [])
}

// --- Coming soon ------------------------------------------------------------

/** Teaser cards for homes that aren't live yet. */
export async function fetchComingSoonProperties(): Promise<ComingSoonCard[]> {
  const { data, error } = await getSupabase()
    .from('properties')
    .select('slug, name, data')
    .eq('published', true)
    .eq('status', 'coming_soon')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => {
    const d = (r.data ?? {}) as { tagline?: string; address?: string; city?: string }
    const area = inferAreaKeyFromLabel(`${d.address ?? ''} ${d.city ?? ''} ${r.name}`) || (d.city ?? '')
    return { slug: r.slug as string, name: r.name as string, area, tagline: d.tagline ?? '' }
  })
}

// --- Events -----------------------------------------------------------------

/** All active events across every property, earliest first. */
export async function fetchActiveEvents(): Promise<PropertyEvent[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .eq('active', true)
    .order('starts_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id as string,
    propertySlug: r.property_slug as string,
    title: r.title as string,
    kind: r.kind as EventKind,
    startsAt: r.starts_at as string,
    description: (r.description as string) ?? '',
    feeInr: (r.fee_inr as number) ?? 0,
  }))
}

/** Group events by their property slug. */
export function buildEventsBySlug(events: PropertyEvent[]): Record<string, PropertyEvent[]> {
  const map: Record<string, PropertyEvent[]> = {}
  for (const e of events) {
    ;(map[e.propertySlug] ??= []).push(e)
  }
  return map
}

// --- Marketing content ------------------------------------------------------

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
