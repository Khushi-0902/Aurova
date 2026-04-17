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

export const sampleProperty: Property = {
  id: 'prop-001',
  name: 'HSR Ki Vibe',
  tagline: 'Where modern living meets community spirit',
  type: '4BHK',
  area: 1850,
  address: '123, 5th Block, HSR Layout',
  city: 'Bangalore',
  coordinates: { lat: 12.9116, lng: 77.6389 },
  rating: 4.8,
  reviewCount: 47,
  totalRooms: 4,
  occupiedRooms: 2,
  sharedCosts: [
    {
      id: 'sc-1',
      name: 'Maid Service',
      description: 'Daily cleaning of common areas, dishes, and laundry folding',
      monthlyCost: 3000,
      perPerson: true,
    },
    {
      id: 'sc-2',
      name: 'Cook',
      description: 'Breakfast and dinner, Mon-Sat (customizable menu)',
      monthlyCost: 4500,
      perPerson: true,
    },
    {
      id: 'sc-3',
      name: 'WiFi',
      description: '200 Mbps high-speed fiber connection',
      monthlyCost: 1500,
      perPerson: false,
    },
    {
      id: 'sc-4',
      name: 'Electricity',
      description: 'Split equally based on usage',
      monthlyCost: 2000,
      perPerson: true,
    },
    {
      id: 'sc-5',
      name: 'Water & Maintenance',
      description: 'RO water, building maintenance charges',
      monthlyCost: 500,
      perPerson: true,
    },
  ],
  images: [
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', alt: 'Living room with modern furniture', section: 'hero' },
    { id: 'img-2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', alt: 'Spacious common area', section: 'common-area' },
    { id: 'img-3', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', alt: 'Modern kitchen', section: 'kitchen' },
    { id: 'img-4', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', alt: 'Bedroom 1', section: 'room-1' },
    { id: 'img-5', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop', alt: 'Bedroom 2', section: 'room-2' },
    { id: 'img-6', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop', alt: 'Bedroom 3', section: 'room-3' },
    { id: 'img-7', url: 'https://images.unsplash.com/photo-1598928506311-c55ez361a33b?w=800&h=600&fit=crop', alt: 'Bedroom 4', section: 'room-4' },
    { id: 'img-8', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop', alt: 'Bathroom 1', section: 'washroom-1' },
    { id: 'img-9', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', alt: 'Bathroom 2', section: 'washroom-2' },
    { id: 'img-10', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop', alt: 'Building exterior', section: 'exterior' },
  ],
  // Rooms are ordered: Available rooms first, then Occupied rooms
  rooms: [
    // AVAILABLE ROOMS (shown first)
    {
      id: 'room-1',
      name: 'Sunrise Suite',
      type: 'Master Bedroom',
      size: '200 sq ft',
      isOccupied: false,
      rent: 22000,
      deposit: 44000,
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      ],
      features: ['Attached Bathroom', 'Balcony Access', 'Built-in Wardrobe', 'AC Included', 'East Facing'],
    },
    {
      id: 'room-2',
      name: 'Cozy Corner',
      type: 'Standard Bedroom',
      size: '150 sq ft',
      isOccupied: false,
      rent: 18000,
      deposit: 36000,
      images: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      ],
      features: ['Attached Bathroom', 'Natural Light', 'Study Desk', 'AC Included'],
    },
    // OCCUPIED ROOMS (shown after available)
    {
      id: 'room-3',
      name: 'Garden View Room',
      type: 'Standard Bedroom',
      size: '160 sq ft',
      isOccupied: true,
      tenant: {
        profession: 'Software Engineer',
        company: 'Google',
        moveInDate: '2024-08-15',
        gender: 'male',
        diet: 'non-vegetarian',
        smoker: false,
        hometown: 'Jaipur',
        personalNote: "Hey! I'm Arjun from Jaipur. I work in cloud infrastructure at Google. When I'm not debugging code, you'll find me playing chess or trying out new board games. Always up for a weekend trek or a good conversation over chai. Looking forward to great flatmate vibes!",
      },
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop',
      ],
      features: ['Attached Bathroom', 'Garden View', 'Built-in Wardrobe', 'AC Included'],
    },
    {
      id: 'room-4',
      name: 'Quiet Retreat',
      type: 'Standard Bedroom',
      size: '145 sq ft',
      isOccupied: true,
      tenant: {
        profession: 'Product Designer',
        company: 'Flipkart',
        moveInDate: '2024-06-01',
        gender: 'female',
        diet: 'vegetarian',
        smoker: false,
        hometown: 'Pune',
        personalNote: "Hi there! I'm Meera, a designer who loves creating beautiful experiences. Originally from Pune, I moved here for the startup energy. I'm a plant mom, yoga enthusiast, and a total foodie. Love hosting small dinner parties and movie nights. Can't wait to meet new flatmates!",
      },
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55eeaf4a33b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      ],
      features: ['Shared Bathroom', 'Quiet Zone', 'Study Desk', 'AC Included'],
    },
  ],
  amenities: [
    { id: 'a1', name: 'High-Speed WiFi', icon: 'wifi', category: 'essential' },
    { id: 'a2', name: 'Air Conditioning', icon: 'thermometer', category: 'essential' },
    { id: 'a3', name: 'Washing Machine', icon: 'shirt', category: 'essential' },
    { id: 'a4', name: 'Fully Equipped Kitchen', icon: 'utensils', category: 'essential' },
    { id: 'a5', name: 'Smart TV', icon: 'tv', category: 'lifestyle' },
    { id: 'a6', name: 'Gym Access', icon: 'dumbbell', category: 'lifestyle' },
    { id: 'a7', name: 'Rooftop Terrace', icon: 'sun', category: 'lifestyle' },
    { id: 'a8', name: 'Co-working Space', icon: 'briefcase', category: 'lifestyle' },
    { id: 'a9', name: '24/7 Security', icon: 'shield', category: 'safety' },
    { id: 'a10', name: 'CCTV Surveillance', icon: 'camera', category: 'safety' },
    { id: 'a11', name: 'Fire Safety', icon: 'flame', category: 'safety' },
    { id: 'a12', name: 'Power Backup', icon: 'zap', category: 'essential' },
  ],
  nearbyPlaces: [
    { id: 'np1', name: 'Third Wave Coffee', type: 'cafe', distance: '200m', rating: 4.5 },
    { id: 'np2', name: 'HSR Social', type: 'restaurant', distance: '350m', rating: 4.3 },
    { id: 'np3', name: 'Cult.fit HSR', type: 'gym', distance: '400m', rating: 4.6 },
    { id: 'np4', name: 'Agara Lake', type: 'park', distance: '500m', rating: 4.2 },
    { id: 'np5', name: 'HSR Layout Metro', type: 'metro', distance: '1.2km', rating: 4.4 },
    { id: 'np6', name: 'BDA Complex', type: 'mall', distance: '800m', rating: 4.1 },
    { id: 'np7', name: 'WeWork HSR', type: 'coworking', distance: '600m', rating: 4.7 },
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Priya S.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      date: '2024-12-15',
      comment: 'Absolutely loved my stay at HSR Ki Vibe! The community vibes are incredible, and the location is perfect for young professionals. The common areas are always clean and well-maintained.',
      stayDuration: '8 months',
    },
    {
      id: 'r2',
      author: 'Rahul M.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      date: '2024-11-28',
      comment: 'The flexibility Aurova offers is unmatched. As someone who travels frequently for work, having a month-to-month option with such premium amenities is a game-changer.',
      stayDuration: '6 months',
    },
    {
      id: 'r3',
      author: 'Ananya K.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 4,
      date: '2024-10-20',
      comment: 'Great location and wonderful housemates. The property manager is very responsive. Only wish the gym was a bit bigger, but overall an excellent experience.',
      stayDuration: '1 year',
    },
    {
      id: 'r4',
      author: 'Vikram T.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      rating: 5,
      date: '2024-09-10',
      comment: 'Moving to Bangalore was daunting, but Aurova made it seamless. The community events helped me make friends quickly, and the place feels like home.',
      stayDuration: '4 months',
    },
  ],
  nearbyProperties: [
    {
      id: 'nearby-1',
      name: 'Koramangala Comfort',
      location: 'Koramangala, 5th Block',
      price: 16000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      coordinates: { lat: 12.9352, lng: 77.6245 },
    },
    {
      id: 'nearby-2',
      name: 'Indiranagar Indie',
      location: '100 Feet Road, Indiranagar',
      price: 22000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop',
      coordinates: { lat: 12.9784, lng: 77.6408 },
    },
    {
      id: 'nearby-3',
      name: 'Whitefield Wanderer',
      location: 'ITPL Main Road, Whitefield',
      price: 15000,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
      coordinates: { lat: 12.9698, lng: 77.7500 },
    },
  ],
  highlights: [
    'Prime location in tech hub',
    'Community events every week',
    'Flexible lease terms',
    'All utilities included',
  ],
}
