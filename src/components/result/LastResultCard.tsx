import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../../api/client'
import { getExamHistory } from '../../api/students'
import type { ExamHistoryItem } from '../../api/types'
import { formatDate, percent } from '../../lib/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import { buttonBase, buttonVariants } from '../ui/buttonStyles'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; last: ExamHistoryItem | null }

export default function LastResultCard() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    getExamHistory()
      .then((items) => active && setState({ status: 'ready', last: items[0] ?? null }))
      .catch((err: unknown) => active && setState({ status: 'error', message: getErrorMessage(err) }))
    return () => {
      active = false
    }
  }, [attempt])

  return (
    <section
      aria-labelledby="last-result-title"
      className="rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy sm:p-6"
    >
      <h2 id="last-result-title" className="text-xl font-extrabold">
        Tu último resultado
      </h2>

      {state.status === 'loading' && (
        <div role="status" className="mt-4 space-y-3">
          <span className="sr-only">Cargando tu último resultado…</span>
          <div className="h-14 w-36 animate-pulse rounded-lg bg-paper-deep" />
          <div className="h-4 w-48 animate-pulse rounded bg-paper-deep" />
          <div className="h-20 animate-pulse rounded-lg bg-paper" />
        </div>
      )}

      {state.status === 'error' && (
        <div className="mt-4 space-y-3">
          <Alert variant="error">{state.message}</Alert>
          <Button
            variant="outline"
            onClick={() => {
              setState({ status: 'loading' })
              setAttempt((n) => n + 1)
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {state.status === 'ready' && !state.last && (
        <div className="mt-4 rounded-xl border-2 border-dashed border-slot px-4 py-8 text-center">
          <p className="font-display text-lg font-bold">Aún no has presentado ningún examen</p>
          <p className="mt-1 text-sm text-ink-muted">Tu primer resultado aparecerá aquí.</p>
        </div>
      )}

      {state.status === 'ready' && state.last && (
        <div className="mt-3">
          <p className="font-display text-6xl leading-none font-extrabold tabular-nums">
            {state.last.total_score}
            <span className="text-3xl text-ink-muted">/{state.last.max_score}</span>
            <span className="ml-3 align-middle text-lg font-bold text-emerald-ink">
              {percent(state.last.total_score, state.last.max_score)} %
            </span>
          </p>
          <p className="mt-2 text-sm text-ink-muted">Presentado el {formatDate(state.last.finished_at)}</p>

          <ul className="mt-5 space-y-3">
            {state.last.components.map((c) => (
              <li key={c.component}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{c.component}</span>
                  <span className="tabular-nums">
                    {c.score}/{c.max_score}
                  </span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full origin-left animate-[grow_0.9s_var(--ease-out-expo)_both] rounded-full bg-data"
                    style={{ width: `${percent(c.score, c.max_score)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {!state.last.has_diagnosis && (
            <p className="mt-4 text-sm text-ink-muted">Este examen quedó sin diagnóstico; puedes generarlo en su resultado.</p>
          )}

          <Link to={`/resultado/${state.last.exam_id}`} className={`${buttonBase} ${buttonVariants.outline} mt-5 w-full`}>
            Ver resultado completo
          </Link>
        </div>
      )}
    </section>
  )
}
