'use client'

import type { LucideIcon } from 'lucide-react'
import { Camera, Coffee, Laptop, LineChart, Music, Palette, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { DEMOGRAPHICS } from '@/lib/home-marketing-data'
import { Reveal } from '@/components/home/reveal'

type Resident = {
  name: string
  role: string
  company: string
  quote: string
  accentColor: string
  bgColor: string
  borderColor: string
  icon: LucideIcon
  illustration: ReactNode
}

const residents: Resident[] = [
  {
    name: 'Priya S.',
    role: 'UX Designer',
    company: 'Figma',
    quote: 'Found my creative tribe here',
    accentColor: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    icon: Palette,
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="35" r="18" fill="#1a1a1a" />
        <path d="M60 55 C35 55 30 85 30 100 L90 100 C90 85 85 55 60 55" fill="#1a1a1a" />
        <circle cx="53" cy="32" r="2" fill="white" />
        <circle cx="67" cy="32" r="2" fill="white" />
        <path d="M55 42 Q60 47 65 42" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <rect x="75" y="60" width="25" height="18" rx="2" fill="#c9a87c" opacity="0.6" />
        <rect x="80" y="65" width="15" height="8" rx="1" fill="white" />
        <circle cx="42" cy="25" r="8" fill="none" stroke="#c9a87c" strokeWidth="2" />
        <path d="M48 20 L55 13" stroke="#c9a87c" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Arjun M.',
    role: 'Software Engineer',
    company: 'Google',
    quote: 'The community events are amazing',
    accentColor: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    icon: Laptop,
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="35" r="18" fill="#1a1a1a" />
        <path d="M60 55 C35 55 30 85 30 100 L90 100 C90 85 85 55 60 55" fill="#1a1a1a" />
        <circle cx="53" cy="32" r="2" fill="white" />
        <circle cx="67" cy="32" r="2" fill="white" />
        <rect x="25" y="70" width="35" height="25" rx="2" fill="#374151" />
        <rect x="28" y="73" width="29" height="17" rx="1" fill="#60a5fa" />
        <rect x="30" y="95" width="25" height="3" rx="1" fill="#374151" />
        <path d="M70 65 L75 60" stroke="#c9a87c" strokeWidth="2" />
        <circle cx="78" cy="57" r="5" fill="#fbbf24" opacity="0.8" />
      </svg>
    ),
  },
  {
    name: 'Neha K.',
    role: 'Product Manager',
    company: 'Razorpay',
    quote: 'Perfect work-life balance',
    accentColor: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: LineChart,
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="35" r="18" fill="#1a1a1a" />
        <path d="M45 25 Q60 15 75 25" stroke="#1a1a1a" strokeWidth="8" fill="none" />
        <path d="M60 55 C35 55 30 85 30 100 L90 100 C90 85 85 55 60 55" fill="#1a1a1a" />
        <circle cx="53" cy="32" r="2" fill="white" />
        <circle cx="67" cy="32" r="2" fill="white" />
        <path d="M55 42 Q60 45 65 42" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <rect x="70" y="55" width="20" height="28" rx="2" fill="#374151" />
        <rect x="72" y="57" width="16" height="20" rx="1" fill="#34d399" />
        <path d="M75 70 L80 65 L85 72" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Rohan D.',
    role: 'Content Creator',
    company: 'YouTube',
    quote: 'Inspiring neighbors everywhere',
    accentColor: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Camera,
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="35" r="18" fill="#1a1a1a" />
        <path d="M60 55 C35 55 30 85 30 100 L90 100 C90 85 85 55 60 55" fill="#1a1a1a" />
        <circle cx="53" cy="32" r="2" fill="white" />
        <circle cx="67" cy="32" r="2" fill="white" />
        <path d="M52 42 L68 42" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="72" y="60" width="22" height="16" rx="3" fill="#374151" />
        <circle cx="83" cy="68" r="5" fill="#1a1a1a" />
        <circle cx="83" cy="68" r="3" fill="#60a5fa" />
        <path d="M40 50 L35 45 M80 20 L85 15 M95 40 L100 38" stroke="#c9a87c" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Aisha R.',
    role: 'Musician',
    company: 'Independent',
    quote: 'Soundproof rooms are a blessing',
    accentColor: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    icon: Music,
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="35" r="18" fill="#1a1a1a" />
        <path d="M42 30 Q60 20 78 30" stroke="#1a1a1a" strokeWidth="6" fill="none" />
        <path d="M60 55 C35 55 30 85 30 100 L90 100 C90 85 85 55 60 55" fill="#1a1a1a" />
        <circle cx="53" cy="32" r="2" fill="white" />
        <circle cx="67" cy="32" r="2" fill="white" />
        <ellipse cx="35" cy="85" rx="10" ry="12" fill="#92400e" />
        <rect x="44" y="50" width="3" height="35" fill="#92400e" />
        <path d="M47 50 L47 55 L60 52 L60 47 Z" fill="#fbbf24" />
        <path d="M80 45 Q85 40 90 45 Q85 50 80 45" fill="#c9a87c" />
        <path d="M85 55 Q90 50 95 55 Q90 60 85 55" fill="#c9a87c" />
      </svg>
    ),
  },
]

const DEMO_GRADIENTS = ['from-sky-400 to-blue-500', 'from-rose-400 to-pink-500', 'from-amber-400 to-orange-500'] as const

