import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../api/client'
import { getMyStats } from '../../api/students'
import type { StudentStats } from '../../api/types'
import { DIFFICULTY_ORDER } from '../../lib/constants'
import AccuracyBars from '../charts/AccuracyBars'
import ScoreTrendChart from '../charts/ScoreTrendChart'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import ComponentStatsCard from './ComponentStatsCard'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; stats: StudentStats }

const CARD =
  'rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy sm:p-6'

/** Staggers a block's entrance so the dashboard builds up instead of appearing at once. */
const rise = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` })

function Section({ id, title, note, children, index }: { id: string; title: string; note?: string; children: ReactNode; index: number }) {
  return (
    <section aria-labelledby={id} className={`${CARD} animate-rise`} style={rise(index)}>
      <h3 id={id} className="text-xl font-extrabold">
        {title}
      </h3>
      {note && <p className="mt-1 mb-4 text-sm text-ink-muted">{note}</p>}
      {!note && <div className="mb-4" />}
      {children}
    </section>
  )
}

export default function StatsDashboard() {
  const navigate = useNavigate()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    getMyStats()
      .then((stats) => active && setState({ status: 'ready', stats }))
      .catch((err: unknown) => active && setState({ status: 'error', message: getErrorMessage(err) }))
    return () => {
      active = false
    }
  }, [attempt])

  if (state.status === 'loading') {
    return (
      <div role="status" className="space-y-6">
        <span className="sr-only">Cargando tu progreso…</span>
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="space-y-3">
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
    )
  }

  const { stats } = state

  if (stats.exams_count === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slot px-4 py-10 text-center">
        <p className="font-display text-lg font-bold">Tu progreso aparecerá aquí</p>
        <p className="mt-1 text-sm text-ink-muted">
          Presenta tu primer examen y verás tu evolución, tus aciertos por componente y por dificultad.
        </p>
      </div>
    )
  }

  const points = stats.evolution.map((e, i) => ({ n: i + 1, date: e.finished_at, score: e.total_score, max: e.max_score }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">Tu progreso</h2>

      <Section
        id="evolution-title"
        title="Tu evolución"
        note="Puntaje total sobre 30, del primer examen al más reciente. Toca un punto para ver el detalle de ese examen."
        index={0}
      >
        {points.length >= 2 ? (
          <ScoreTrendChart points={points} onSelectPoint={(i) => navigate(`/resultado/${stats.evolution[i].exam_id}`)} />
        ) : (
          <p className="text-sm text-ink-muted">Con tu segundo examen verás aquí cómo evoluciona tu puntaje.</p>
        )}
      </Section>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.components.map((c, i) => (
          <div key={c.component} className="animate-rise" style={rise(i + 1)}>
            <ComponentStatsCard stats={c} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section id="difficulty-title" title="Aciertos por dificultad" note="Sumando todos tus exámenes." index={4}>
          <AccuracyBars buckets={stats.by_difficulty} order={DIFFICULTY_ORDER} />
        </Section>
        <Section
          id="position-title"
          title="Dentro de cada bloque"
          note="Preguntas 1–5 frente a 6–10 de cada componente. Es solo una pista orientativa, no una conclusión."
          index={5}
        >
          <AccuracyBars buckets={stats.by_position_in_block} format={(l) => `Preguntas ${l}`} />
        </Section>
      </div>
    </div>
  )
}
