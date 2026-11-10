import { useEffect, useState, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import { getMe } from '../api/students'
import type { RegisterBody, Student } from '../api/types'
import { clearToken, getToken, setToken } from './tokenStorage'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(() => getToken() !== null)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setStudent(null)
      setSessionExpired(true)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    if (!getToken()) return
    getMe()
      .then(setStudent)
      // 401 is handled by the global handler; on a network error the token is kept and the user lands on login.
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { access_token } = await apiLogin(email.trim().toLowerCase(), password)
    setToken(access_token)
    const me = await getMe()
    setSessionExpired(false)
    setStudent(me)
  }

  async function register(body: RegisterBody) {
    await apiRegister(body)
    try {
      await login(body.email, body.password)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    clearToken() // the saved exam in progress is intentionally kept
    setSessionExpired(false)
    setStudent(null)
  }

  return (
    <AuthContext.Provider value={{ student, loading, sessionExpired, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
