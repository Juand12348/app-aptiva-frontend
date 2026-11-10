import { useEffect, useState } from 'react'
import { getToken } from './tokenStorage'

/** Expiry of a JWT in epoch ms, read from its `exp` claim; null if missing or unreadable. */
export function tokenExpiresAt(token: string | null): number | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const exp = (JSON.parse(atob(base64)) as { exp?: unknown }).exp
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

const endingSoon = (thresholdMs: number) => {
  const exp = tokenExpiresAt(getToken())
  return exp !== null && exp - Date.now() <= thresholdMs
}

/** True once the 60-minute session has `thresholdMs` or less left (checked every 30 s). */
export function useSessionEndingSoon(thresholdMs = 5 * 60_000) {
  const [soon, setSoon] = useState(() => endingSoon(thresholdMs))

  useEffect(() => {
    const timer = setInterval(() => setSoon(endingSoon(thresholdMs)), 30_000)
    return () => clearInterval(timer)
  }, [thresholdMs])

  return soon
}
