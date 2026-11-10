import { Navigate, Outlet, useLocation } from 'react-router-dom'
import FullPageLoader from '../components/ui/FullPageLoader'
import { useAuth } from './useAuth'

/** Public-only routes (login, register): a logged-in student goes back to where they came from. */
export default function GuestRoute() {
  const { student, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (student) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }
  return <Outlet />
}
