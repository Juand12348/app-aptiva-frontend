import { createContext, useContext } from 'react'
import type { RegisterBody, Student } from '../api/types'

export interface AuthContextValue {
  student: Student | null
  /** True while restoring a saved session on app load. */
  loading: boolean
  /** True after being kicked out by a 401; cleared on the next login/logout. */
  sessionExpired: boolean
  login: (email: string, password: string) => Promise<void>
  /** Registers and auto-logs in. Resolves false if the account was created but auto-login failed. */
  register: (body: RegisterBody) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
