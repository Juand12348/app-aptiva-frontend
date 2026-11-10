import { Link } from 'react-router-dom'
import type { ExamHistoryItem } from '../../api/types'
import { formatDate, formatDuration, percent, SCORE_BAND_PILL, scoreBand } from '../../lib/format'

const SHORT: Record<string, string> = { 'Cálculo y Álgebra': 'Cálculo', Estadística: 'Estadística', Geometría: 'Geometría' }

/** Newest first, as the API sends them; each exam keeps its chronological number. */
export default function HistoryList({ items }: { items: ExamHistoryItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => {
        const number = items.length - i
        const pct = percent(item.total_score, item.max_score)
        return (
          <li key={item.exam_id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
            <Link
              to={`/resultado/${item.exam_id}`}
              className="group flex flex-col gap-4 rounded-2xl border-[5px] border-white bg-white p-4 shadow-[0_8px_22px_rgb(14_34_64/0.1)] ring-2 ring-navy transition duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(14_34_64/0.16)] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
            >
              <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-12 shrink-0 -rotate-3 place-items-center rounded-xl bg-navy font-display text-xl font-extrabold text-white tabular-nums transition-transform duration-300 group-hover:rotate-2"
                >
                  {number}
                </span>
                <div>
                  <p className="font-display text-3xl leading-none font-extrabold tabular-nums">
                    {item.total_score}
                    <span className="text-lg text-ink-muted">/{item.max_score}</span>
                    <span className={`ml-2 rounded-full px-2 py-0.5 align-middle text-sm ${SCORE_BAND_PILL[scoreBand(pct)]}`}>
                      {pct} %
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    <span className="sr-only">Examen {number}, presentado el </span>
                    {formatDate(item.finished_at)} ·{' '}
                    <span className="whitespace-nowrap">{formatDuration(item.started_at, item.finished_at)}</span>
                  </p>
                </div>
              </div>

              <ul className="grid flex-1 grid-cols-3 gap-2" aria-label="Puntaje por componente">
                {item.components.map((c) => (
                  <li key={c.component} className="rounded-lg bg-paper px-2 py-2 text-center">
                    <span className="block truncate text-xs font-semibold text-ink-muted" title={c.component}>
                      {SHORT[c.component] ?? c.component}
                    </span>
                    <span className="font-display text-lg font-bold tabular-nums">
                      {c.score}
                      <span className="text-sm text-ink-muted">/{c.max_score}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 sm:w-36 sm:shrink-0 sm:flex-col sm:items-end">
                {!item.has_diagnosis ? (
                  <span className="rounded-full border border-amber-ink/40 bg-amber-tint px-2.5 py-1 text-xs font-bold text-amber-ink">
                    Sin diagnóstico
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-sm font-semibold text-navy underline decoration-emerald decoration-2 underline-offset-4">
                  Ver resultado
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
