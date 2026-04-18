'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Award,
  Bath,
  BedDouble,
  BadgeCheck,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  IndianRupee,
  Leaf,
  Mail,
  MapPin,
  Maximize2,
  SlidersHorizontal,
  Menu,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Search,
  Handshake,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { SEARCH_AREA_VALUES, type HomePropertyCard } from '@/lib/property-data'
import { CartoonCrosswalkLane } from '@/components/home/cartoon-crosswalk'
import { CommunitySection } from '@/components/home/community-section'
import { Reveal } from '@/components/home/reveal'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { AuthNav } from '@/components/auth/auth-nav'
import { useWishlist } from '@/components/wishlist/wishlist-provider'
import { cn } from '@/lib/utils'
import {
  filterFeaturedListings,
  budgetKeyToMaxMonthly,
  getFeaturedListings,
  STATS,
  type FeaturedBadge,
} from '@/lib/home-marketing-data'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '@/lib/contact'

const FEATURED_PAGE_SIZE = 4

const STAT_CARD_ACCENTS = [
  {
    iconGrad: 'from-amber-500 to-orange-600',
    hoverBorder: 'border-amber-300/75',
    hoverBg: 'bg-gradient-to-br from-amber-50/95 to-orange-50/65',
    hoverRing: 'ring-amber-300/40',
    watermark: 'text-amber-600/[0.11]',
    bar: 'from-amber-400 via-orange-500 to-orange-400',
  },
  {
    iconGrad: 'from-orange-500 to-rose-600',
    hoverBorder: 'border-orange-300/75',
    hoverBg: 'bg-gradient-to-br from-orange-50/95 to-rose-50/60',
    hoverRing: 'ring-orange-300/45',
    watermark: 'text-orange-600/[0.11]',
    bar: 'from-orange-400 via-rose-500 to-orange-400',
  },
  {
    iconGrad: 'from-violet-500 to-indigo-600',
    hoverBorder: 'border-violet-300/70',
    hoverBg: 'bg-gradient-to-br from-violet-50/95 to-indigo-50/55',
    hoverRing: 'ring-violet-300/40',
    watermark: 'text-violet-500/[0.12]',
    bar: 'from-violet-400 via-indigo-500 to-violet-400',
  },
  {
    iconGrad: 'from-amber-600 to-yellow-500',
    hoverBorder: 'border-amber-300/75',
    hoverBg: 'bg-gradient-to-br from-amber-50/95 to-yellow-50/55',
    hoverRing: 'ring-amber-300/40',
    watermark: 'text-amber-700/[0.1]',
    bar: 'from-amber-500 via-yellow-500 to-amber-500',
  },
] as const

const CREATOR_NOTES_CARDS = [
  {
    title: 'Handpicked with care',
    body: 'Every property in our collection is hand-selected. We visit, we photograph, we experience — so you only see the best.',
    icon: Sparkles,
    grad: 'from-amber-400 to-orange-500',
    cardBg: 'from-amber-50/95 via-white to-orange-50/40',
    border: 'border-amber-100/70',
    corner: 'border-amber-300/50',
  },
  {
    title: 'Built on trust',
    body: 'Transparent pricing, honest listings, no hidden fees. We believe trust is the foundation of any home.',
    icon: Heart,
    grad: 'from-rose-400 to-fuchsia-600',
    cardBg: 'from-rose-50/95 via-white to-fuchsia-50/45',
    border: 'border-rose-100/70',
    corner: 'border-rose-300/50',
  },
  {
    title: 'Your peace of mind',
    body: 'From maintenance to utilities, we handle it all. Focus on living; we take care of the rest.',
    icon: Shield,
    grad: 'from-sky-400 to-blue-600',
    cardBg: 'from-sky-50/95 via-white to-blue-50/35',
    border: 'border-sky-100/70',
    corner: 'border-sky-300/50',
  },
  {
    title: 'Sustainable living',
    body: 'Many of our properties feature eco-friendly amenities. Good for you, better for the planet.',
    icon: Leaf,
    grad: 'from-teal-400 to-emerald-600',
    cardBg: 'from-emerald-50/95 via-white to-teal-50/40',
    border: 'border-emerald-100/70',
    corner: 'border-emerald-300/50',
  },
] as const

const BADGE_GRADIENT: Record<FeaturedBadge, string> = {
  premium: 'from-amber-400 via-orange-400 to-orange-600',
  new: 'from-emerald-400 via-teal-400 to-teal-600',
  popular: 'from-yellow-300 via-amber-300 to-amber-600',
  featured: 'from-indigo-500 via-violet-500 to-purple-700',
}