export function CommunitySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const totalCards = residents.length
  const middleIndex = Math.floor(totalCards / 2)

  return (
    <section className="border-y border-[var(--mp-line)]/60 bg-[var(--mp-cream-deep)]/25 px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 text-center md:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-gradient-to-b from-white to-orange-50/80 px-4 py-2 text-sm font-medium text-orange-900/80 shadow-sm ring-1 ring-white/80">
              <Users className="size-4 shrink-0 text-orange-600" aria-hidden />
              <span>Your future neighbors</span>
            </div>
            <h2 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-[var(--mp-chocolate)] md:text-5xl lg:text-6xl">
              Like-minded people,
              <br />
              <em className="font-serif not-italic text-orange-800/90">one address</em>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--mp-muted)] md:text-lg">
              At Aurova, you&apos;ll find yourself surrounded by ambitious, creative, and driven individuals who value
              both independence and connection.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Desktop: fan */}
          <div
            className="relative hidden min-h-[520px] justify-center lg:flex"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {residents.map((resident, index) => {
              const offset = index - middleIndex
              const rotation = offset * 6
              const translateX = offset * 80
              const baseZ = totalCards - Math.abs(offset)
              const isRaised = hoveredIndex === index
              const zIndex = isRaised ? 50 : baseZ
              const Icon = resident.icon

              return (
                <div
                  key={resident.name}
                  className="absolute top-8 cursor-default transition-[transform,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{
                    zIndex,
                    left: `calc(50% + ${translateX}px - 130px)`,
                    transform: isRaised
                      ? 'translateY(-28px) scale(1.07) rotate(0deg)'
                      : `translateY(0) scale(1) rotate(${rotation}deg)`,
                    filter: hoveredIndex != null && !isRaised ? 'brightness(0.97)' : undefined,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <div
                    className={`w-[260px] overflow-hidden rounded-3xl border-2 shadow-[0_24px_55px_-28px_rgba(40,35,30,0.22)] transition-shadow duration-500 ${resident.bgColor} ${resident.borderColor} ${
                      isRaised ? 'shadow-[0_32px_70px_-22px_rgba(40,35,30,0.35)] ring-2 ring-orange-200/50' : ''
                    }`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${resident.accentColor}`} />
                    <div className="flex h-44 items-center justify-center bg-white/60 p-6">
                      <div
                        className={`size-32 transition-transform duration-500 ease-out motion-reduce:transition-none ${
                          isRaised ? 'scale-110 motion-reduce:scale-100' : 'scale-100'
                        }`}
                      >
                        {resident.illustration}
                      </div>
                    </div>
                    <div className="bg-white p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${resident.accentColor}`}
                        >
                          <Icon className="size-4 text-white" aria-hidden />
                        </div>
                        <span className="text-sm font-bold text-[var(--mp-chocolate)]">{resident.role}</span>
                      </div>
                      <p className="mb-3 text-sm italic leading-snug text-[var(--mp-muted)]">&ldquo;{resident.quote}&rdquo;</p>
                      <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                        <span className="font-medium text-stone-600">{resident.name}</span>
                        <span className="text-sm font-bold tracking-wide text-stone-900">{resident.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="pb-2 lg:hidden">
            <div
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {residents.map((resident) => {
                const Icon = resident.icon
                return (
                  <div key={resident.name} className="w-[240px] shrink-0">
                    <div
                      className={`overflow-hidden rounded-2xl border-2 shadow-lg ${resident.bgColor} ${resident.borderColor}`}
                    >
                      <div className={`h-1.5 bg-gradient-to-r ${resident.accentColor}`} />
                      <div className="flex h-36 items-center justify-center bg-white/60 p-4">
                        <div className="size-24">{resident.illustration}</div>
                      </div>
                      <div className="bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className={`flex size-7 items-center justify-center rounded-lg bg-gradient-to-br ${resident.accentColor}`}
                          >
                            <Icon className="size-3.5 text-white" aria-hidden />
                          </div>
                          <span className="text-sm font-bold text-[var(--mp-chocolate)]">{resident.role}</span>
                        </div>
                        <p className="mb-2 text-xs italic leading-snug text-[var(--mp-muted)]">&ldquo;{resident.quote}&rdquo;</p>
                        <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                          <span className="text-xs text-stone-600">{resident.name}</span>
                          <span className="text-xs font-bold text-stone-900">{resident.company}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Reveal delayMs={120}>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4 md:mt-20">
            {DEMOGRAPHICS.map((d, i) => (
              <div
                key={d.label}
                className="rounded-2xl border border-orange-200/30 bg-white/60 p-3 text-center shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none sm:p-4"
              >
                <p
                  className={`bg-gradient-to-r ${DEMO_GRADIENTS[i] ?? 'from-stone-500 to-stone-700'} bg-clip-text font-serif text-2xl font-bold text-transparent sm:text-3xl`}
                >
                  {d.pct}
                </p>
                <p className="mt-1 text-[10px] font-medium leading-snug text-[var(--mp-muted)] sm:text-xs">{d.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-10 text-center md:mt-12">
            <p className="mb-4 text-sm text-[var(--mp-muted)]">Join a community that matches your vibe.</p>
            <a
              href="#reviews"
              className="marketing-btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg shadow-orange-900/15 transition hover:brightness-[1.06] active:brightness-[0.98]"
            >
              <Coffee className="size-4 shrink-0" aria-hidden />
              Meet our residents
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
