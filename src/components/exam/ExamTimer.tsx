import { formatCountdown } from '../../lib/format'

export const WARN_MS = 10 * 60_000
export const URGENT_MS = 60_000

/** Countdown pill: calm on navy, amber under 10 min, red and pulsing under 1 min. */
export default function ExamTimer({ left }: { left: number }) {
  const tone =
    left <= URGENT_MS
      ? 'animate-pulse bg-danger-tint text-danger'
      : left <= WARN_MS
        ? 'bg-amber-tint text-amber-ink'
        : 'bg-white/15 text-white'

  return (
    // role="timer" is not announced every second; the warnings are announced by the Alert banners.
    <div
      role="timer"
      aria-label="Tiempo restante"
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-lg font-extrabold tabular-nums transition-colors duration-500 ${tone}`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="10" cy="11" r="6.5" />
        <path d="M10 8v3.5l2 1.5M8 2.5h4" />
      </svg>
      {formatCountdown(left)}
    </div>
  )
}
