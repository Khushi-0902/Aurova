-- ============================================================================
--  Aurova — Coming Soon + Live Events
--  Run this ONCE in the Supabase SQL Editor, after schema.sql + seed.sql.
--  Safe to re-run.
--
--  What it adds
--  ------------
--  * properties.status  -> 'coming_soon' | 'live'. Curated section shows 'live';
--    Coming Soon section shows 'coming_soon'. A home starts as coming_soon and is
--    flipped to 'live' when it's ready — its events carry over automatically.
--  * events table -> movie nights, gaming nights, tours, etc. attached to a
--    property. Fee in ₹ (0 = free, e.g. a tour). Public can read active events.
--  * Migrates the old coming_soon_listings into real coming_soon properties and
--    seeds a few sample events so the new section has content.
-- ============================================================================

-- 1) Property status ---------------------------------------------------------
alter table public.properties
  add column if not exists status text not null default 'live';

alter table public.properties
  drop constraint if exists properties_status_check;
alter table public.properties
  add constraint properties_status_check check (status in ('coming_soon', 'live'));

create index if not exists properties_status_idx
  on public.properties (published, status, sort_order);

-- 2) Events ------------------------------------------------------------------
create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  property_slug  text not null references public.properties(slug) on delete cascade,
  title          text not null,
  kind           text not null default 'other' check (kind in ('movie', 'gaming', 'tour', 'other')),
  starts_at      timestamptz not null,
  description    text,
  fee_inr        int not null default 0,        -- 0 = free (e.g. a tour)
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists events_property_idx
  on public.events (property_slug, active, starts_at);

alter table public.events enable row level security;
drop policy if exists "public read events" on public.events;
create policy "public read events"
  on public.events for select
  to anon, authenticated
  using (active = true);

-- 3) Coming-soon properties (teaser rows) ------------------------------------
-- Teasers only need name + area + a tagline; no rooms/photos required. They are
-- never served as full property pages (those require status = 'live').
insert into public.properties (slug, name, city, published, status, sort_order, data) values
  ('indiranagar-indie',   'Indiranagar Indie',   'Bangalore', true, 'coming_soon', 10,
     $json$ {"tagline":"Indie soul on 100 Feet Road","address":"100 Feet Road, Indiranagar","city":"Bangalore"} $json$::jsonb),
  ('whitefield-wanderer',  'Whitefield Wanderer', 'Bangalore', true, 'coming_soon', 11,
     $json$ {"tagline":"Room to roam, minutes from ITPL","address":"ITPL Main Road, Whitefield","city":"Bangalore"} $json$::jsonb),
  ('bellandur-breeze',     'Bellandur Breeze',    'Bangalore', true, 'coming_soon', 12,
     $json$ {"tagline":"Easy, breezy living off the Outer Ring Road","address":"Bellandur, Outer Ring Road","city":"Bangalore"} $json$::jsonb)
on conflict (slug) do update set
  name = excluded.name, city = excluded.city, published = excluded.published,
  status = excluded.status, sort_order = excluded.sort_order, data = excluded.data;

-- 4) Sample events (times are relative to when you run this) ------------------
-- Clear any prior samples for these homes so re-running stays clean.
delete from public.events
  where property_slug in ('indiranagar-indie', 'whitefield-wanderer', 'bellandur-breeze');

insert into public.events (property_slug, title, kind, starts_at, description, fee_inr, sort_order) values
  ('indiranagar-indie',  'Movie night',   'movie',  now() + interval '3 days' + interval '20 hours', 'Rooftop screening with popcorn and dinner.',        299, 1),
  ('indiranagar-indie',  'Gaming night',  'gaming', now() + interval '4 days' + interval '19 hours', 'Console and board games, snacks included.',          199, 2),
  ('indiranagar-indie',  'Property tour', 'tour',   now() + interval '5 days' + interval '11 hours', 'Guided walkthrough of the home with our host.',        0, 3),
  ('whitefield-wanderer','Gaming night',  'gaming', now() + interval '2 days' + interval '19 hours', 'Console and board games, snacks included.',          199, 1),
  ('whitefield-wanderer','Property tour', 'tour',   now() + interval '6 days' + interval '11 hours', 'Guided walkthrough with our host.',                    0, 2),
  ('bellandur-breeze',   'Property tour', 'tour',   now() + interval '2 days' + interval '11 hours', 'Free guided walkthrough with our host.',               0, 1);

-- 5) Optional: the old coming_soon_listings table is no longer used by the app.
-- Once you've confirmed the new section works, you can drop it:
--   drop table if exists public.coming_soon_listings;