const BADGE_LABEL: Record<FeaturedBadge, string> = {
  premium: 'Premium',
  new: 'New',
  popular: 'Popular',
  featured: 'Featured',
}

const DISCOVER_TRUST = [
  {
    title: 'Verified listings',
    sub: 'Photographed & walked in person',
    Icon: BadgeCheck,
    iconClass: 'text-amber-700',
  },
  {
    title: 'Lease flexibility',
    sub: 'Terms that respect your timeline',
    Icon: Calendar,
    iconClass: 'text-emerald-700',
  },
  {
    title: 'Zero brokerage',
    sub: 'What you see is what you pay',
    Icon: Handshake,
    iconClass: 'text-violet-700',
  },
] as const

function WishlistCardHeart({ slug }: { slug: string }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(slug)
      }}
      className="absolute right-2.5 top-2.5 z-20 flex size-9 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-md ring-1 ring-orange-950/10 backdrop-blur-sm transition hover:scale-105 hover:bg-white sm:right-3 sm:top-3 sm:size-10"
      aria-label={saved ? 'Remove from saved homes' : 'Save home'}
      aria-pressed={saved}
    >
      <Heart
        className={cn('size-4 transition-colors sm:size-[18px]', saved ? 'fill-red-500 text-red-500' : 'text-stone-600')}
      />
    </button>
  )
}

type MarketingHomeProps = {
  properties: HomePropertyCard[]
}

