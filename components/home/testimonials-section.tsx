'use client'

import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, MessageSquareQuote, Sparkles, Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/home-marketing-data'
import { Reveal } from '@/components/home/reveal'

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

const ACCENTS = [
  { bar: 'from-amber-500 to-orange-500', blob: 'bg-amber-400/30', ring: 'ring-amber-400/35', quote: 'text-amber-600/20' },
  { bar: 'from-rose-500 to-fuchsia-600', blob: 'bg-rose-400/25', ring: 'ring-rose-400/35', quote: 'text-rose-500/18' },
  { bar: 'from-teal-500 to-emerald-600', blob: 'bg-teal-400/25', ring: 'ring-teal-400/35', quote: 'text-teal-600/18' },
  { bar: 'from-violet-500 to-indigo-600', blob: 'bg-violet-400/25', ring: 'ring-violet-400/35', quote: 'text-violet-600/18' },
] as const

export function TestimonialsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const scrollToCard = useCallback((index: number) => {
    const id = TESTIMONIALS[index]?.id
    if (!id) return
    document.getElementById(`testimonial-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    setCarouselIndex(index)
  }, [])

  const next = useCallback(() => {
    scrollToCard((carouselIndex + 1) % TESTIMONIALS.length)
  }, [carouselIndex, scrollToCard])

  const prev = useCallback(() => {
    scrollToCard((carouselIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [carouselIndex, scrollToCard])

  const toggleExpand = (id: string) => {
    setExpandedId((cur) => (cur === id ? null : id))
  }

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden border-t border-orange-950/10 bg-gradient-to-b from-orange-50/40 via-[var(--mp-cream)] to-[var(--mp-cream-deep)]/30 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.95_0.05_58/0.5),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 size-80 rounded-full bg-orange-200/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-20 size-64 rounded-full bg-amber-100/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-gradient-to-b from-white to-orange-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-900/65 shadow-md shadow-orange-900/10 ring-1 ring-white/80">
              <Sparkles className="size-3.5 shrink-0 text-orange-500" aria-hidden />
              Testimonials
            </span>
            <h2 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[var(--mp-chocolate)] md:text-5xl">
              Loved by{' '}
              <span className="marketing-gradient-accent">residents</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--mp-muted)] md:text-base">
              Hear from people who found their perfect home with Aurova.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-3 flex items-center justify-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={prev}
            className="inline-flex size-10 items-center justify-center rounded-full border border-orange-950/10 bg-white/90 text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/90"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  carouselIndex === i ? 'w-8 bg-gradient-to-r from-amber-500 to-orange-500' : 'w-2 bg-stone-300/90 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={next}
            className="inline-flex size-10 items-center justify-center rounded-full border border-orange-950/10 bg-white/90 text-[var(--mp-chocolate)] shadow-sm transition hover:border-orange-300 hover:bg-orange-50/90"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>

        <div
          className="mx-auto mt-8 flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-12 lg:grid lg:snap-none lg:grid-cols-2 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TESTIMONIALS.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length]
            const isExpanded = expandedId === t.id
            const dimOthers = expandedId != null && expandedId !== t.id

            return (
              <Reveal key={t.id} delayMs={i * 70} className="min-w-[min(100%,20rem)] shrink-0 snap-center lg:min-w-0">
                <div
                  id={`testimonial-${t.id}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpand(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleExpand(t.id)
                    }
                  }}
                  className={`group/test relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border bg-white/90 p-6 text-left shadow-[0_18px_50px_-30px_rgba(50,35,25,0.2)] ring-1 ring-orange-950/[0.06] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 motion-reduce:transition-none lg:min-h-[280px] ${
                    isExpanded
                      ? `z-[1] scale-[1.01] shadow-[0_28px_60px_-24px_rgba(55,35,20,0.28)] ring-2 ${accent.ring}`
                      : 'hover:-translate-y-1 hover:shadow-[0_24px_55px_-26px_rgba(55,35,20,0.22)] motion-reduce:hover:translate-y-0'
                  } ${dimOthers ? 'opacity-[0.88]' : ''}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-10 font-serif text-[7rem] font-bold leading-none ${accent.quote}`}
                    aria-hidden
                  >
                    &ldquo;
                  </div>
                  <div
                    className={`pointer-events-none absolute -left-10 bottom-0 size-40 rounded-full blur-2xl ${accent.blob}`}
                    aria-hidden
                  />
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`} aria-hidden />

                  <div className="relative flex items-start justify-between gap-3">
                    <StarRow n={t.rating} />
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700/80 ring-1 ring-orange-200/60 transition duration-500 group-hover/test:scale-105 group-hover/test:bg-orange-100 motion-reduce:group-hover/test:scale-100">
                      <MessageSquareQuote className="size-5" aria-hidden />
                    </span>
                  </div>

                  <p
                    className={`relative mt-5 flex-1 text-[15px] leading-relaxed text-stone-700 transition-[max-height] duration-500 motion-reduce:transition-none ${
                      isExpanded ? 'line-clamp-none' : 'line-clamp-4 lg:line-clamp-4'
                    }`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="relative mt-6 flex items-center gap-3 border-t border-orange-950/10 pt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt=""
                      className="size-12 rounded-full object-cover ring-2 ring-white shadow-md transition duration-500 group-hover/test:ring-amber-200/80"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900">{t.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-[var(--mp-muted)]">
                        <span>{t.role}</span>
                        <span className="text-stone-300">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" aria-hidden />
                          {t.meta}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
