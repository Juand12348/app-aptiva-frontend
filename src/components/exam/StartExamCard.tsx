import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { answeredCount, type SavedExam } from '../../lib/examStorage'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import { buttonBase, buttonVariants } from '../ui/buttonStyles'

const SECTIONS = [
  { range: '1–10', name: 'Cálculo y Álgebra', tilt: '-4deg' },
  { range: '11–20', name: 'Estadística', tilt: '3deg' },
  { range: '21–30', name: 'Geometría', tilt: '-2deg' },
]

interface Props {
  saved: SavedExam | null
  starting: boolean
  error: string
  onStart: () => void
  onDiscard: () => void
}

export default function StartExamCard({ saved, starting, error, onStart, onDiscard }: Props) {
  const questions = saved ? [...saved.exam.questions].sort((a, b) => a.position - b.position) : []

  return (
    <section
      aria-labelledby="exam-card-title"
      className="bg-slots rounded-2xl bg-navy p-6 text-white shadow-[0_16px_36px_rgb(14_34_64/0.22)] sm:p-8"
    >
      <h2 id="exam-card-title" className="text-3xl font-extrabold sm:text-4xl">
        {saved ? 'Examen en curso' : 'Examen de matemáticas'}
      </h2>

      {saved ? (
        <>
          <p className="mt-3 text-paper-deep">
            Llevas <strong className="font-display text-xl text-white tabular-nums">{answeredCount(saved)}</strong> de 30
            preguntas respondidas. Tus respuestas están guardadas en este dispositivo.
          </p>
          <div aria-hidden="true" className="mt-6 grid grid-cols-10 gap-1.5 sm:max-w-md">
            {questions.map((q, i) =>
              saved.answers[q.question_id] ? (
                <span
                  key={q.question_id}
                  className="aspect-[3/4] animate-stick rounded-[5px] bg-emerald"
                  style={{ animationDelay: `${100 + i * 25}ms` }}
                />
              ) : (
                <span key={q.question_id} className="aspect-[3/4] rounded-[5px] border-2 border-dashed border-white/30" />
              ),
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 max-w-prose text-paper-deep">
            30 preguntas en 3 componentes, 10 por cada uno. Sin límite de tiempo. Al final, la IA te dice qué dominas y
            qué te conviene reforzar.
          </p>
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md" aria-label="Componentes del examen">
            {SECTIONS.map((s, i) => (
              <li
                key={s.range}
                className="animate-stick rounded-xl border-2 border-dashed border-white/40 px-2 py-3 text-center"
                style={{ '--tilt': s.tilt, animationDelay: `${150 + i * 120}ms` } as CSSProperties}
              >
                <span className="block font-display text-xl font-extrabold tabular-nums sm:text-2xl">{s.range}</span>
                <span className="mt-1 block text-xs leading-tight font-semibold text-paper-deep">{s.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {error && (
        <div className="mt-5">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {saved ? (
          <>
            <Link to="/examen" className={`${buttonBase} ${buttonVariants.primary} focus-visible:outline-emerald`}>
              Continuar examen
            </Link>
            <Button variant="onNavy" onClick={onDiscard} disabled={starting}>
              Descartar y empezar uno nuevo
            </Button>
          </>
        ) : (
          <Button onClick={onStart} loading={starting} className="focus-visible:outline-emerald sm:min-w-56">
            {starting ? 'Preparando tu examen…' : 'Iniciar examen'}
          </Button>
        )}
      </div>
    </section>
  )
}
