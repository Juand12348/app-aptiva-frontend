import { useEffect, useRef, type CSSProperties } from 'react'
import type { Question } from '../../api/types'
import { DIFFICULTY_LEVEL, OPTION_LETTERS, TOTAL_QUESTIONS } from '../../lib/constants'

interface Props {
  question: Question
  selectedOptionId: number | undefined
  onSelect: (optionId: number) => void
}

/** Mounted once per question (keyed by the parent), so it enters and takes focus on every navigation. */
export default function QuestionCard({ question, selectedOptionId, onSelect }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const level = DIFFICULTY_LEVEL[question.difficulty]

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <article className="relative mx-2 -mt-10 animate-rise sm:mx-4">
      <div className="relative rounded-2xl border-[6px] border-white bg-white p-5 pt-6 shadow-[0_14px_34px_rgb(14_34_64/0.16)] ring-2 ring-navy sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-6 right-4 grid h-16 w-16 rotate-6 place-items-center rounded-2xl bg-navy font-display text-3xl font-extrabold text-white tabular-nums shadow-[0_8px_18px_rgb(14_34_64/0.3)]"
        >
          {question.position}
        </span>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-16 text-sm font-semibold text-ink-muted">
          <span>
            Pregunta {question.position} de {TOTAL_QUESTIONS}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-0.5 text-navy">
            <span aria-hidden="true" className="flex gap-0.5">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`h-2 w-2 rounded-[2px] ${n <= level ? 'bg-navy' : 'bg-paper-deep'}`} />
              ))}
            </span>
            {question.difficulty}
          </span>
        </div>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-sans text-xl leading-snug font-semibold tracking-normal whitespace-pre-line text-navy focus:outline-none sm:text-2xl"
        >
          {question.statement}
        </h2>
      </div>

      <fieldset className="mt-5">
        <legend className="sr-only">Opciones de respuesta para la pregunta {question.position}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option, i) => {
            const checked = selectedOptionId === option.option_id
            return (
              <label
                key={option.option_id}
                style={checked ? ({ '--tilt': '-1.5deg' } as CSSProperties) : undefined}
                className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-lg transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${
                  checked
                    ? 'animate-pop border-emerald bg-emerald font-semibold text-navy shadow-[0_8px_18px_rgb(14_34_64/0.16)]'
                    : 'border-dashed border-slot bg-white hover:border-solid hover:border-navy'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.question_id}`}
                  value={option.option_id}
                  checked={checked}
                  onChange={() => onSelect(option.option_id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-base font-extrabold ${
                    checked ? 'bg-navy text-white' : 'bg-paper text-navy'
                  }`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className="pt-0.5 whitespace-pre-line">{option.text}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </article>
  )
}
