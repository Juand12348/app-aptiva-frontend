import type { ComponentScore } from '../../api/types'

interface Props {
  active?: boolean
  payload?: { payload: ComponentScore }[]
}

/** Recharts tooltip content: Recharts injects `active` and `payload`. */
export default function ScoreTooltip({ active, payload }: Props) {
  const item = payload?.[0]?.payload
  if (!active || !item) return null
  return (
    <div className="rounded-lg border border-paper-deep bg-white px-3 py-2 text-sm shadow-[0_6px_16px_rgb(14_34_64/0.14)]">
      <p className="font-semibold">{item.component}</p>
      <p className="text-ink-muted tabular-nums">
        {item.score} de {item.max_score} puntos
      </p>
    </div>
  )
}
