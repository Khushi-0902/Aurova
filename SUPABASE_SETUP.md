# Aurova — Supabase setup

All site content (properties, rooms, reviews, amenities, the "coming soon"
listings, stats, testimonials, demographics) now lives in **Supabase** instead
of being hardcoded in the codebase. The app reads from the database at request
time, so you can change content without touching code or redeploying.

There is **no hardcoded fallback** — if Supabase isn't configured, content pages
won't render. So do the one-time setup below before the next deploy.

---

## 1. Create a Supabase project (free)

1. Go to https://supabase.com → sign in → **New project**.
2. Pick a name (e.g. `aurova`), a strong database password, and a region close
   to your users (e.g. Mumbai / Singapore for India).
3. Wait ~2 minutes for it to provision.

## 2. Create the tables and load the data

1. In the project, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql),
   run it. (Creates all tables + security rules.)
3. New query again, paste [`supabase/seed.sql`](supabase/seed.sql), run it.
   (Loads the exact content the site shipped with — HSR Ki Vibe + marketing.)
4. Check **Table Editor** — you should see a row in `properties` and rows in
   `coming_soon_listings`, `site_stats`, `testimonials`, `demographics`.

## 3. Get your API keys

Dashboard → **Project Settings → API**. Copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (needed for wishlist sync)

The anon key is safe to expose in the browser: the security rules (RLS) only
allow reading published content, nothing else. The **service_role** key is the
opposite — it bypasses all security rules, so it is used only on the server
(never sent to the browser, never prefixed with `NEXT_PUBLIC_`). Keep it secret.

## 4. Run it locally

```bash
cp .env.local.example .env.local     # then paste your URL + anon key into it
npm install                          # picks up the new @supabase/supabase-js
npm run dev
```

Open http://localhost:3000/home — the home grid, the `/hsr-ki-vibe` page, and
`/wishlist` should all look exactly as before, now served from Supabase.

## 5. Deploy on Vercel

1. Vercel → your project → **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` (same values as `.env.local`) for **Production**
   (and Preview if you use it).
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the new env vars take effect.

Pages use ISR (`revalidate = 60`), so after the first deploy, content edits in
Supabase appear on the live site within ~60 seconds — no redeploy needed.

---

## How do I add a new property?

Three ways, easiest first:

**A. Ask Claude (Cowork).** Say e.g. *"add a new 3BHK property called Koramangala
Comfort in Koramangala with 3 rooms, 2 available"* and Claude will hand you a
ready-to-run SQL block. Paste it into Supabase → SQL Editor → run. Done.

**B. Use the template.** Open
[`supabase/add-property-template.sql`](supabase/add-property-template.sql), copy
it into the SQL Editor, change the values (slug, name, rooms, images, prices),
and run it. The file lists the exact rules (allowed `type`, image `section`
values, etc.).

**C. Table Editor.** In Supabase → Table Editor → `properties` → **Insert row**.
Fill `slug`, `name`, `city`, `sort_order`, and paste the property object into the
`data` (jsonb) field. (The template file is the easiest source for that JSON.)

Either way, the new page is live at `https://your-site/<slug>` within ~60
seconds. Set `published = false` to hide a property without deleting it, and use
`sort_order` (lower = first) to order the home grid.

To edit an existing property (change a price, mark a room occupied, add a
review), edit its `data` in the Table Editor, or ask Claude for an `UPDATE`.

---

## Coming soon homes and live events

