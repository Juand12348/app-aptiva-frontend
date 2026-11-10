import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Spinner from '../ui/Spinner'

const STICKERS = ['1–10', '11–20', '21–30']

/** Full-screen, blocking wait while the backend grades and Gemini writes the diagnosis (5–40 s). */
export default function SubmittingOverlay() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 12_000)
    // Block every click and Tab stop behind the overlay (nav and logout included) until grading ends.
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => {
      clearTimeout(timer)
      root?.removeAttribute('inert')
    }
  }, [])

  // Portal to <body>: the page's animated <main> has a transform, which would trap `fixed` inside it.
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="bg-slots fixed inset-0 z-50 flex animate-rise flex-col items-center justify-center bg-navy px-6 text-center text-white"
    >
      <div aria-hidden="true" className="flex gap-3">
        {STICKERS.map((range, i) => (
          <span
            key={range}
            className="grid h-24 w-20 animate-float place-items-center rounded-xl border-[5px] border-white bg-white font-display text-xl font-extrabold text-navy tabular-nums shadow-[0_10px_22px_rgb(0_0_0/0.28)]"
            style={{ animationDuration: '1.6s', animationDelay: `${i * 0.2}s`, rotate: `${(i - 1) * 5}deg` }}
          >
            {range}
          </span>
        ))}
      </div>
      <h2 className="mt-10 max-w-md text-2xl font-extrabold sm:text-3xl">
        Calificando tu examen y generando tu diagnóstico…
      </h2>
      <p className="mt-3 max-w-sm text-paper-deep">
        {slow
          ? 'Sigue trabajando: la IA está escribiendo tu diagnóstico. Ya casi.'
          : 'Puede tardar hasta 40 segundos. No cierres esta página.'}
      </p>
      <Spinner className="mt-8 h-8 w-8 border-[3px] text-emerald" />
    </div>,
    document.body,
  )
}
