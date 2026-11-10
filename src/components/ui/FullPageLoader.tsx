import Spinner from './Spinner'

export default function FullPageLoader() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center bg-paper text-navy">
      <Spinner className="h-9 w-9 border-[3px]" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
