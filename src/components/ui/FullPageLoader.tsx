import Spinner from './Spinner'

export default function FullPageLoader() {
  return (
    <div role="status" className="flex min-h-screen items-center justify-center bg-slate-50 text-indigo-600">
      <Spinner className="h-8 w-8" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
