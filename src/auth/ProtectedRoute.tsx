import { Navigate, Outlet, useLocation } from 'react-router-dom'
import FullPageLoader from '../components/ui/FullPageLoader'
import { useAuth } from './useAuth'

export default function ProtectedRoute() {
  const { student, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!student) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
