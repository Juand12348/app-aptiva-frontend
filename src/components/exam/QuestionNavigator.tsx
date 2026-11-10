import type { Component, Question } from '../../api/types'

interface Props {
  questions: Question[]
  answers: Record<number, number>
  currentIndex: number
  onSelect: (index: number) => void
}

export default function QuestionNavigator({ questions, answers, currentIndex, onSelect }: Props) {
  // Questions arrive grouped by component (1–10, 11–20, 21–30); keep that order.
  const groups: { component: Component; items: { question: Question; index: number }[] }[] = []
  questions.forEach((question, index) => {
    const last = groups[groups.length - 1]
    if (last?.component === question.component) last.items.push({ question, index })
    else groups.push({ component: question.component, items: [{ question, index }] })
  })

  return (
    <nav aria-label="Navegador de preguntas" className="space-y-4">
      {groups.map((group) => {
        const answered = group.items.filter(({ question }) => answers[question.question_id]).length
        return (
          <div key={group.component}>
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span>{group.component}</span>
              <span className="text-ink-muted tabular-nums">
                {answered}/{group.items.length}
              </span>
            </div>
            {/* The desktop sidebar is narrow: two rows of five keep the slots wide enough for two digits. */}
            <ol className="grid grid-cols-10 gap-1.5 lg:grid-cols-5 lg:gap-2">
              {group.items.map(({ question, index }) => {
                const isAnswered = Boolean(answers[question.question_id])
                const isCurrent = index === currentIndex
                return (
                  <li key={question.question_id}>
                    <button
                      type="button"
                      onClick={() => onSelect(index)}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`Pregunta ${question.position}, ${isAnswered ? 'respondida' : 'sin responder'}`}
                      className={`grid aspect-[3/4] w-full place-items-center rounded-md text-xs font-bold lg:aspect-auto lg:h-9 lg:text-sm tabular-nums transition-colors duration-200 ${
                        isAnswered
                          ? 'bg-emerald text-navy'
                          : 'border-2 border-dashed border-slot text-ink-muted hover:border-solid hover:border-navy'
                      } ${isCurrent ? 'ring-2 ring-navy ring-offset-2 ring-offset-white' : ''}`}
                    >
                      {question.position}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </nav>
  )
}
