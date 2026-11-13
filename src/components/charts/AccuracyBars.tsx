import type { AccuracyBucket } from '../../api/types'
import { percent } from '../../lib/format'

interface Props {
  buckets: AccuracyBucket[]
  /** Labels in the order to show them; buckets not listed go last. */
  order?: string[]
  /** Turns an API label into display text. */
  format?: (label: string) => string
}

/** One proportion bar per bucket (correct of total). Proportion, not count: totals change every exam. */
export default function AccuracyBars({ buckets, order = [], format = (l) => l }: Props) {
  const rank = (label: string) => (order.includes(label) ? order.indexOf(label) : order.length)
  const rows = buckets.filter((b) => b.total > 0).sort((a, b) => rank(a.label) - rank(b.label))

  return (
    <ul className="space-y-3">
      {rows.map((b) => (
        <li key={b.label}>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{format(b.label)}</span>
            <span className="text-ink-muted tabular-nums">
              {percent(b.correct, b.total)} % · {b.correct} de {b.total}
            </span>
          </div>
          <div
            role="img"
            aria-label={`${format(b.label)}: ${b.correct} de ${b.total} correctas`}
            className="mt-1 h-2.5 overflow-hidden rounded-full bg-paper"
          >
            <div
              className="h-full origin-left animate-[grow_0.9s_var(--ease-out-expo)_both] rounded-full bg-data"
              style={{ width: `${percent(b.correct, b.total)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
