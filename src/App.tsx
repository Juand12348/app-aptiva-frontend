import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import GuestRoute from './auth/GuestRoute'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Exam from './pages/Exam'
import History from './pages/History'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Result from './pages/Result'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/examen" element={<Exam />} />
              <Route path="/resultado/:examId" element={<Result />} />
              <Route path="/historial" element={<History />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
