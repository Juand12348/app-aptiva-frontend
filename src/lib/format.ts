const dateParts = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function parts(iso: string) {
  const list = dateParts.formatToParts(new Date(iso))
  const get = (type: Intl.DateTimeFormatPartTypes) => list.find((p) => p.type === type)?.value ?? ''
  return { day: get('day'), month: get('month').replace('.', ''), year: get('year'), hour: get('hour'), minute: get('minute') }
}

/** "06 nov 2026, 16:41". Backend dates are UTC ISO strings; the browser renders them in local time. */
export function formatDate(iso: string) {
  const p = parts(iso)
  return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute}`
}

/** "06 nov", for chart axes. */
export function formatShortDate(iso: string) {
  const p = parts(iso)
  return `${p.day} ${p.month}`
}

/** "21 min", or "menos de 1 min". */
export function formatDuration(startIso: string, endIso: string) {
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60_000)
  return minutes < 1 ? 'menos de 1 min' : `${minutes} min`
}

/** "59:07", or "1:00:00" from one hour up. */
export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = String(Math.floor((total % 3600) / 60)).padStart(h > 0 ? 2 : 1, '0')
  const s = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
}

/** "6,5": at most one decimal, comma as in the rest of the UI. */
export const formatDecimal = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 })

export const percent = (score: number, max: number) => (max > 0 ? Math.round((score / max) * 100) : 0)

export type ScoreBand = 'low' | 'mid' | 'high'

/** <50 % low, 50–75 % mid, >75 % high. */
export const scoreBand = (pct: number): ScoreBand => (pct > 75 ? 'high' : pct >= 50 ? 'mid' : 'low')

export const SCORE_BAND_PILL: Record<ScoreBand, string> = {
  high: 'bg-emerald text-navy',
  mid: 'bg-amber-tint text-amber-ink',
  low: 'bg-danger-tint text-danger',
}
