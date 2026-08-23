-- ============================================================================
--  Add a NEW property to Aurova
--  ----------------------------------------------------------------------------
--  1. Copy this whole file into Supabase → SQL Editor → New query.
--  2. Change the values (slug, name, rooms, images, prices, etc.).
--  3. Run it.
--  4. The site picks it up automatically within ~60 seconds (ISR) — no code
--     change, no redeploy. The new page lives at  https://your-site/<slug>
--
--  Tip: you don't have to hand-edit JSON. You can also ask Claude in Cowork
--  "add a new property called X in Koramangala with 3 rooms ..." and it will
--  generate a ready-to-run version of this file for you.
--
--  Rules that keep the UI happy:
--   * slug        -> lowercase, words separated by hyphens, unique.
--   * type        -> '2BHK' | '3BHK' | '4BHK'
--   * images[].section -> 'hero' | 'common-area' | 'kitchen' | 'exterior' |
--                         'room-1'..'room-4' | 'washroom-1'..'washroom-4'
--                         (the "hero" image is the one shown on cards)
--   * rooms[].isOccupied -> false shows rent/deposit; true shows a tenant card,
--                           so include a "tenant" object when true.
--   * amenities[].category -> 'essential' | 'lifestyle' | 'safety'
--   * amenities[].icon / nearbyPlaces[].type -> keep to the values used in
--                           seed.sql so the right icons render.
--   * sort_order  -> lower numbers appear first on the home grid.
-- ============================================================================

insert into public.properties (slug, name, city, published, sort_order, data)
values (
  'koramangala-comfort',                 -- <-- slug (URL). CHANGE ME. must be unique
  'Koramangala Comfort',                 -- <-- name.  CHANGE ME
  'Bangalore',                           -- <-- city.  CHANGE ME
  true,                                  -- published? true = live, false = hidden
  1,                                     -- sort_order (0 = first)
  $json$
{
  "id": "prop-002",
  "slug": "koramangala-comfort",
  "name": "Koramangala Comfort",
  "tagline": "Your line about the vibe of this home",
  "type": "3BHK",
  "area": 1280,
  "address": "Koramangala, 5th Block",
  "city": "Bangalore",
  "coordinates": { "lat": 12.9352, "lng": 77.6245 },
  "rating": 4.7,
  "reviewCount": 0,
  "totalRooms": 3,
  "occupiedRooms": 0,
  "sharedCosts": [
    { "id": "sc-1", "name": "WiFi", "description": "High-speed fiber", "monthlyCost": 1500, "perPerson": false }
  ],
  "images": [
    { "id": "img-1", "url": "https://images.unsplash.com/PHOTO?w=1200&h=800&fit=crop", "alt": "Living room", "section": "hero" },
    { "id": "img-2", "url": "https://images.unsplash.com/PHOTO?w=800&h=600&fit=crop", "alt": "Kitchen", "section": "kitchen" }
  ],
  "rooms": [
    {
      "id": "room-1",
      "name": "Sunlit Room",
      "type": "Master Bedroom",
      "size": "180 sq ft",
      "isOccupied": false,
      "rent": 20000,
      "deposit": 40000,
      "images": ["https://images.unsplash.com/PHOTO?w=800&h=600&fit=crop"],
      "features": ["Attached Bathroom", "AC Included"]
    }
  ],
  "amenities": [
    { "id": "a1", "name": "High-Speed WiFi", "icon": "wifi", "category": "essential" },
    { "id": "a2", "name": "24/7 Security", "icon": "shield", "category": "safety" }
  ],
  "nearbyPlaces": [
    { "id": "np1", "name": "A nearby cafe", "type": "cafe", "distance": "200m", "rating": 4.5 }
  ],
  "reviews": [],
  "nearbyProperties": [],
  "highlights": ["Add a few short selling points"]
}
  $json$::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      published = excluded.published,
      sort_order = excluded.sort_order,
      data = excluded.data;

-- Optional: also add it as a marketing "featured" card on the home page
-- (only needed if you want a card before it has its own real listing):
--
-- insert into public.coming_soon_listings
--   (id, sort_order, name, location, image, beds, baths, sqft, price_monthly, badge, area_key)
-- values
--   ('soon-xyz', 5, 'Name', 'Location', 'https://...', 3, 2, 1200, 16000, 'new', 'Koramangala');
