import { useEffect, useState } from 'react'
import { msLeft, type SavedExam } from './examStorage'

/** Ms left for the saved exam (0 once expired), refreshed every second. Infinity when there is no exam. */
export function useExamClock(saved: SavedExam | null) {
  const [left, setLeft] = useState(() => (saved ? Math.max(0, msLeft(saved)) : Infinity))

  const expiresAt = saved?.exam.expires_at
  const offset = saved?.clockOffset
  useEffect(() => {
    if (expiresAt === undefined || offset === undefined) return
    const tick = () => setLeft(Math.max(0, Date.parse(expiresAt) - (Date.now() + offset)))
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [expiresAt, offset])

  return left
}
