const dateFormat = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Backend dates are UTC ISO strings; the browser renders them in local time. */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

export const percent = (score: number, max: number) => (max > 0 ? Math.round((score / max) * 100) : 0)

export type ScoreBand = 'low' | 'mid' | 'high'

/** <50 % low, 50–75 % mid, >75 % high. */
export const scoreBand = (pct: number): ScoreBand => (pct > 75 ? 'high' : pct >= 50 ? 'mid' : 'low')
