import { useEffect, useState } from 'react'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts from 0 to `target` with an ease-out; jumps straight to it under reduced motion. */
export function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(() => (reducedMotion() ? target : 0))

  useEffect(() => {
    if (reducedMotion()) return
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 4))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])

  return value
}
