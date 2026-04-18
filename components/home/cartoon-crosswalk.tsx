/**
 * Decorative mascot — crosses the lane left → right on a loop.
 * Marked aria-hidden; motion respects prefers-reduced-motion in CSS.
 */
export function CartoonCrosswalkLane() {
  return (
    <div
      className="marketing-cartoon-track relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-full border border-dashed border-orange-300/60 bg-gradient-to-r from-orange-50/30 via-amber-50/50 to-orange-50/30 py-1 shadow-[inset_0_1px_0_oklch(1_0_0/0.5)]"
      aria-hidden
    >
      <div className="marketing-cartoon-racer pointer-events-none">
        <div className="marketing-cartoon-bob-swing">
          <svg
            className="marketing-cartoon-svg h-[4.25rem] w-auto drop-shadow-[0_4px_8px_rgba(90,50,20,0.15)]"
            viewBox="0 0 96 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="48" cy="96" rx="22" ry="5" fill="oklch(0.35 0.04 48 / 0.12)" />
            <g className="marketing-cartoon-legs">
              <ellipse cx="36" cy="78" rx="9" ry="14" fill="oklch(0.42 0.12 48)" transform="rotate(-8 36 78)" />
              <ellipse cx="60" cy="78" rx="9" ry="14" fill="oklch(0.42 0.12 48)" transform="rotate(8 60 78)" />
            </g>
            <ellipse cx="48" cy="58" rx="34" ry="30" fill="oklch(0.72 0.16 58)" stroke="oklch(0.32 0.05 48)" strokeWidth="2" />
            <circle cx="48" cy="32" r="26" fill="oklch(0.78 0.14 58)" stroke="oklch(0.32 0.05 48)" strokeWidth="2" />
            <ellipse cx="40" cy="30" rx="7" ry="9" fill="white" stroke="oklch(0.32 0.05 48)" strokeWidth="1.2" />
            <ellipse cx="56" cy="30" rx="7" ry="9" fill="white" stroke="oklch(0.32 0.05 48)" strokeWidth="1.2" />
            <circle cx="43" cy="31" r="3.5" fill="oklch(0.28 0.04 48)" />
            <circle cx="59" cy="31" r="3.5" fill="oklch(0.28 0.04 48)" />
            <circle cx="44" cy="29" r="1.2" fill="white" opacity="0.9" />
            <circle cx="60" cy="29" r="1.2" fill="white" opacity="0.9" />
            <path
              d="M38 44 Q48 52 58 44"
              stroke="oklch(0.32 0.05 48)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="32" cy="38" r="4" fill="oklch(0.85 0.12 25 / 0.55)" />
            <circle cx="64" cy="38" r="4" fill="oklch(0.85 0.12 25 / 0.55)" />
            <g className="marketing-cartoon-arm">
              <path
                d="M22 48 Q12 28 18 14"
                stroke="oklch(0.42 0.12 48)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="18" cy="12" r="7" fill="oklch(0.78 0.14 58)" stroke="oklch(0.32 0.05 48)" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
