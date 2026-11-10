import type { CSSProperties, ReactNode } from 'react'

const STICKERS = [
  { range: '1–10', name: 'Cálculo y Álgebra', tilt: '-7deg', delay: 150 },
  { range: '11–20', name: 'Estadística', tilt: '5deg', delay: 300 },
  { range: '21–30', name: 'Geometría', tilt: '-3deg', delay: 450 },
]

interface Props {
  title: string
  tagline: string
  children: ReactNode
}

export default function AuthLayout({ title, tagline, children }: Props) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.1fr_1fr]">
      <header className="bg-slots relative bg-navy px-5 pt-6 pb-20 text-white lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
        <p className="font-display text-xl font-extrabold tracking-tight">
          Aptiva<span className="text-emerald">.</span>AI
        </p>
        <div>
          <p className="mt-5 max-w-lg font-display text-[1.75rem] leading-[1.1] font-extrabold tracking-tight sm:text-4xl lg:text-6xl">
            {tagline}
          </p>
          <ul aria-label="Componentes del examen" className="mt-6 flex gap-3 sm:gap-4 lg:mt-12 lg:gap-6">
            {STICKERS.map((s) => (
              <li key={s.range} className="animate-float" style={{ animationDelay: `${s.delay * 4}ms` }}>
                <div
                  className="w-[6.25rem] animate-stick rounded-xl border-[5px] border-white bg-white p-1.5 text-navy shadow-[0_10px_22px_rgb(0_0_0/0.28)] sm:w-28 lg:w-40"
                  style={{ '--tilt': s.tilt, animationDelay: `${s.delay}ms` } as CSSProperties}
                >
                  <span className="block rounded-md bg-paper py-3 text-center font-display text-2xl font-extrabold tabular-nums lg:py-5 lg:text-4xl">
                    {s.range}
                  </span>
                  <span className="mt-1.5 block px-0.5 text-xs leading-tight font-semibold lg:text-sm">{s.name}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 hidden max-w-sm text-paper-deep sm:block lg:mt-10 lg:text-lg">
            30 preguntas, 10 por componente, y al final un diagnóstico con IA de lo que dominas y lo que te falta.
          </p>
        </div>
      </header>

      <main className="relative -mt-12 px-4 pb-10 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:px-12 lg:py-12">
        <div
          className="mx-auto w-full max-w-md animate-rise rounded-2xl border-[6px] border-white bg-white p-5 shadow-[0_14px_34px_rgb(14_34_64/0.16)] ring-2 ring-navy sm:p-7"
          style={{ animationDelay: '80ms' }}
        >
          <h1 className="mb-6 text-[1.75rem] leading-tight font-extrabold">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
