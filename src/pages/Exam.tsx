import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStudent } from '../auth/useAuth'
import QuestionCard from '../components/exam/QuestionCard'
import QuestionNavigator from '../components/exam/QuestionNavigator'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { COMPONENT_NOTES, TOTAL_QUESTIONS } from '../lib/constants'
import { answeredCount, loadExam, saveExam, type SavedExam } from '../lib/examStorage'

export default function Exam() {
  const student = useStudent()
  const [saved, setSaved] = useState(() => loadExam(student.id))
  const [navOpen, setNavOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [notice, setNotice] = useState('')

  // Never create an exam from here: only Home's click does.
  if (!saved) return <Navigate to="/" replace />

  const questions = [...saved.exam.questions].sort((a, b) => a.position - b.position)
  const index = Math.min(Math.max(saved.currentIndex, 0), questions.length - 1)
  const question = questions[index]
  const answered = answeredCount(saved)
  const isLast = index === questions.length - 1

  function update(next: SavedExam) {
    setSaved(next)
    saveExam(student.id, next)
  }

  function goTo(nextIndex: number) {
    if (!saved) return
    update({ ...saved, currentIndex: nextIndex })
    setNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function answer(optionId: number) {
    if (!saved) return
    update({ ...saved, answers: { ...saved.answers, [question.question_id]: optionId } })
  }

  function submit() {
    // shortcut: the real POST /submit lands in phase 5; this only closes the dialog.
    setConfirmOpen(false)
    setNotice('El envío del examen se conecta en la siguiente fase. Tus respuestas siguen guardadas.')
  }

  return (
    <div className="pb-4 lg:grid lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-8">
      <div>
        <section className="bg-slots rounded-2xl bg-navy px-5 pt-5 pb-16 text-white sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-paper-deep">
              <span className="font-display text-lg text-white tabular-nums">{answered}</span> de {TOTAL_QUESTIONS}{' '}
              respondidas
            </p>
            <Button variant="onNavy" onClick={() => setConfirmOpen(true)} className="px-3.5 py-1.5 text-sm lg:hidden">
              Enviar examen
            </Button>
          </div>
          <div
            role="progressbar"
            aria-label="Preguntas respondidas"
            aria-valuemin={0}
            aria-valuemax={TOTAL_QUESTIONS}
            aria-valuenow={answered}
            className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"
          >
            <div
              className="h-full rounded-full bg-emerald transition-[width] duration-500 ease-[var(--ease-out-expo)]"
              style={{ width: `${(answered / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
          <h1 key={question.component} className="mt-6 animate-rise text-3xl font-extrabold sm:text-4xl">
            {question.component}
          </h1>
          <p className="mt-1 text-paper-deep">{COMPONENT_NOTES[question.component]}</p>
        </section>

        <QuestionCard
          key={question.question_id}
          question={question}
          selectedOptionId={saved.answers[question.question_id]}
          onSelect={answer}
        />

        {notice && (
          <div className="mt-5">
            <Alert>{notice}</Alert>
          </div>
        )}

        <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex gap-3 border-t border-paper-deep bg-paper px-4 py-3 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          <Button variant="outline" onClick={() => goTo(index - 1)} disabled={index === 0} className="flex-1 sm:flex-none">
            Anterior
          </Button>
          {isLast ? (
            <Button onClick={() => setConfirmOpen(true)} className="flex-1 sm:ml-auto sm:flex-none">
              Revisar y enviar
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => goTo(index + 1)} className="flex-1 sm:ml-auto sm:flex-none">
              Siguiente
            </Button>
          )}
        </div>
      </div>

      <aside className="mt-6 space-y-4 lg:sticky lg:top-6 lg:mt-0">
        <button
          type="button"
          onClick={() => setNavOpen((open) => !open)}
          aria-expanded={navOpen}
          aria-controls="question-navigator"
          className="flex w-full items-center justify-between rounded-xl border-2 border-navy bg-white px-4 py-3 font-display font-bold lg:hidden"
        >
          <span>Ver todas las preguntas</span>
          <span className="flex items-center gap-2 text-sm text-ink-muted tabular-nums">
            {answered}/{TOTAL_QUESTIONS}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className={`h-5 w-5 transition-transform duration-300 ${navOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 8 5 5 5-5" />
            </svg>
          </span>
        </button>
        <div
          id="question-navigator"
          className={`rounded-2xl border-[6px] border-white bg-white p-4 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy ${
            navOpen ? 'animate-rise' : 'hidden'
          } lg:block`}
        >
          <QuestionNavigator questions={questions} answers={saved.answers} currentIndex={index} onSelect={goTo} />
        </div>
        <Button onClick={() => setConfirmOpen(true)} className="hidden w-full lg:flex">
          Enviar examen
        </Button>
      </aside>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Enviar tu examen?"
        confirmLabel="Enviar"
        onConfirm={submit}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>
          Respondiste <strong className="text-navy">{answered} de {TOTAL_QUESTIONS}</strong>. Las preguntas sin responder
          cuentan como incorrectas. Una vez enviado no podrás cambiar tus respuestas.
        </p>
      </ConfirmDialog>
    </div>
  )
}
