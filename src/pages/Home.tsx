import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { startExam } from '../api/exams'
import { useStudent } from '../auth/useAuth'
import StartExamCard from '../components/exam/StartExamCard'
import LastResultCard from '../components/result/LastResultCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { clearExam, loadExam, saveExam } from '../lib/examStorage'

export default function Home() {
  const student = useStudent()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(() => loadExam(student.id))
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  // Every POST /exams creates a new exam: a ref blocks a second click before React re-renders.
  const startingRef = useRef(false)

  async function start() {
    if (startingRef.current) return
    startingRef.current = true
    setStarting(true)
    setStartError('')
    try {
      const exam = await startExam()
      saveExam(student.id, { exam, answers: {}, currentIndex: 0 })
      navigate('/examen')
    } catch (err) {
      startingRef.current = false
      setStarting(false)
      setConfirmOpen(false)
      setStartError(getErrorMessage(err))
    }
  }

  function discardAndStart() {
    clearExam(student.id)
    setSaved(null)
    void start()
  }

  const firstName = student.full_name.trim().split(/\s+/)[0]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Hola, {firstName}</h1>
        <p className="mt-2 text-lg text-ink-muted">
          {saved ? 'Tienes un examen a medio llenar. Retómalo cuando quieras.' : '¿Listo para medir tu nivel en matemáticas?'}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <StartExamCard
          saved={saved}
          starting={starting}
          error={startError}
          onStart={() => void start()}
          onDiscard={() => setConfirmOpen(true)}
        />
        <LastResultCard />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Descartar el examen en curso?"
        confirmLabel="Descartar y empezar"
        loading={starting}
        onConfirm={discardAndStart}
        onCancel={() => setConfirmOpen(false)}
      >
        Perderás las respuestas que llevas y se creará un examen nuevo con otras preguntas. Esto no se puede deshacer.
      </ConfirmDialog>
    </div>
  )
}
