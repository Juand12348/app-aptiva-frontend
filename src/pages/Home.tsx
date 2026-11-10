import { useState } from 'react'
import { useStudent } from '../auth/useAuth'
import StartExamCard from '../components/exam/StartExamCard'
import LastResultCard from '../components/result/LastResultCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { clearExam, loadExam } from '../lib/examStorage'
import { useStartExam } from '../lib/useStartExam'

export default function Home() {
  const student = useStudent()
  const [saved, setSaved] = useState(() => loadExam(student.id))
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { start, starting, error } = useStartExam(student.id)

  async function discardAndStart() {
    clearExam(student.id)
    setSaved(null)
    await start() // navigates away on success
    setConfirmOpen(false)
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
          error={error}
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
        onConfirm={() => void discardAndStart()}
        onCancel={() => setConfirmOpen(false)}
      >
        Perderás las respuestas que llevas y se creará un examen nuevo con otras preguntas. Esto no se puede deshacer.
      </ConfirmDialog>
    </div>
  )
}
