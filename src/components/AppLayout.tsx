import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-2 py-1 font-medium focus-visible:outline-2 focus-visible:outline-indigo-600 ${
    isActive ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <span className="text-lg font-bold text-indigo-700">Aptiva AI</span>
          <NavLink to="/" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/historial" className={linkClass}>Historial</NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
