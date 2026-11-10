import { Link } from 'react-router-dom'
import { buttonBase, buttonVariants } from '../components/ui/buttonStyles'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden="true"
        className="grid h-44 w-36 animate-rise place-items-center rounded-2xl border-[3px] border-dashed border-slot font-display text-5xl font-extrabold text-ink-muted tabular-nums"
      >
        404
      </div>
      <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">Esta lámina no está en el álbum</h1>
      <p className="mt-3 max-w-sm text-ink-muted">La página que buscas no existe o cambió de lugar.</p>
      <Link to="/" className={`${buttonBase} ${buttonVariants.primary} mt-8`}>
        Volver al inicio
      </Link>
    </main>
  )
}
