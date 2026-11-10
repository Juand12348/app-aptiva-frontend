import type { ComponentScore, Difficulty } from '../../api/types'
import { percent } from '../../lib/format'

// The API sends Difícil, Fácil, Medio (alphabetical); students read easy → hard.
const ORDER: Difficulty[] = ['Fácil', 'Medio', 'Difícil']

export default function DifficultyBreakdown({ components }: { components: ComponentScore[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
      {components.map((c) => {
        const rows = ORDER.map((d) => c.by_difficulty.find((b) => b.difficulty === d)).filter(
          (b): b is NonNullable<typeof b> => Boolean(b && b.total > 0),
        )
        return (
          <div key={c.component}>
            <h3 className="font-display text-base font-bold">{c.component}</h3>
            <ul className="mt-3 space-y-3">
              {rows.map((b) => (
                <li key={b.difficulty}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{b.difficulty}</span>
                    <span className="text-ink-muted tabular-nums">
                      {b.correct} de {b.total}
                    </span>
                  </div>
                  {/* Proportion, not count: the number of questions per difficulty changes every exam. */}
                  <div
                    role="img"
                    aria-label={`${b.difficulty}: ${b.correct} de ${b.total} correctas`}
                    className="mt-1 h-2 overflow-hidden rounded-full bg-paper"
                  >
                    <div
                      className="h-full origin-left animate-[grow_0.9s_var(--ease-out-expo)_both] rounded-full bg-data"
                      style={{ width: `${percent(b.correct, b.total)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
