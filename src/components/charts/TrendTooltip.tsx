import { formatDate } from '../../lib/format'

export interface TrendPoint {
  n: number
  date: string
  score: number
  max: number
}

interface Props {
  active?: boolean
  payload?: { payload: TrendPoint }[]
}

/** Recharts tooltip content: Recharts injects `active` and `payload`. */
export default function TrendTooltip({ active, payload }: Props) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="rounded-lg border border-paper-deep bg-white px-3 py-2 text-sm shadow-[0_6px_16px_rgb(14_34_64/0.14)]">
      <p className="font-semibold">Examen {point.n}</p>
      <p className="text-ink-muted">{formatDate(point.date)}</p>
      <p className="mt-1 font-display text-base font-bold tabular-nums">
        {point.score}/{point.max}
      </p>
    </div>
  )
}
