import { Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Spinner from './ui/Spinner'

const onNavy = 'focus-visible:outline-emerald'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 ${onNavy} ${
    isActive ? 'bg-emerald text-navy' : 'text-paper-deep hover:bg-navy-soft hover:text-white'
  }`

export default function AppLayout() {
  const { student, logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/" className={`rounded font-display text-xl font-extrabold tracking-tight ${onNavy}`}>
            Aptiva<span className="text-emerald">.</span>AI
          </Link>
          <nav aria-label="Principal" className="order-last flex w-full gap-2 sm:order-none sm:w-auto">
            <NavLink to="/" end className={tabClass}>
              Inicio
            </NavLink>
            <NavLink to="/historial" className={tabClass}>
              Historial
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-paper-deep sm:inline">{student?.full_name}</span>
            <button
              type="button"
              onClick={logout}
              className={`rounded-full border border-white/35 px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 hover:bg-white hover:text-navy ${onNavy}`}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      {/* Keyed by route so every page enters with the same rise. */}
      <main key={pathname} className="mx-auto max-w-5xl animate-rise px-4 py-8">
        <Suspense
          fallback={
            <div role="status" className="flex justify-center py-20 text-navy">
              <Spinner className="h-8 w-8 border-[3px]" />
              <span className="sr-only">Cargando…</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
