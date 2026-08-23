// Types and pure helpers for property data.
// The actual content lives in Supabase and is loaded via lib/data/content.ts.

export interface PropertyImage {
  id: string
  url: string
  alt: string
  section: 'hero' | 'common-area' | 'room-1' | 'room-2' | 'room-3' | 'room-4' | 'washroom-1' | 'washroom-2' | 'washroom-3' | 'washroom-4' | 'exterior' | 'kitchen'
}

export interface TenantProfile {
  profession: string
  company: string
  moveInDate: string
  gender: 'male' | 'female' | 'other'
  diet: 'vegetarian' | 'non-vegetarian' | 'vegan'
  smoker: boolean
  personalNote: string
  hometown?: string
}

export interface SharedCost {
  id: string
  name: string
  description: string
  monthlyCost: number
  perPerson: boolean
}

export interface Room {
  id: string
  name: string
  type: string
  size: string
  isOccupied: boolean
  rent?: number
  deposit?: number
  tenant?: TenantProfile
  images: string[]
  features: string[]
}

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
  stayDuration: string
}

export interface NearbyProperty {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  coordinates: { lat: number; lng: number }
}

export interface NearbyPlace {
  id: string
  name: string
  type: 'cafe' | 'restaurant' | 'gym' | 'park' | 'metro' | 'mall' | 'coworking'
  distance: string
  rating: number
}

export interface Amenity {
  id: string
  name: string
  icon: string
  category: 'essential' | 'lifestyle' | 'safety'
}

export interface Property {
  id: string
  /** URL path segment, e.g. "hsr-ki-vibe" → /hsr-ki-vibe */
  slug: string
  name: string
  tagline: string
  type: '2BHK' | '3BHK' | '4BHK'
  area: number
  address: string
  city: string
  coordinates: { lat: number; lng: number }
  rating: number
  reviewCount: number
  totalRooms: number
  occupiedRooms: number
  images: PropertyImage[]
  rooms: Room[]
  amenities: Amenity[]
  nearbyPlaces: NearbyPlace[]
  reviews: Review[]
  nearbyProperties: NearbyProperty[]
  highlights: string[]
  sharedCosts: SharedCost[]
}

/** Values must match the marketing home location `<select>` options. */
export const SEARCH_AREA_VALUES = [
  'HSR Layout',
  'Koramangala',
  'Indiranagar',
  'Whitefield',
  'Bellandur',
] as const

export type SearchAreaValue = (typeof SEARCH_AREA_VALUES)[number]

export function inferAreaKeyFromLabel(text: string): SearchAreaValue | '' {
  const t = text.toLowerCase()
  if (t.includes('bellandur')) return 'Bellandur'
  if (t.includes('whitefield')) return 'Whitefield'
  if (t.includes('indiranagar')) return 'Indiranagar'
  if (t.includes('koramangala')) return 'Koramangala'
  if (t.includes('hsr layout') || t.includes('hsr')) return 'HSR Layout'
  return ''
}

export function inferPropertyAreaKey(p: Property): SearchAreaValue | '' {
  return inferAreaKeyFromLabel(`${p.address} ${p.city} ${p.name}`)
}

export interface HomePropertyCard {
  slug: string
  name: string
  location: string
  /** Lowest monthly room rent shown on the home grid */
  rentFrom: number
  image: string
  /** Area label for search filters; from address/city when possible */
  areaKey: SearchAreaValue | ''
}

/** Pure: turn any list of properties into home-grid cards. */
export function buildHomePropertyCards(properties: Property[]): HomePropertyCard[] {
  return properties.map((p) => {
    const rents = p.rooms.map((r) => r.rent).filter((n): n is number => typeof n === 'number')
    const rentFrom = rents.length > 0 ? Math.min(...rents) : 0
    const hero = p.images.find((i) => i.section === 'hero') ?? p.images[0]
    return {
      slug: p.slug,
      name: p.name,
      location: `${p.address}, ${p.city}`,
      rentFrom,
      image: hero?.url ?? '',
      areaKey: inferPropertyAreaKey(p),
    }
  })
}
