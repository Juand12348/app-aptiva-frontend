import type { ComponentStats } from '../../api/types'
import { COMPONENT_NOTES, DIFFICULTY_ORDER } from '../../lib/constants'
import { formatDecimal, percent } from '../../lib/format'
import AccuracyBars from '../charts/AccuracyBars'

export default function ComponentStatsCard({ stats }: { stats: ComponentStats }) {
  return (
    <article className="rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy">
      <h3 className="text-lg font-extrabold">{stats.component}</h3>
      <p className="text-sm text-ink-muted">{COMPONENT_NOTES[stats.component]}</p>

      <p className="mt-4 font-display text-4xl leading-none font-extrabold tabular-nums">
        {formatDecimal(stats.average_score)}
        <span className="text-xl text-ink-muted">/{stats.max_score}</span>
        <span className="ml-2 text-sm font-bold text-ink-muted">promedio</span>
      </p>
      <div
        role="img"
        aria-label={`Promedio: ${formatDecimal(stats.average_score)} de ${stats.max_score}`}
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-paper"
      >
        <div
          className="h-full origin-left animate-[grow_0.9s_var(--ease-out-expo)_both] rounded-full bg-emerald"
          style={{ width: `${percent(stats.average_score, stats.max_score)}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Último examen:{' '}
        <strong className="text-navy tabular-nums">
          {stats.latest_score}/{stats.max_score}
        </strong>
      </p>

      <h4 className="mt-5 mb-3 font-display text-sm font-bold">Aciertos por dificultad</h4>
      <AccuracyBars buckets={stats.by_difficulty} order={DIFFICULTY_ORDER} />
    </article>
  )
}