The home page has two sections: **Curated** (live, bookable homes) and **Coming
soon** (teaser cards for homes that aren't open yet). Coming-soon homes host
**live events** — movie nights, gaming nights, and free tours — that guests book
over WhatsApp.

One-time setup: run [`supabase/events-and-coming-soon.sql`](supabase/events-and-coming-soon.sql)
in the SQL Editor (after `schema.sql` + `seed.sql`). It adds a `status` column
to `properties`, creates the `events` table, and seeds a few sample events.

How it works:
- A property's `status` is either `coming_soon` or `live`. Curated shows `live`;
  Coming soon shows `coming_soon`.
- A home **starts** as `coming_soon` (with events already running). When it's
  ready, flip it to `live` — it moves into Curated and its events carry over.
- Events live in the `events` table, one row per event, with a `fee_inr`
  (`0` = free, e.g. a tour). "Attend" / "Book free" opens WhatsApp pre-filled
  with the event details; you confirm and collect payment manually.

Add a coming-soon home (teaser only — no rooms/photos needed):

```sql
insert into public.properties (slug, name, city, published, status, sort_order, data)
values ('jayanagar-jewel', 'Jayanagar Jewel', 'Bangalore', true, 'coming_soon', 20,
  $json$ {"tagline":"A quiet gem in old Bangalore","address":"Jayanagar 4th Block","city":"Bangalore"} $json$::jsonb);
```

Add events to it:

```sql
insert into public.events (property_slug, title, kind, starts_at, description, fee_inr, sort_order) values
  ('jayanagar-jewel', 'Movie night', 'movie', '2026-09-20 20:00+05:30', 'Rooftop screening + dinner.', 299, 1),
  ('jayanagar-jewel', 'Property tour', 'tour', '2026-09-22 11:00+05:30', 'Guided walkthrough with our host.', 0, 2);
```

Move a home from Coming soon to Curated when it's ready (its events stay):

```sql
update public.properties set status = 'live' where slug = 'jayanagar-jewel';
```

`kind` must be one of `movie`, `gaming`, `tour`, `other`. Set an event's
`active = false` to hide it without deleting.

---

## Fixing the sign-in email error

The "Continue with Google" button already works. The **email code** option was
failing with:

> The aurovaliving.in domain is not verified. Please, add and verify your domain
> on https://resend.com/domains

That's a Resend configuration issue, not a code bug — Resend won't send from a
domain you haven't verified. Two options:

- **For testing now:** remove (or don't set) the `RESEND_FROM` env var. The code
  now falls back to Resend's sandbox sender (`onboarding@resend.dev`), which
  works without verification — but it can only deliver to the email address that
  owns your Resend account.
- **For real users (recommended):** verify your domain.
  1. https://resend.com/domains → **Add Domain** → `aurovaliving.in`.
  2. Add the DNS records Resend shows you (SPF/DKIM) at your domain registrar.
  3. Once it shows **Verified**, set `RESEND_FROM=Aurova <noreply@aurovaliving.in>`
     in `.env.local` and in Vercel, and redeploy.

You also need `RESEND_API_KEY` set (https://resend.com/api-keys) in both places.

---

## What's in the repo

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Tables + security rules. Run once. |
| `supabase/seed.sql` | Loads the current content. Run once, after schema. |
| `supabase/events-and-coming-soon.sql` | Adds status + events, seeds coming-soon homes. Run once. |
| `supabase/add-property-template.sql` | Copy/edit/run to add a property. |
| `lib/supabase/client.ts` | The public (anon) Supabase client for reads. |
| `lib/supabase/admin.ts` | Server-only service-role client (wishlist writes). |
| `lib/data/content.ts` | All the read functions the pages call. |
| `lib/data/wishlist.ts` | Server functions for per-user saved homes. |
| `app/api/wishlist/route.ts` | API the browser calls to load/save the wishlist. |
| `.env.local.example` | Which env vars to set. |

## Notes

- **Wishlist** now syncs across devices for signed-in users. Saved homes are
  stored in the `wishlists` table keyed by the user's email; the app reads and
  writes them through `/api/wishlist` on the server (using the service-role
  key), so the browser never touches that table directly. Guests still use
  per-browser storage, and when a guest signs in, the homes they saved while
  logged out are merged into their account. If `SUPABASE_SERVICE_ROLE_KEY`
  isn't set, this quietly falls back to per-browser storage — so set that key
  for sync to work.
- **Images** are still hotlinked from Unsplash URLs stored in the data. If you
  want to host images yourself later, Supabase Storage is the natural next step.
