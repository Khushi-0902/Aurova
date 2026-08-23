'use client'

import { useState } from 'react'
import { CalendarClock, Film, Gamepad2, DoorOpen, Sparkles, X, type LucideIcon } from 'lucide-react'
import type { EventKind, PropertyEvent } from '@/lib/data/content'
import { WHATSAPP_URL } from '@/lib/contact'

const KIND_STYLE: Record<EventKind, { Icon: LucideIcon; wrap: string; badge: string }> = {
  movie: { Icon: Film, wrap: 'bg-violet-50 text-violet-700', badge: 'bg-violet-50 text-violet-800' },
  gaming: { Icon: Gamepad2, wrap: 'bg-sky-50 text-sky-700', badge: 'bg-sky-50 text-sky-800' },
  tour: { Icon: DoorOpen, wrap: 'bg-emerald-50 text-emerald-700', badge: 'bg-emerald-50 text-emerald-800' },
  other: { Icon: Sparkles, wrap: 'bg-amber-50 text-amber-700', badge: 'bg-amber-50 text-amber-800' },
}

export function formatEventTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

function whatsappLink(propertyName: string, ev: PropertyEvent): string {
  const when = formatEventTime(ev.startsAt)
  const feePart = ev.feeInr > 0 ? ` (₹${ev.feeInr})` : ' (free tour)'
  const msg = `Hi Aurova! I'd like to attend "${ev.title}"${feePart} at ${propertyName} on ${when}.`
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`
}

type EventsButtonProps = {
  propertyName: string
  events: PropertyEvent[]
  label?: string
  className?: string
}

export function EventsButton({ propertyName, events, label = 'More', className }: EventsButtonProps) {
  const [open, setOpen] = useState(false)
  if (events.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className={
          className ??
          'inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-orange-950/15 bg-white px-4 py-2 text-sm font-semibold text-[var(--mp-chocolate)] transition hover:border-orange-300 hover:bg-orange-50/80'
        }
      >
        {label}
        <CalendarClock className="size-4 shrink-0" aria-hidden />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-stone-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Live events at ${propertyName}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(false)
          }}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-orange-950/10 bg-white/95 px-5 py-4 backdrop-blur">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--mp-chocolate)]">{propertyName}</h3>
                <p className="mt-0.5 text-xs text-stone-500">Live at the house — experience it before it opens</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="divide-y divide-orange-950/10 px-5">
              {events.map((ev) => {
                const style = KIND_STYLE[ev.kind] ?? KIND_STYLE.other
                const free = ev.feeInr <= 0
                return (
                  <li key={ev.id} className="flex gap-3 py-4">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style.wrap}`}>
                      <style.Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold text-stone-900">{ev.title}</span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${free ? 'bg-emerald-50 text-emerald-800' : style.badge}`}
                        >
                          {free ? 'Free' : `₹${ev.feeInr}`}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                        <CalendarClock className="size-3.5 shrink-0" aria-hidden />
                        {formatEventTime(ev.startsAt)}
                      </p>
                      {ev.description ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{ev.description}</p>
                      ) : null}
                      <a
                        href={whatsappLink(propertyName, ev)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--mp-chocolate)] px-4 py-1.5 text-xs font-semibold text-[var(--mp-cream)] transition hover:brightness-110"
                      >
                        {free ? 'Book free tour' : 'Attend on WhatsApp'}
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>

            <p className="px-5 pb-5 pt-1 text-center text-xs text-stone-400">
              Booking confirms over WhatsApp. Meet future flatmates and experience the space.
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
