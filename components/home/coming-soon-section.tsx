import { Film, Gamepad2, DoorOpen, MapPin, Sparkles, CalendarClock, type LucideIcon } from 'lucide-react'
import type { ComingSoonCard, EventKind, PropertyEvent } from '@/lib/data/content'
import { EventsButton, formatEventTime } from '@/components/home/events-modal'

export type ComingSoonItem = ComingSoonCard & { events: PropertyEvent[] }

const KIND_ICON: Record<EventKind, LucideIcon> = {
  movie: Film,
  gaming: Gamepad2,
  tour: DoorOpen,
  other: Sparkles,
}

// Events arrive already filtered to upcoming and sorted earliest-first by the
// server, so the soonest one is simply the first. (No wall-clock check here —
// this component is server-rendered then hydrated, and Date.now() during render
// would risk a hydration mismatch.)
function nextEvent(events: PropertyEvent[]): PropertyEvent | undefined {
  return events[0]
}

export function ComingSoonSection({ items }: { items: ComingSoonItem[] }) {
  if (items.length === 0) return null

  return (
    <section
      id="coming-soon"
      className="relative scroll-mt-24 overflow-hidden border-t border-orange-950/10 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-gradient-to-b from-white to-orange-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-900/65 shadow-md shadow-orange-900/10 ring-1 ring-white/80">
          <Sparkles className="size-3.5 shrink-0 text-orange-500" aria-hidden />
          Coming soon
        </span>
        <h2 className="mt-7 font-serif text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-[var(--mp-chocolate)] md:text-5xl">
          Meet them <span className="marketing-gradient-accent">first</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--mp-muted)] md:text-base">
          Discover each home&apos;s essence at a live event before it opens — movie nights, gaming nights, and free
          tours. Tap More to see what&apos;s on.
        </p>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const ev = nextEvent(item.events)
          const NextIcon = ev ? KIND_ICON[ev.kind] ?? Sparkles : Sparkles
          return (
            <div
              key={item.slug}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_36px_-16px_rgba(40,35,30,0.2)] ring-1 ring-orange-950/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_-14px_rgba(55,35,20,0.28)]"
            >
              <div className="relative flex aspect-[16/11] flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/60 text-orange-900/60">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_1px_1px,rgba(180,83,9,0.12)_1px,transparent_0)] [background-size:16px_16px]"
                  aria-hidden
                />
                <Sparkles className="size-7" aria-hidden />
                <span className="text-xs font-medium">Photos coming soon</span>
                <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                  Coming soon
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-lg font-semibold tracking-tight text-[var(--mp-chocolate)]">
                  {item.name}
                </h3>
                {item.area ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--mp-muted)]">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {item.area}
                  </p>
                ) : null}
                {item.tagline ? (
                  <p className="mt-2 text-sm italic leading-snug text-stone-600">{item.tagline}</p>
                ) : null}

                {ev ? (
                  <p className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-[var(--mp-chocolate)]">
                    <NextIcon className="size-4 shrink-0 text-orange-600" aria-hidden />
                    <span className="text-orange-900/70">Next:</span> {ev.title} · {formatEventTime(ev.startsAt)}
                  </p>
                ) : (
                  <p className="mt-4 flex items-center gap-1.5 text-[13px] text-[var(--mp-muted)]">
                    <CalendarClock className="size-4 shrink-0" aria-hidden />
                    Events announced soon
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <EventsButton propertyName={item.name} events={item.events} label="More" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
