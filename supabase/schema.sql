-- ============================================================================
--  Aurova — Supabase schema
--  Run this ONCE in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--  Then run seed.sql to load the current content.
--
--  Design notes
--  ------------
--  * A whole property (rooms, images, amenities, reviews, shared costs, etc.)
--    lives in a single JSONB column `data`. That means adding a new property is
--    ONE insert — see add-property-template.sql. The app reads `data` and uses it
--    exactly as the old hardcoded `Property` object, so nothing in the UI changes.
--  * The marketing content (stats, testimonials, demographics, "coming soon"
--    listings) live in small flat tables that are easy to edit in the dashboard.
--  * Row Level Security is ON everywhere. The public site only ever READS, using
--    the anon key, so we grant `select` to anon/authenticated and nothing else.
--    All writes go through the service-role key (seed script / dashboard), which
--    bypasses RLS.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- properties : the full catalog. One row = one property page.
-- ---------------------------------------------------------------------------
create table if not exists public.properties (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- URL segment, e.g. 'hsr-ki-vibe'
  name        text not null,
  city        text,
  published   boolean not null default true,  -- flip to false to hide without deleting
  sort_order  int not null default 0,         -- controls order on the home grid
  data        jsonb not null,                 -- the full Property object
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists properties_published_sort_idx
  on public.properties (published, sort_order);

-- ---------------------------------------------------------------------------
-- coming_soon_listings : the "featured" placeholder homes on the marketing page
-- (the ones without a real detail page yet).
-- ---------------------------------------------------------------------------
create table if not exists public.coming_soon_listings (
  id            text primary key,             -- e.g. 'soon-kor'
  sort_order    int not null default 0,
  name          text not null,
  location      text not null,
  image         text not null,
  beds          int not null,
  baths         int not null,
  sqft          int not null,
  price_monthly int not null,
  badge         text not null,                -- 'premium' | 'new' | 'popular' | 'featured'
  area_key      text not null                 -- must match a home search area value
);

-- ---------------------------------------------------------------------------
-- site_stats : the "by the numbers" cards on the home page.
-- ---------------------------------------------------------------------------
create table if not exists public.site_stats (
  id          text primary key,               -- e.g. 'res'
  sort_order  int not null default 0,
  icon        text not null,                  -- 'users' | 'map' | 'trend' | 'award'
  value       text not null,                  -- e.g. '2,500+'
  label       text not null
);

-- ---------------------------------------------------------------------------
-- testimonials : resident quotes on the home page.
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id          text primary key,               -- e.g. 't1'
  sort_order  int not null default 0,
  quote       text not null,
  name        text not null,
  role        text not null,
  meta        text not null,
  rating      int not null default 5,
  avatar      text not null
);

-- ---------------------------------------------------------------------------
-- demographics : the "% of residents" cards.
-- ---------------------------------------------------------------------------
create table if not exists public.demographics (
  id          text primary key,               -- e.g. 'demo-tech'
  sort_order  int not null default 0,
  pct         text not null,                  -- e.g. '45%'
  label       text not null,
  color       text not null                   -- tailwind text-color class
);

-- ---------------------------------------------------------------------------
-- wishlists : per-user saved homes (future use — the app still works with the
-- localStorage wishlist until this is wired up). One row per (user, property).
-- ---------------------------------------------------------------------------
create table if not exists public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  user_email  text not null,
  slug        text not null,
  created_at  timestamptz not null default now(),
  unique (user_email, slug)
);

create index if not exists wishlists_user_idx on public.wishlists (user_email);

-- ============================================================================
--  Row Level Security
-- ============================================================================
alter table public.properties            enable row level security;
alter table public.coming_soon_listings  enable row level security;
alter table public.site_stats            enable row level security;
alter table public.testimonials          enable row level security;
alter table public.demographics          enable row level security;
alter table public.wishlists             enable row level security;

-- Public, read-only access to all published content.
-- (Dropping first makes this script safe to re-run.)
drop policy if exists "public read properties"    on public.properties;
drop policy if exists "public read coming_soon"    on public.coming_soon_listings;
drop policy if exists "public read stats"          on public.site_stats;
drop policy if exists "public read testimonials"   on public.testimonials;
drop policy if exists "public read demographics"   on public.demographics;

create policy "public read properties"
  on public.properties for select
  to anon, authenticated
  using (published = true);

create policy "public read coming_soon"
  on public.coming_soon_listings for select
  to anon, authenticated using (true);

create policy "public read stats"
  on public.site_stats for select
  to anon, authenticated using (true);

create policy "public read testimonials"
  on public.testimonials for select
  to anon, authenticated using (true);

create policy "public read demographics"
  on public.demographics for select
  to anon, authenticated using (true);

-- wishlists: no anon policy on purpose. Writes/reads happen via the service-role
-- key on the server (or add a policy here later once you wire per-user auth).

-- Keep updated_at fresh on properties.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();
