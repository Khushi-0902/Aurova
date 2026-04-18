'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger children in a grid by passing ms */
  delayMs?: number
}

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.visible = 'true'
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = 'true'
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-visible="false"
      className={cn(
        'opacity-0 translate-y-8 blur-[3px]',
        'data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:blur-none',
        'motion-reduce:translate-y-0 motion-reduce:blur-none motion-reduce:opacity-100',
        'transition-[opacity,transform,filter] duration-[780ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
