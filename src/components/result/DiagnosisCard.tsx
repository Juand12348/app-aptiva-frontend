import type { CSSProperties } from 'react'
import type { Diagnosis } from '../../api/types'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

interface Props {
  diagnosis: Diagnosis | null
  retrying: boolean
  error: string
  onRetry: () => void
}

const SECTIONS = [
  { key: 'strengths', title: 'Fortalezas', marker: 'bg-emerald' },
  { key: 'weaknesses', title: 'Aspectos por mejorar', marker: 'bg-amber-ink' },
  { key: 'recommendations', title: 'Recomendaciones', marker: 'bg-navy' },
] as const

export default function DiagnosisCard({ diagnosis, retrying, error, onRetry }: Props) {
  return (
    <section
      aria-labelledby="diagnosis-title"
      className="rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_12px_30px_rgb(14_34_64/0.12)] ring-2 ring-navy sm:p-7"
    >
      <h2 id="diagnosis-title" className="text-2xl font-extrabold">
        Diagnóstico con IA
      </h2>

      {diagnosis ? (
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {SECTIONS.filter((s) => diagnosis[s.key].length > 0).map((s, sectionIndex) => (
            <div key={s.key}>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <span aria-hidden="true" className={`h-4 w-3 rotate-[-6deg] rounded-[3px] ${s.marker}`} />
                {s.title}
              </h3>
              <ul className="mt-3 space-y-3">
                {diagnosis[s.key].map((text, i) => (
                  <li
                    key={i}
                    className="animate-rise rounded-xl bg-paper px-4 py-3 leading-relaxed"
                    style={{ animationDelay: `${(sectionIndex * 3 + i) * 70}ms` } as CSSProperties}
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border-2 border-dashed border-slot px-5 py-6">
          <p className="font-display text-lg font-bold">No pudimos generar tu diagnóstico esta vez</p>
          <p className="mt-1 text-ink-muted">Tu puntaje sí quedó guardado. Puedes pedirle a la IA que lo intente de nuevo.</p>
          {error && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
          <Button onClick={onRetry} loading={retrying} className="mt-5">
            {retrying ? 'Generando diagnóstico…' : 'Reintentar diagnóstico'}
          </Button>
        </div>
      )}
    </section>
  )
}
