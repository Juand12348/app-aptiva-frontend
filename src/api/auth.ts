import { request } from './client'
import type { RegisterBody, Student, TokenResponse } from './types'

export const register = (body: RegisterBody) =>
  request<Student>('/api/v1/auth/register', { method: 'POST', json: body, auth: false })

// OAuth2 form, not JSON: `username` carries the email.
export const login = (email: string, password: string) =>
  request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    form: new URLSearchParams({ username: email, password }),
    auth: false,
  })
