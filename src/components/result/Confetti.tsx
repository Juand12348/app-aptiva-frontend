import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'

const COLORS = ['bg-emerald', 'bg-white', 'bg-data', 'bg-paper-deep']
// Deterministic spread (render must stay pure): pieces land across the width at staggered times.
const PIECES = Array.from({ length: 32 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 53) % 1100,
  duration: 2400 + ((i * 71) % 1200),
  spin: `${((i * 47) % 2 ? 1 : -1) * (240 + ((i * 29) % 300))}deg`,
  color: COLORS[i % COLORS.length],
}))

/** A one-time shower of mini stickers for a genuinely good result. */
export default function Confetti() {
  // Portal to <body> so `fixed` means the viewport, not the transformed <main>.
  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`absolute -top-6 h-4 w-3 rounded-[3px] shadow-[0_2px_4px_rgb(14_34_64/0.2)] ${p.color}`}
          style={
            {
              left: `${p.left}%`,
              '--spin': p.spin,
              animation: `fall ${p.duration}ms cubic-bezier(0.3, 0.6, 0.5, 1) ${p.delay}ms both`,
            } as CSSProperties
          }
        />
      ))}
    </div>,
    document.body,
  )
}
