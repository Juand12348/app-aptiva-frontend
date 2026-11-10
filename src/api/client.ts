import { clearToken, getToken } from '../auth/tokenStorage'
import type { HealthResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_TIMEOUT_MS = 30_000

export const NETWORK_ERROR_STATUS = 0
const GENERIC_MESSAGE = 'Algo salió mal, intenta de nuevo'

export class ApiError extends Error {
  status: number
  field?: string

  constructor(status: number, message: string, field?: string) {
    super(message)
    this.status = status
    this.field = field
  }
}

let onUnauthorized: (() => void) | null = null

/** Called after the token is cleared on a 401 from a protected endpoint. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  json?: unknown
  form?: URLSearchParams
  auth?: boolean
  timeoutMs?: number
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', json, form, auth = true, timeoutMs = DEFAULT_TIMEOUT_MS } = options
  const headers: Record<string, string> = {}
  let body: BodyInit | undefined

  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = form
  }

  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body, signal: AbortSignal.timeout(timeoutMs) })
  } catch {
    // Network failure or timeout: the request may or may not have reached the server.
    throw new ApiError(NETWORK_ERROR_STATUS, 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
  }

  if (res.ok) return (await res.json()) as T

  const error = await parseError(res)
  if (auth && res.status === 401) {
    clearToken()
    onUnauthorized?.()
  }
  throw error
}

interface ValidationIssue { loc?: (string | number)[] }

async function parseError(res: Response): Promise<ApiError> {
  let detail: unknown
  try {
    detail = ((await res.json()) as { detail?: unknown }).detail
  } catch {
    // Non-JSON body (proxy error page, etc.)
  }

  if (res.status >= 500) return new ApiError(res.status, GENERIC_MESSAGE)
  // Business errors, and this backend's 422s, come as a ready-to-show Spanish string.
  if (typeof detail === 'string') return new ApiError(res.status, detail)
  // Default FastAPI validation format: list of issues in English.
  if (Array.isArray(detail)) {
    const loc = (detail[0] as ValidationIssue | undefined)?.loc
    return new ApiError(res.status, 'Revisa los datos ingresados', loc ? String(loc[loc.length - 1]) : undefined)
  }
  return new ApiError(res.status, GENERIC_MESSAGE)
}

export const health = () => request<HealthResponse>('/health', { auth: false })
