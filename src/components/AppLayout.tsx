import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-2 py-1 font-medium focus-visible:outline-2 focus-visible:outline-indigo-600 ${
    isActive ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`

export default function AppLayout() {
  const { student, logout } = useAuth()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <span className="text-lg font-bold text-indigo-700">Aptiva AI</span>
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/historial" className={linkClass}>
            Historial
          </NavLink>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{student?.full_name}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