function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-orange-200/60 bg-white/85 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--mp-muted)] shadow-sm ${className}`}
    >
      {children}
    </span>
  )
}

function HeroWelcomeBadge() {
  return (
    <span className="marketing-hero-badge-ring relative inline-flex rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 p-[1.5px]">
      <span className="flex items-center gap-3 rounded-full bg-gradient-to-b from-white via-white to-orange-50/70 py-1.5 pl-1.5 pr-5 sm:pr-6 shadow-[inset_0_1px_0_oklch(1_0_0/0.85)]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-800 text-white shadow-md ring-2 ring-white/60">
          <Sparkles className="size-[18px]" strokeWidth={2.2} aria-hidden />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-orange-900/50">Welcome to</span>
          <span className="mt-0.5 block font-serif text-[1.35rem] font-semibold leading-none tracking-tight sm:text-2xl">
            <span className="marketing-gradient-accent">Aurova</span>
          </span>
        </span>
      </span>
    </span>
  )
}

function FeaturedHomesHeader() {
  return (
    <div className="relative mx-auto max-w-4xl text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-44 w-[min(100%,520px)] -translate-x-1/2 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,oklch(0.78_0.14_58/0.4),transparent_72%)]"
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-gradient-to-b from-white to-orange-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-900/65 shadow-md shadow-orange-900/10 ring-1 ring-white/80">
          <Sparkles className="size-3.5 shrink-0 text-orange-500" aria-hidden />
          Featured homes
        </span>
        <h2 className="mt-7 font-serif text-[2.35rem] font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.25rem]">
          <span className="text-[var(--mp-chocolate)]">Cur</span>
          <span className="marketing-gradient-accent">ated</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--mp-muted)] md:text-base">
          Hand-picked properties with real room-level detail, move-in ready spaces, and amenities you&apos;ll actually
          use.
        </p>
        <div
          className="mx-auto mt-8 h-1 w-28 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-90"
          aria-hidden
        />
      </div>
    </div>
  )
}

function SimpleProcessHeader() {
  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-44 w-[min(100%,520px)] -translate-x-1/2 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,oklch(0.78_0.14_58/0.35),transparent_72%)]"
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-gradient-to-b from-white to-orange-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-900/65 shadow-md shadow-orange-900/10 ring-1 ring-white/80">
          <Sparkles className="size-3.5 shrink-0 text-orange-500" aria-hidden />
          Simple process
        </span>
        <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[var(--mp-ink)] md:text-5xl">Your journey</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--mp-muted)]">
          Three simple steps to your perfect living space
        </p>
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  titleItalic,
}: {
  eyebrow: string
  title: ReactNode
  subtitle?: string
  titleItalic?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Pill>{eyebrow}</Pill>
      <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[var(--mp-ink)] md:text-5xl">
        {title}
        {titleItalic ? <em className="not-italic text-[var(--mp-muted)]"> {titleItalic}</em> : null}
      </h2>
      {subtitle ? <p className="mt-4 text-base leading-relaxed text-[var(--mp-muted)]">{subtitle}</p> : null}
    </div>
  )
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 shrink-0 ${i < n ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-stone-300'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

function scrollToPropertiesSection() {
  document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToHomeSearch() {
  document.getElementById('home-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const BUDGET_ORDER = ['15', '20', '25', '35'] as const

function budgetOptionLabel(value: string): string {
  const n = parseInt(value, 10)
  if (!Number.isFinite(n)) return ''
  return `Up to ₹${(n * 1000).toLocaleString('en-IN')}`
}

function higherBudgetSuggestions(currentBudget: string): { value: string; label: string }[] {
  const i = BUDGET_ORDER.indexOf(currentBudget as (typeof BUDGET_ORDER)[number])
  if (i < 0) return []
  return BUDGET_ORDER.slice(i + 1).map((value) => ({ value, label: budgetOptionLabel(value) }))
}

export function MarketingHome({ properties }: MarketingHomeProps) {
  const allFeatured = useMemo(() => getFeaturedListings(properties), [properties])
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')

  const filteredFeatured = useMemo(
    () => filterFeaturedListings(allFeatured, location, budget),
    [allFeatured, location, budget],
  )

  const filtersActive = Boolean(location || budget)
  const budgetMaxLabel = budgetKeyToMaxMonthly(budget)
  const zeroResults = filtersActive && filteredFeatured.length === 0
  const budgetSuggestions = higherBudgetSuggestions(budget)

  const [featuredPage, setFeaturedPage] = useState(0)
  const featuredTotal = filteredFeatured.length
  const featuredPageCount = Math.max(1, Math.ceil(featuredTotal / FEATURED_PAGE_SIZE))
  const featuredPageSafe = Math.min(featuredPage, featuredPageCount - 1)
  const visibleFeatured = useMemo(
    () => filteredFeatured.slice(featuredPageSafe * FEATURED_PAGE_SIZE, featuredPageSafe * FEATURED_PAGE_SIZE + FEATURED_PAGE_SIZE),
    [filteredFeatured, featuredPageSafe],
  )
  const showFeaturedCarousel = featuredTotal > FEATURED_PAGE_SIZE
  const canBroadenFeaturedSearch = filtersActive && filteredFeatured.length < allFeatured.length

  useEffect(() => {
    setFeaturedPage(0)
  }, [location, budget])

  useEffect(() => {
    setFeaturedPage((p) => Math.min(p, Math.max(0, featuredPageCount - 1)))
  }, [featuredPageCount])
  const [statHover, setStatHover] = useState<string | null>(null)
  const { count: savedHomesCount, hydrated: wishlistHydrated } = useWishlist()

  return (
    <div className="marketing-page marketing-bg-base relative min-h-screen text-[var(--mp-ink)] antialiased">
      <div className="marketing-bg-waves" aria-hidden />

      <header className="sticky top-0 z-50 border-b border-orange-950/10 bg-[var(--mp-cream)]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/home" className="flex shrink-0 items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[var(--mp-chocolate)] shadow-md shadow-orange-950/15 ring-2 ring-white/30">
              <span className="font-serif text-lg font-bold text-[var(--mp-cream)]">A</span>
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-[var(--mp-chocolate)]">Aurova</span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {[
              { href: '#properties', label: 'Properties' },
              { href: '#how', label: 'How it works' },
              { href: '#reviews', label: 'Reviews' },
              { href: '#about', label: 'About' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--mp-muted)] transition hover:bg-white/70 hover:text-[var(--mp-chocolate)]"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--mp-muted)] transition hover:bg-white/70 hover:text-[var(--mp-chocolate)]"
            >
              <Heart className="size-3.5 shrink-0" aria-hidden />
              Saved homes
              {wishlistHydrated && savedHomesCount > 0 ? (
                <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-orange-900/90">
                  {savedHomesCount}
                </span>
              ) : null}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="sm:hidden">
              <AuthNav variant="marketing" />
            </span>
            <Link
              href="/wishlist"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-orange-950/15 bg-white/90 text-[var(--mp-chocolate)] transition hover:bg-white md:hidden"
              aria-label={savedHomesCount > 0 ? `Saved homes, ${savedHomesCount}` : 'Saved homes'}
            >
              <Heart className="size-[18px]" aria-hidden />
              {wishlistHydrated && savedHomesCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--mp-chocolate)] px-1 text-[10px] font-bold text-[var(--mp-cream)]">
                  {savedHomesCount > 9 ? '9+' : savedHomesCount}
                </span>
              ) : null}
            </Link>
            <span className="hidden sm:inline">
              <AuthNav variant="marketing" />
            </span>
            <a
              href="#properties"
              className="marketing-btn-gradient rounded-full px-5 py-2.5 text-sm font-semibold transition"
            >
              Get started
            </a>
            <button
              type="button"
              className="rounded-full border border-orange-950/15 bg-white/90 p-2 text-[var(--mp-chocolate)] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="home-hero-in home-hero-in-delay-1 flex justify-center">
            <HeroWelcomeBadge />
          </div>
          <h1 className="home-hero-in home-hero-in-delay-2 mt-6 font-serif text-[2.65rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl md:text-[4.25rem]">
            <span className="text-[var(--mp-chocolate)]">Flexible living </span>
            <span className="marketing-gradient-accent">made easy</span>
          </h1>
          <p className="home-hero-in home-hero-in-delay-3 mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--mp-muted)] sm:text-lg">
            Discover handpicked homes with real room-level detail. Move-in ready with utilities and upkeep handled for
            you.
          </p>
        </div>

        <div id="home-search" className="home-hero-in home-hero-in-delay-4 mx-auto mt-10 max-w-4xl scroll-mt-28">
          <div className="rounded-[1.75rem] border border-white/90 bg-white p-2 shadow-[0_28px_90px_-28px_rgba(60,35,20,0.22),0_12px_32px_-16px_rgba(120,60,30,0.08)] sm:p-3">
            <div className="flex flex-col divide-y divide-orange-950/10 sm:flex-row sm:divide-x sm:divide-y-0">
              <label className="flex flex-1 cursor-pointer flex-col gap-1 px-4 py-3 text-left sm:py-4">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--mp-muted)]">
                  <MapPin className="size-3.5 text-orange-700/70" aria-hidden />
                  Location
                </span>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full cursor-pointer appearance-none bg-transparent py-1 pr-8 font-medium text-[var(--mp-chocolate)] outline-none"
                  >
                    <option value="">Select area</option>
                    {SEARCH_AREA_VALUES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-orange-900/35" />
                </div>
              </label>
              <label className="flex flex-1 cursor-pointer flex-col gap-1 px-4 py-3 text-left sm:py-4">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--mp-muted)]">
                  <IndianRupee className="size-3.5 text-orange-700/70" aria-hidden />
                  Budget
                </span>
                <div className="relative">
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full cursor-pointer appearance-none bg-transparent py-1 pr-8 font-medium text-[var(--mp-chocolate)] outline-none"
                  >
                    <option value="">Select budget</option>
                    <option value="15">Up to ₹15,000</option>
                    <option value="20">Up to ₹20,000</option>
                    <option value="25">Up to ₹25,000</option>
                    <option value="35">Up to ₹35,000</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-orange-900/35" />
                </div>
              </label>
              <div className="flex items-stretch p-2 sm:w-52 sm:flex-none">
                <button
                  type="button"
                  onClick={() => scrollToPropertiesSection()}
                  className="marketing-btn-gradient flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold"
                >
                  <Search className="size-4 opacity-95" aria-hidden />
                  Search
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="home-hero-in home-hero-in-delay-5 mx-auto mt-7 max-w-4xl space-y-4 px-1 sm:mt-8 sm:px-0">
          <p className="text-center text-[13px] leading-relaxed text-[var(--mp-muted)] sm:text-sm">
            <span className="font-semibold text-[var(--mp-chocolate)]">Same-day visits</span>
            <span className="text-orange-900/35"> · </span>
            WhatsApp-first booking
            <span className="text-orange-900/35"> · </span>
            Room-level photos &amp; pricing
          </p>
          <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
            {DISCOVER_TRUST.map(({ title, sub, Icon, iconClass }) => (
              <div
                key={title}
                className="flex min-w-[140px] flex-1 basis-[calc(50%-0.375rem)] items-start gap-3 rounded-2xl border border-white/70 bg-white/55 p-3.5 shadow-sm backdrop-blur-sm sm:max-w-none sm:basis-0 sm:flex-1 sm:p-4"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-orange-950/5 ${iconClass}`}
                >
                  <Icon className="size-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block font-serif text-sm font-semibold leading-tight text-[var(--mp-chocolate)]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--mp-muted)]">{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section
        id="properties"
        className="relative scroll-mt-24 overflow-hidden border-t border-orange-950/10 bg-gradient-to-b from-orange-50/50 via-[var(--mp-cream-deep)]/40 to-[var(--mp-cream)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
          aria-hidden
        />
        <Reveal>
          <FeaturedHomesHeader />
        </Reveal>

        {filtersActive && !zeroResults ? (
          <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 rounded-2xl border border-orange-950/10 bg-white/60 px-4 py-3 text-sm text-[var(--mp-muted)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>
              <span className="font-semibold text-[var(--mp-chocolate)]">
                {filteredFeatured.length} home{filteredFeatured.length === 1 ? '' : 's'}
              </span>{' '}
              match
              {location ? (
                <>
                  {' '}
                  in <span className="font-medium text-[var(--mp-chocolate)]">{location}</span>
                </>
              ) : null}
              {budgetMaxLabel != null ? (
                <>
                  {' '}
                  with rooms from{' '}
                  <span className="font-medium text-[var(--mp-chocolate)]">₹{budgetMaxLabel.toLocaleString('en-IN')}</span>{' '}
                  / mo or less
                </>
              ) : null}
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setLocation('')
                setBudget('')
              }}
              className="shrink-0 self-start rounded-full border border-orange-950/15 bg-white px-4 py-1.5 text-xs font-semibold text-[var(--mp-chocolate)] transition hover:border-orange-300 sm:self-auto"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {zeroResults ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-white/90 px-5 py-8 shadow-[0_20px_50px_-28px_rgba(90,50,10,0.12)] sm:px-8 sm:py-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-orange-950/10">
                <MapPin className="size-7 text-orange-700/80" aria-hidden />
              </span>
              <div className="mt-5 min-w-0 sm:ml-5 sm:mt-0">
                <p className="font-serif text-2xl font-semibold tracking-tight text-[var(--mp-chocolate)]">
                  No homes match your filters
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mp-muted)]">
                  <span className="font-semibold text-[var(--mp-chocolate)]">0 homes</span>{' '}
                  match
                  {location ? (
                    <>
                      {' '}
                      in <span className="font-medium text-[var(--mp-chocolate)]">{location}</span>
                    </>
                  ) : null}
                  {budgetMaxLabel != null ? (
                    <>
                      {location ? ' ' : ' '}
                      with rooms from{' '}
                      <span className="font-medium text-[var(--mp-chocolate)]">
                        ₹{budgetMaxLabel.toLocaleString('en-IN')}
                      </span>{' '}
                      / mo or less
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-orange-900/55 sm:text-left">
              Refine or reset
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {location ? (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="rounded-full border border-orange-950/15 bg-white px-4 py-2 text-xs font-semibold text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80"
                >
                  Remove area
                  <span className="text-[var(--mp-muted)]"> ({location})</span>
                </button>
              ) : null}
              {budget ? (
                <button
                  type="button"
                  onClick={() => setBudget('')}
                  className="rounded-full border border-orange-950/15 bg-white px-4 py-2 text-xs font-semibold text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80"
                >
                  Remove budget cap
                  <span className="text-[var(--mp-muted)]"> ({budgetOptionLabel(budget)})</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setLocation('')
                  setBudget('')
                }}
                className="marketing-btn-gradient rounded-full px-4 py-2 text-xs font-semibold"
              >
                Show all homes
              </button>
            </div>

            {budgetSuggestions.length > 0 ? (
              <div className="mt-6 border-t border-orange-950/10 pt-6">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-orange-900/55 sm:text-left">
                  Try a higher budget cap
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {budgetSuggestions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBudget(opt.value)}
                      className="rounded-full border border-orange-200/90 bg-white px-4 py-2 text-xs font-semibold text-[var(--mp-chocolate)] transition hover:border-orange-400 hover:bg-amber-50/80"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-orange-950/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => scrollToHomeSearch()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-900/90 underline decoration-orange-300 decoration-2 underline-offset-4 transition hover:text-[var(--mp-chocolate)]"
              >
                <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
                Adjust area &amp; budget in search bar
              </button>
            </div>
          </div>
        ) : null}

        {!zeroResults ? (
        <div className="mx-auto mt-12 w-full max-w-[90rem]">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {visibleFeatured.map((item, i) => {
              const cardShell =
                'group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_36px_-16px_rgba(40,35,30,0.2)] ring-1 ring-orange-950/5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 hover:shadow-[0_20px_48px_-14px_rgba(55,35,20,0.28)] hover:ring-orange-300/25 motion-reduce:transform-none motion-reduce:hover:translate-y-0'
              const inner = (
                <>
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/92 via-stone-900/22 to-transparent transition-opacity duration-500 group-hover:from-stone-950/95" />
                    <span
                      className={`absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md transition duration-300 group-hover:shadow-lg sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px] ${BADGE_GRADIENT[item.badge]}`}
                    >
                      {BADGE_LABEL[item.badge]}
                    </span>
                    {item.slug ? <WishlistCardHeart slug={item.slug} /> : null}
                    <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3 pb-3.5 text-white sm:space-y-2 sm:p-4 sm:pb-4">
                      <h3 className="font-serif text-base font-semibold leading-tight tracking-tight drop-shadow-sm sm:text-lg">
                        {item.name}
                      </h3>
                      <p className="flex items-start gap-1 text-[11px] leading-snug text-white/88 sm:text-xs">
                        <MapPin className="mt-0.5 size-3 shrink-0 opacity-90 sm:size-3.5" aria-hidden />
                        {item.location}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-0.5 text-[10px] font-medium text-white/88 sm:text-[11px]">
                        <span className="flex items-center gap-0.5">
                          <BedDouble className="size-3 opacity-90 sm:size-3.5" aria-hidden />
                          {item.beds}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Bath className="size-3 opacity-90 sm:size-3.5" aria-hidden />
                          {item.baths}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Maximize2 className="size-3 opacity-90 sm:size-3.5" aria-hidden />
                          {item.sqft} sq ft
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/20 pt-2 sm:pt-3">
                        <span className="text-sm font-bold tabular-nums tracking-tight sm:text-base">
                          ₹{item.priceMonthly.toLocaleString('en-IN')}
                          <span className="text-[10px] font-semibold text-white/82 sm:text-xs">/mo</span>
                        </span>
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-stone-900 group-hover:shadow-md sm:size-9">
                          <ArrowRight className="size-3.5 sm:size-4" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )
              return (
                <Reveal key={`${item.id}-${featuredPageSafe}`} delayMs={i * 110} className="h-full">
                  {item.slug ? (
                    <Link href={`/${item.slug}`} className={cardShell}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={`${cardShell} cursor-default opacity-[0.97]`}>{inner}</div>
                  )}
                </Reveal>
              )
            })}
          </div>

          {showFeaturedCarousel ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous properties"
                disabled={featuredPageSafe <= 0}
                onClick={() => setFeaturedPage(Math.max(0, featuredPageSafe - 1))}
                className="inline-flex size-11 items-center justify-center rounded-full border border-orange-950/15 bg-white text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/90 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <p className="min-w-[7rem] text-center text-xs font-semibold tabular-nums text-[var(--mp-muted)]">
                {featuredPageSafe + 1} / {featuredPageCount}
              </p>
              <button
                type="button"
                aria-label="Next properties"
                disabled={featuredPageSafe >= featuredPageCount - 1}
                onClick={() => setFeaturedPage(Math.min(featuredPageCount - 1, featuredPageSafe + 1))}
                className="inline-flex size-11 items-center justify-center rounded-full border border-orange-950/15 bg-white text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/90 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          ) : null}

          {canBroadenFeaturedSearch ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setLocation('')
                  setBudget('')
                  setFeaturedPage(0)
                  scrollToHomeSearch()
                }}
                className="text-sm font-semibold text-orange-900/90 underline decoration-orange-300 decoration-2 underline-offset-4 transition hover:text-[var(--mp-chocolate)]"
              >
                Explore more properties
              </button>
            </div>
          ) : null}
        </div>
        ) : null}
      </section>

      {/* How */}
      <section id="how" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SimpleProcessHeader />
        </Reveal>
        <CartoonCrosswalkLane />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {[
            {
              n: '01',
              title: 'Explore',
              kicker: 'Browse handpicked homes',
              body: 'Browse handpicked homes and real room-level detail. Every space photographed, every corner documented.',
              tint: 'from-orange-50 to-amber-50/80',
              border: 'border-orange-100/80',
              iconBg: 'from-amber-400 to-orange-500',
              Icon: Search,
              kickerColor: 'text-orange-700',
              watermark: 'text-orange-200/90',
            },
            {
              n: '02',
              title: 'Visit',
              kicker: 'Book on your terms',
              body: 'Book a slot that fits you — walkthroughs on your terms. Flexible scheduling, personalized tours.',
              tint: 'from-emerald-50 to-teal-50/70',
              border: 'border-emerald-100/80',
              iconBg: 'from-emerald-400 to-teal-500',
              Icon: Calendar,
              kickerColor: 'text-teal-700',
              watermark: 'text-emerald-200/90',
            },
            {
              n: '03',
              title: 'Move in',
              kicker: 'We handle the rest',
              body: 'Pack your bag; utilities and upkeep are on us. Zero hassle, complete peace of mind.',
              tint: 'from-violet-50 to-indigo-50/70',
              border: 'border-violet-100/80',
              iconBg: 'from-indigo-400 to-violet-600',
              Icon: Home,
              kickerColor: 'text-indigo-700',
              watermark: 'text-violet-200/90',
            },
          ].map((step, i) => (
            <Reveal key={step.n} delayMs={i * 100}>
              <article
                className={`relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 shadow-[0_16px_50px_-28px_rgba(40,35,30,0.18)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_55px_-24px_rgba(40,35,30,0.22)] ${step.border} ${step.tint}`}
              >
                <span
                  className={`pointer-events-none absolute -right-2 -top-6 font-serif text-[7rem] font-semibold leading-none ${step.watermark}`}
                  aria-hidden
                >
                  {step.n}
                </span>
                <div
                  className={`relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${step.iconBg}`}
                >
                  <step.Icon className="size-6 text-white" aria-hidden />
                </div>
                <div className="relative mt-6 flex items-start justify-between gap-3">
                  <h3 className="font-serif text-2xl font-semibold text-stone-900">{step.title}</h3>
                  <ArrowRight className="mt-1 size-5 shrink-0 text-stone-400" aria-hidden />
                </div>
                <p className={`relative mt-2 text-[10px] font-bold uppercase tracking-widest ${step.kickerColor}`}>
                  {step.kicker}
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-[var(--mp-muted)]">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CommunitySection />

      {/* Stats */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,oklch(0.93_0.06_58/0.45),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/2 size-[22rem] -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 top-1/4 size-72 rounded-full bg-amber-200/35 blur-3xl"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-orange-900/45">By the numbers</p>
            <h2 className="mt-3 text-center font-serif text-2xl font-semibold tracking-tight text-[var(--mp-chocolate)] sm:text-3xl">
              Aurova in a snapshot
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {STATS.map((s, i) => {
              const hovered = statHover === s.id
              const Icon =
                s.icon === 'users' ? Users : s.icon === 'map' ? MapPin : s.icon === 'trend' ? TrendingUp : Award
              const accent = STAT_CARD_ACCENTS[i % STAT_CARD_ACCENTS.length]
              return (
                <Reveal key={s.id} delayMs={i * 70}>
                  <button
                    type="button"
                    onMouseEnter={() => setStatHover(s.id)}
                    onMouseLeave={() => setStatHover(null)}
                    className={`group/stat relative w-full overflow-hidden rounded-3xl border p-6 pb-7 text-left shadow-[0_14px_40px_-28px_rgba(55,40,25,0.18)] transition-all duration-500 ease-out motion-reduce:transition-none ${
                      hovered
                        ? `${accent.hoverBorder} ${accent.hoverBg} -translate-y-1.5 shadow-[0_22px_50px_-20px_rgba(55,35,20,0.22)] ring-2 ${accent.hoverRing} motion-reduce:translate-y-0`
                        : 'border-orange-950/10 bg-white/85 ring-0 backdrop-blur-sm hover:border-orange-200/60'
                    }`}
                  >
                    <svg className="absolute -right-6 -top-6 size-36 text-orange-950/[0.04]" aria-hidden>
                      <defs>
                        <pattern id={`stat-grid-${s.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#stat-grid-${s.id})`} />
                    </svg>
                    <span
                      className={`pointer-events-none absolute -bottom-8 -right-3 max-w-[min(100%,9rem)] select-none truncate text-left font-serif text-[3.75rem] font-bold leading-none tracking-tighter tabular-nums sm:text-[4.25rem] ${accent.watermark}`}
                      aria-hidden
                    >
                      {s.value}
                    </span>
                    <div
                      className={`relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ring-1 ring-white/50 transition-transform duration-500 ease-out group-hover/stat:scale-105 motion-reduce:group-hover/stat:scale-100 ${accent.iconGrad}`}
                    >
                      <Icon className="size-6 text-white drop-shadow-sm" aria-hidden />
                    </div>
                    <p className="relative mt-5 font-serif text-3xl font-semibold tabular-nums tracking-tight text-stone-900 sm:text-[2rem]">
                      {s.value}
                    </p>
                    <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--mp-muted)]">
                      {s.label}
                    </p>
                    <span
                      className={`pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-90 transition-opacity duration-500 ${accent.bar} ${hovered ? 'opacity-100' : 'opacity-70'}`}
                      aria-hidden
                    />
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Notes from the creators — warm textured brown */}
      <section
        id="about"
        className="marketing-creators-section relative scroll-mt-24 overflow-hidden border-t border-orange-950/12 px-4 py-20 sm:px-6 sm:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,oklch(1_0_0/0.22),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-px w-[min(90%,42rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-800/15 to-transparent"
          aria-hidden
        />

        <div className="relative z-[1] mx-auto max-w-5xl text-[var(--mp-chocolate)]">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-amber-800/25 bg-white/55 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-amber-950/75 shadow-sm backdrop-blur-[2px]">
                Notes from the creators
              </span>
              <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight tracking-tight text-[var(--mp-chocolate)] md:text-5xl lg:text-[2.85rem]">
                Why we built{' '}
                <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Aurova
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[var(--mp-muted)] md:text-base">
                We believe finding a home should be exciting, not exhausting.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:mt-16 md:grid-cols-2">
            {CREATOR_NOTES_CARDS.map((card, i) => (
              <Reveal key={card.title} delayMs={i * 90}>
                <article
                  className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-[0_22px_50px_-28px_rgba(60,40,25,0.18)] ring-1 ring-white/70 transition duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-gradient-to-br before:from-white/55 before:via-transparent before:to-transparent before:opacity-95 before:content-[''] hover:-translate-y-1 hover:shadow-[0_28px_60px_-26px_rgba(60,40,25,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${card.border} ${card.cardBg}`}
                >
                  <div
                    className={`pointer-events-none absolute right-5 top-5 z-[1] size-14 border-t-2 border-r-2 opacity-80 ${card.corner}`}
                  />
                  <div
                    className={`relative z-[1] flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-1 ring-black/5 ${card.grad}`}
                  >
                    <card.icon className="size-5 text-white drop-shadow-sm" aria-hidden />
                  </div>
                  <h3 className="relative z-[1] mt-6 font-serif text-2xl font-semibold tracking-tight text-stone-900">{card.title}</h3>
                  <p className="relative z-[1] mt-3 text-sm leading-relaxed text-stone-600">{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={200}>
            <blockquote className="mx-auto mt-16 max-w-3xl px-2 text-center sm:mt-20">
              <div
                className="mx-auto mb-8 h-0.5 w-14 rounded-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 shadow-[0_0_20px_rgba(180,83,9,0.35)]"
                aria-hidden
              />
              <p className="font-serif text-2xl font-medium italic leading-snug text-stone-800 sm:text-3xl md:text-[2rem] md:leading-snug">
                Home is not just a place, it&apos;s a{' '}
                <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text font-semibold not-italic text-transparent">
                  feeling
                </span>
                . We&apos;re here to help you find both.
              </p>
              <footer className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-900/55">
                — The Aurova team
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA */}
      <section className="px-4 pb-6 pt-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-stone-900 px-8 py-12 text-center text-white shadow-2xl sm:px-12">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Ready when you are</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
              Tell us your neighbourhood and budget — we&apos;ll shortlist homes that match your vibe.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-stone-900 transition hover:scale-[1.02]"
            >
              Chat on WhatsApp
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--mp-line)] bg-[var(--mp-cream-deep)]/40 px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex size-10 items-center justify-center rounded-full border border-[var(--mp-line)] bg-white shadow-sm">
              <span className="font-serif text-lg font-bold">A</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--mp-muted)]">
              Flexible living made easy. Discover curated homes with all the amenities you need, without the hassle.
            </p>
            <ul className="space-y-3 text-sm text-[var(--mp-muted)]">
              <li>
                <a href="mailto:hello@aurova.in" className="flex items-center gap-2 transition hover:text-stone-900">
                  <Mail className="size-4 shrink-0" aria-hidden />
                  hello@aurova.in
                </a>
              </li>
              <li>
                <a href={PHONE_TEL} className="flex items-center gap-2 transition hover:text-stone-900">
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  Bangalore, India
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--mp-muted)]">
              {['About us', 'Careers', 'Press', 'Blog'].map((x) => (
                <li key={x}>
                  <a href="#" className="transition hover:text-stone-900">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Support</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--mp-muted)]">
              {['Help center', 'Contact us', 'FAQs', 'Terms of service'].map((x) => (
                <li key={x}>
                  <a href="#" className="transition hover:text-stone-900">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Properties</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--mp-muted)]">
              {['Bangalore', 'Mumbai', 'Delhi', 'View all cities'].map((x) => (
                <li key={x}>
                  <a href={x === 'Bangalore' ? '#properties' : '#'} className="transition hover:text-stone-900">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-[var(--mp-line)] pt-8 md:flex-row">
          <p className="text-xs text-[var(--mp-muted)]">© {new Date().getFullYear()} Aurova. All rights reserved.</p>
          <div className="flex gap-2">
            <a
              href="#"
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--mp-line)] bg-white text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="#"
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--mp-line)] bg-white text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
              aria-label="Twitter"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="#"
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--mp-line)] bg-white text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
