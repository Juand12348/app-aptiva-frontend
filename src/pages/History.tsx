import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { getExamHistory } from '../api/students'
import type { ExamHistoryItem } from '../api/types'
import { useStudent } from '../auth/useAuth'
import ScoreTrendChart from '../components/charts/ScoreTrendChart'
import HistoryList from '../components/result/HistoryList'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { buttonBase, buttonVariants } from '../components/ui/buttonStyles'
import StatusMessage from '../components/ui/StatusMessage'
import { loadExam } from '../lib/examStorage'
import { useStartExam } from '../lib/useStartExam'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; items: ExamHistoryItem[] }

export default function History() {
  const student = useStudent()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const { start, starting, error: startError } = useStartExam(student.id)

  useEffect(() => {
    let active = true
    getExamHistory()
      .then((items) => active && setState({ status: 'ready', items }))
      .catch((err: unknown) => active && setState({ status: 'error', message: getErrorMessage(err) }))
    return () => {
      active = false
    }
  }, [attempt])

  if (state.status === 'loading') {
    return (
      <div role="status" className="space-y-6">
        <span className="sr-only">Cargando tu historial…</span>
        <div className="h-10 w-56 animate-pulse rounded-lg bg-paper-deep" />
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <StatusMessage title="No pudimos cargar tu historial" text={state.message}>
        <Button
          onClick={() => {
            setState({ status: 'loading' })
            setAttempt((n) => n + 1)
          }}
        >
          Reintentar
        </Button>
      </StatusMessage>
    )
  }

  const { items } = state

  if (items.length === 0) {
    const saved = loadExam(student.id)
    return (
      <StatusMessage title="Aún no has presentado ningún examen" text="Cuando envíes tu primer examen, aquí verás tu evolución.">
        <div className="space-y-3">
          {saved ? (
            <Link to="/examen" className={`${buttonBase} ${buttonVariants.primary}`}>
              Continuar examen
            </Link>
          ) : (
            <Button onClick={() => void start()} loading={starting}>
              Iniciar examen
            </Button>
          )}
          {startError && <Alert variant="error">{startError}</Alert>}
        </div>
      </StatusMessage>
    )
  }

  // The API lists newest first; the trend reads oldest → newest.
  const points = [...items].reverse().map((item, i) => ({
    n: i + 1,
    date: item.finished_at,
    score: item.total_score,
    max: item.max_score,
  }))

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Tu historial</h1>
        <p className="mt-2 text-lg text-ink-muted">
          {items.length === 1 ? 'Has presentado 1 examen.' : `Has presentado ${items.length} exámenes.`}
        </p>
      </header>

      {points.length >= 2 && (
        <section
          aria-labelledby="trend-title"
          className="rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy sm:p-7"
        >
          <h2 id="trend-title" className="text-xl font-extrabold">
            Tu evolución
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Puntaje total sobre 30, del primer examen al más reciente.</p>
          <div className="mt-4">
            <ScoreTrendChart points={points} />
          </div>
        </section>
      )}

      <section aria-labelledby="list-title">
        <h2 id="list-title" className="mb-4 text-2xl font-extrabold">
          Tus exámenes
        </h2>
        <HistoryList items={items} />
      </section>
    </div>
  )
}
