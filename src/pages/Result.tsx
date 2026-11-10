import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ApiError, getErrorMessage } from '../api/client'
import { getExamResult, regenerateDiagnosis } from '../api/exams'
import type { ExamResult } from '../api/types'
import { useStudent } from '../auth/useAuth'
import ComponentBarChart from '../components/charts/ComponentBarChart'
import DiagnosisCard from '../components/result/DiagnosisCard'
import DifficultyBreakdown from '../components/result/DifficultyBreakdown'
import ScoreSummary from '../components/result/ScoreSummary'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import StatusMessage from '../components/ui/StatusMessage'
import { buttonBase, buttonVariants } from '../components/ui/buttonStyles'
import { loadExam } from '../lib/examStorage'
import { useStartExam } from '../lib/useStartExam'

type State =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'notSubmitted' }
  | { status: 'error'; message: string }
  | { status: 'ready'; result: ExamResult }

interface NavState {
  result?: ExamResult
  alreadyGraded?: boolean
}

const cardClass =
  'rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy sm:p-7'

export default function Result() {
  const student = useStudent()
  const examId = Number(useParams().examId)
  const validId = Number.isInteger(examId) && examId > 0
  const location = useLocation()
  const navigate = useNavigate()
  const navState = location.state as NavState | null
  // The fresh submit hands its result over in navigation state, so no extra request is needed.
  const fresh = navState?.result?.exam_id === examId ? navState.result : null
  const [state, setState] = useState<State>(fresh ? { status: 'ready', result: fresh } : { status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [diagnosis, setDiagnosis] = useState({ retrying: false, error: '' })
  const { start, starting, error: startError } = useStartExam(student.id)
  const hasFresh = Boolean(fresh)

  useEffect(() => {
    if (!validId || (hasFresh && attempt === 0)) return
    let active = true
    getExamResult(examId)
      .then((result) => active && setState({ status: 'ready', result }))
      .catch((err: unknown) => {
        if (!active) return
        const status = err instanceof ApiError ? err.status : 0
        if (status === 404) setState({ status: 'notFound' })
        else if (status === 409) setState({ status: 'notSubmitted' })
        else setState({ status: 'error', message: getErrorMessage(err) })
      })
    return () => {
      active = false
    }
  }, [examId, validId, hasFresh, attempt])

  async function retryDiagnosis() {
    if (diagnosis.retrying) return
    setDiagnosis({ retrying: true, error: '' })
    try {
      const next = await regenerateDiagnosis(examId)
      setState((s) => (s.status === 'ready' ? { ...s, result: { ...s.result, diagnosis: next } } : s))
      // A reload reuses the navigation state: keep it in sync so the old empty diagnosis doesn't come back.
      if (fresh) navigate(location.pathname, { replace: true, state: { result: { ...fresh, diagnosis: next } } })
      setDiagnosis({ retrying: false, error: '' })
    } catch (err) {
      setDiagnosis({
        retrying: false,
        error:
          err instanceof ApiError && err.status === 503
            ? 'El diagnóstico no está disponible en este momento, intenta en unos minutos.'
            : getErrorMessage(err),
      })
    }
  }

  const saved = loadExam(student.id)

  if (!validId || state.status === 'notFound') {
    return (
      <StatusMessage title="Examen no encontrado" text="No encontramos este examen en tu cuenta.">
        <Link to="/" className={`${buttonBase} ${buttonVariants.primary}`}>
          Volver al inicio
        </Link>
      </StatusMessage>
    )
  }

  if (state.status === 'notSubmitted') {
    return (
      <StatusMessage title="Este examen aún no se ha enviado" text="Termínalo y envíalo para ver tu resultado.">
        {saved?.exam.exam_id === examId ? (
          <Link to="/examen" className={`${buttonBase} ${buttonVariants.primary}`}>
            Continuar examen
          </Link>
        ) : (
          <Link to="/" className={`${buttonBase} ${buttonVariants.outline}`}>
            Volver al inicio
          </Link>
        )}
      </StatusMessage>
    )
  }

  if (state.status === 'error') {
    return (
      <StatusMessage title="No pudimos cargar tu resultado" text={state.message}>
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

  if (state.status === 'loading') {
    return (
      <div role="status" className="space-y-6">
        <span className="sr-only">Cargando tu resultado…</span>
        <div className="h-56 animate-pulse rounded-2xl bg-paper-deep" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
        <div className="h-48 animate-pulse rounded-2xl bg-white" />
      </div>
    )
  }

  const { result } = state
  return (
    <div className="space-y-6">
      {navState?.alreadyGraded && <Alert>Este examen ya había sido calificado. Aquí está tu resultado.</Alert>}

      <ScoreSummary key={result.exam_id} result={result} celebrate={hasFresh} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="components-title" className={cardClass}>
          <h2 id="components-title" className="text-xl font-extrabold">
            Puntaje por componente
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Sobre 10 puntos cada uno.</p>
          <div className="mt-4">
            <ComponentBarChart components={result.components} />
          </div>
        </section>
        <section aria-labelledby="difficulty-title" className={cardClass}>
          <h2 id="difficulty-title" className="text-xl font-extrabold">
            Desempeño por dificultad
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Aciertos sobre preguntas de cada nivel.</p>
          <div className="mt-4">
            <DifficultyBreakdown components={result.components} />
          </div>
        </section>
      </div>

      <DiagnosisCard
        diagnosis={result.diagnosis}
        retrying={diagnosis.retrying}
        error={diagnosis.error}
        onRetry={() => void retryDiagnosis()}
      />

      {startError && <Alert variant="error">{startError}</Alert>}
      <div className="flex flex-col gap-3 sm:flex-row">
        {saved ? (
          <Link to="/examen" className={`${buttonBase} ${buttonVariants.primary}`}>
            Continuar examen en curso
          </Link>
        ) : (
          <Button onClick={() => void start()} loading={starting}>
            Iniciar nuevo examen
          </Button>
        )}
        <Link to="/historial" className={`${buttonBase} ${buttonVariants.outline}`}>
          Ver historial
        </Link>
      </div>
    </div>
  )
}

