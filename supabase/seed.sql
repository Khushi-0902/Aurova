-- ============================================================================
--  Aurova — seed data
--  Run AFTER schema.sql, in the Supabase SQL Editor.
--  This loads the exact same content the site shipped with, so the live site
--  looks identical after you connect Supabase.
--
--  Safe to re-run: every insert uses ON CONFLICT to update in place.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Property: HSR Ki Vibe
-- The whole object goes in `data`. Dollar-quoting ($json$ ... $json$) means we
-- don't have to escape the apostrophes inside the tenant notes.
-- ---------------------------------------------------------------------------
insert into public.properties (slug, name, city, published, sort_order, data)
values (
  'hsr-ki-vibe',
  'HSR Ki Vibe',
  'Bangalore',
  true,
  0,
  $json$
{
  "id": "prop-001",
  "slug": "hsr-ki-vibe",
  "name": "HSR Ki Vibe",
  "tagline": "Where modern living meets community spirit",
  "type": "4BHK",
  "area": 1850,
  "address": "123, 5th Block, HSR Layout",
  "city": "Bangalore",
  "coordinates": { "lat": 12.9116, "lng": 77.6389 },
  "rating": 4.8,
  "reviewCount": 47,
  "totalRooms": 4,
  "occupiedRooms": 2,
  "sharedCosts": [
    { "id": "sc-1", "name": "Maid Service", "description": "Daily cleaning of common areas, dishes, and laundry folding", "monthlyCost": 3000, "perPerson": true },
    { "id": "sc-2", "name": "Cook", "description": "Breakfast and dinner, Mon-Sat (customizable menu)", "monthlyCost": 4500, "perPerson": true },
    { "id": "sc-3", "name": "WiFi", "description": "200 Mbps high-speed fiber connection", "monthlyCost": 1500, "perPerson": false },
    { "id": "sc-4", "name": "Electricity", "description": "Split equally based on usage", "monthlyCost": 2000, "perPerson": true },
    { "id": "sc-5", "name": "Water & Maintenance", "description": "RO water, building maintenance charges", "monthlyCost": 500, "perPerson": true }
  ],
  "images": [
    { "id": "img-1", "url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop", "alt": "Living room with modern furniture", "section": "hero" },
    { "id": "img-2", "url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", "alt": "Spacious common area", "section": "common-area" },
    { "id": "img-3", "url": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop", "alt": "Modern kitchen", "section": "kitchen" },
    { "id": "img-4", "url": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop", "alt": "Bedroom 1", "section": "room-1" },
    { "id": "img-5", "url": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop", "alt": "Bedroom 2", "section": "room-2" },
    { "id": "img-6", "url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop", "alt": "Bedroom 3", "section": "room-3" },
    { "id": "img-7", "url": "https://images.unsplash.com/photo-1598928506311-c55ez361a33b?w=800&h=600&fit=crop", "alt": "Bedroom 4", "section": "room-4" },
    { "id": "img-8", "url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop", "alt": "Bathroom 1", "section": "washroom-1" },
    { "id": "img-9", "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop", "alt": "Bathroom 2", "section": "washroom-2" },
    { "id": "img-10", "url": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop", "alt": "Building exterior", "section": "exterior" }
  ],
  "rooms": [
    {
      "id": "room-1",
      "name": "Sunrise Suite",
      "type": "Master Bedroom",
      "size": "200 sq ft",
      "isOccupied": false,
      "rent": 22000,
      "deposit": 44000,
      "images": [
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop"
      ],
      "features": ["Attached Bathroom", "Balcony Access", "Built-in Wardrobe", "AC Included", "East Facing"]
    },
    {
      "id": "room-2",
      "name": "Cozy Corner",
      "type": "Standard Bedroom",
      "size": "150 sq ft",
      "isOccupied": false,
      "rent": 18000,
      "deposit": 36000,
      "images": [
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop"
      ],
      "features": ["Attached Bathroom", "Natural Light", "Study Desk", "AC Included"]
    },
    {
      "id": "room-3",
      "name": "Garden View Room",
      "type": "Standard Bedroom",
      "size": "160 sq ft",
      "isOccupied": true,
      "tenant": {
        "profession": "Software Engineer",
        "company": "Google",
        "moveInDate": "2024-08-15",
        "gender": "male",
        "diet": "non-vegetarian",
        "smoker": false,
        "hometown": "Jaipur",
        "personalNote": "Hey! I'm Arjun from Jaipur. I work in cloud infrastructure at Google. When I'm not debugging code, you'll find me playing chess or trying out new board games. Always up for a weekend trek or a good conversation over chai. Looking forward to great flatmate vibes!"
      },
      "images": [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop"
      ],
      "features": ["Attached Bathroom", "Garden View", "Built-in Wardrobe", "AC Included"]
    },
    {
      "id": "room-4",
      "name": "Quiet Retreat",
      "type": "Standard Bedroom",
      "size": "145 sq ft",
      "isOccupied": true,
      "tenant": {
        "profession": "Product Designer",
        "company": "Flipkart",
        "moveInDate": "2024-06-01",
        "gender": "female",
        "diet": "vegetarian",
        "smoker": false,
        "hometown": "Pune",
        "personalNote": "Hi there! I'm Meera, a designer who loves creating beautiful experiences. Originally from Pune, I moved here for the startup energy. I'm a plant mom, yoga enthusiast, and a total foodie. Love hosting small dinner parties and movie nights. Can't wait to meet new flatmates!"
      },
      "images": [
        "https://images.unsplash.com/photo-1598928506311-c55eeaf4a33b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop"
      ],
      "features": ["Shared Bathroom", "Quiet Zone", "Study Desk", "AC Included"]
    }
  ],
  "amenities": [
    { "id": "a1", "name": "High-Speed WiFi", "icon": "wifi", "category": "essential" },
    { "id": "a2", "name": "Air Conditioning", "icon": "thermometer", "category": "essential" },
    { "id": "a3", "name": "Washing Machine", "icon": "shirt", "category": "essential" },
    { "id": "a4", "name": "Fully Equipped Kitchen", "icon": "utensils", "category": "essential" },
    { "id": "a5", "name": "Smart TV", "icon": "tv", "category": "lifestyle" },
    { "id": "a6", "name": "Gym Access", "icon": "dumbbell", "category": "lifestyle" },
    { "id": "a7", "name": "Rooftop Terrace", "icon": "sun", "category": "lifestyle" },
    { "id": "a8", "name": "Co-working Space", "icon": "briefcase", "category": "lifestyle" },
    { "id": "a9", "name": "24/7 Security", "icon": "shield", "category": "safety" },
    { "id": "a10", "name": "CCTV Surveillance", "icon": "camera", "category": "safety" },
    { "id": "a11", "name": "Fire Safety", "icon": "flame", "category": "safety" },
    { "id": "a12", "name": "Power Backup", "icon": "zap", "category": "essential" }
  ],
  "nearbyPlaces": [
    { "id": "np1", "name": "Third Wave Coffee", "type": "cafe", "distance": "200m", "rating": 4.5 },
    { "id": "np2", "name": "HSR Social", "type": "restaurant", "distance": "350m", "rating": 4.3 },
    { "id": "np3", "name": "Cult.fit HSR", "type": "gym", "distance": "400m", "rating": 4.6 },
    { "id": "np4", "name": "Agara Lake", "type": "park", "distance": "500m", "rating": 4.2 },
    { "id": "np5", "name": "HSR Layout Metro", "type": "metro", "distance": "1.2km", "rating": 4.4 },
    { "id": "np6", "name": "BDA Complex", "type": "mall", "distance": "800m", "rating": 4.1 },
    { "id": "np7", "name": "WeWork HSR", "type": "coworking", "distance": "600m", "rating": 4.7 }
  ],
  "reviews": [
    { "id": "r1", "author": "Priya S.", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", "rating": 5, "date": "2024-12-15", "comment": "Absolutely loved my stay at HSR Ki Vibe! The community vibes are incredible, and the location is perfect for young professionals. The common areas are always clean and well-maintained.", "stayDuration": "8 months" },
    { "id": "r2", "author": "Rahul M.", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", "rating": 5, "date": "2024-11-28", "comment": "The flexibility Aurova offers is unmatched. As someone who travels frequently for work, having a month-to-month option with such premium amenities is a game-changer.", "stayDuration": "6 months" },
    { "id": "r3", "author": "Ananya K.", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", "rating": 4, "date": "2024-10-20", "comment": "Great location and wonderful housemates. The property manager is very responsive. Only wish the gym was a bit bigger, but overall an excellent experience.", "stayDuration": "1 year" },
    { "id": "r4", "author": "Vikram T.", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", "rating": 5, "date": "2024-09-10", "comment": "Moving to Bangalore was daunting, but Aurova made it seamless. The community events helped me make friends quickly, and the place feels like home.", "stayDuration": "4 months" }
  ],
  "nearbyProperties": [
    { "id": "nearby-1", "name": "Koramangala Comfort", "location": "Koramangala, 5th Block", "price": 16000, "rating": 4.7, "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop", "coordinates": { "lat": 12.9352, "lng": 77.6245 } },
    { "id": "nearby-2", "name": "Indiranagar Indie", "location": "100 Feet Road, Indiranagar", "price": 22000, "rating": 4.9, "image": "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop", "coordinates": { "lat": 12.9784, "lng": 77.6408 } },
    { "id": "nearby-3", "name": "Whitefield Wanderer", "location": "ITPL Main Road, Whitefield", "price": 15000, "rating": 4.6, "image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop", "coordinates": { "lat": 12.9698, "lng": 77.7500 } }
  ],
  "highlights": [
    "Prime location in tech hub",
    "Community events every week",
    "Flexible lease terms",
    "All utilities included"
  ]
}
  $json$::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      published = excluded.published,
      sort_order = excluded.sort_order,
      data = excluded.data;

-- ---------------------------------------------------------------------------
-- Coming-soon listings (marketing placeholders)
-- ---------------------------------------------------------------------------
insert into public.coming_soon_listings (id, sort_order, name, location, image, beds, baths, sqft, price_monthly, badge, area_key) values
  ('soon-kor', 1, 'Koramangala Comfort', 'Koramangala, 5th Block, Bangalore', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=700&fit=crop', 3, 2, 1280, 16000, 'new', 'Koramangala'),
  ('soon-ind', 2, 'Indiranagar Indie', '100 Feet Road, Indiranagar', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=900&h=700&fit=crop', 3, 3, 1420, 22000, 'popular', 'Indiranagar'),
  ('soon-wf',  3, 'Whitefield Wanderer', 'ITPL Main Road, Whitefield', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=700&fit=crop', 4, 3, 1650, 15000, 'featured', 'Whitefield'),
  ('soon-bel', 4, 'Bellandur Breeze', 'Bellandur, Outer Ring Road', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop', 3, 2, 1100, 14000, 'new', 'Bellandur')
on conflict (id) do update set
  sort_order = excluded.sort_order, name = excluded.name, location = excluded.location,
  image = excluded.image, beds = excluded.beds, baths = excluded.baths, sqft = excluded.sqft,
  price_monthly = excluded.price_monthly, badge = excluded.badge, area_key = excluded.area_key;

-- ---------------------------------------------------------------------------
-- Site stats
-- ---------------------------------------------------------------------------
insert into public.site_stats (id, sort_order, icon, value, label) values
  ('res',    1, 'users', '2,500+', 'Happy residents'),
  ('prop',   2, 'map',   '150+',   'Properties'),
  ('cities', 3, 'trend', '12',     'Cities'),
  ('rate',   4, 'award', '4.9',    'Average rating')
on conflict (id) do update set
  sort_order = excluded.sort_order, icon = excluded.icon, value = excluded.value, label = excluded.label;

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
insert into public.testimonials (id, sort_order, quote, name, role, meta, rating, avatar) values
  ('t1', 1, 'The virtual tour feature helped me book my apartment from Delhi. Best decision I made. The team was incredibly supportive.', 'Rahul Mehta', 'Product Manager', 'Moved to Bangalore', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop'),
  ('t2', 2, 'Absolutely loved my stay — community vibes are incredible, and the location is perfect for young professionals.', 'Priya S.', 'Designer', 'HSR Layout', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop'),
  ('t3', 3, 'Transparent pricing and responsive property managers. Aurova made relocation painless.', 'Ananya K.', 'Engineer', 'Indiranagar', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop'),
  ('t4', 4, 'Month-to-month flexibility with premium amenities — unmatched for consultants who travel.', 'Rahul M.', 'Consultant', 'Koramangala', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop')
on conflict (id) do update set
  sort_order = excluded.sort_order, quote = excluded.quote, name = excluded.name, role = excluded.role,
  meta = excluded.meta, rating = excluded.rating, avatar = excluded.avatar;

-- ---------------------------------------------------------------------------
-- Demographics
-- ---------------------------------------------------------------------------
insert into public.demographics (id, sort_order, pct, label, color) values
  ('demo-tech',   1, '45%', 'Tech professionals',  'text-sky-700'),
  ('demo-create', 2, '30%', 'Creative industries', 'text-rose-600'),
  ('demo-entre',  3, '25%', 'Entrepreneurs',        'text-amber-600')
on conflict (id) do update set
  sort_order = excluded.sort_order, pct = excluded.pct, label = excluded.label, color = excluded.color;
