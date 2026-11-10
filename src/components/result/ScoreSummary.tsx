import type { ExamResult } from '../../api/types'
import { percent, scoreBand, type ScoreBand } from '../../lib/format'
import { useCountUp } from '../../lib/useCountUp'
import Confetti from './Confetti'

const BAND: Record<ScoreBand, { pill: string; message: string }> = {
  high: { pill: 'bg-emerald text-navy', message: '¡Excelente resultado! Dominas buena parte del examen.' },
  mid: { pill: 'bg-amber-tint text-amber-ink', message: 'Vas por buen camino. Con un poco de práctica subes de nivel.' },
  low: { pill: 'bg-danger-tint text-danger', message: 'Hay bastante por reforzar, y abajo te contamos por dónde empezar.' },
}

interface Props {
  result: ExamResult
  /** Only the fresh result right after submitting gets the celebration. */
  celebrate: boolean
}

export default function ScoreSummary({ result, celebrate }: Props) {
  const pct = percent(result.total_score, result.max_score)
  const band = scoreBand(pct)
  const shown = useCountUp(result.total_score)

  return (
    <section
      aria-labelledby="score-title"
      className="bg-slots relative overflow-hidden rounded-2xl bg-navy px-6 py-8 text-white shadow-[0_16px_36px_rgb(14_34_64/0.22)] sm:px-10 sm:py-10"
    >
      {celebrate && band === 'high' && <Confetti />}
      <h1 id="score-title" className="text-2xl font-extrabold sm:text-3xl">
        Tu resultado
      </h1>
      <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
        <p className="font-display leading-none font-extrabold tabular-nums">
          <span className="text-8xl sm:text-9xl" aria-hidden="true">
            {shown}
          </span>
          <span className="text-4xl text-paper-deep sm:text-5xl" aria-hidden="true">
            /{result.max_score}
          </span>
          <span className="sr-only">
            {result.total_score} de {result.max_score} puntos
          </span>
        </p>
        <span className={`mb-3 animate-pop rounded-full px-4 py-1.5 font-display text-xl font-extrabold tabular-nums ${BAND[band].pill}`}>
          {pct} %
        </span>
      </div>
      <p className="mt-5 max-w-xl text-lg text-paper-deep">{BAND[band].message}</p>
    </section>
  )
}
