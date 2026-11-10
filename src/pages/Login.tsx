import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../auth/useAuth'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import { EMAIL_PATTERN } from '../lib/constants'

export default function Login() {
  const { login, sessionExpired } = useAuth()
  const location = useLocation()
  const registered = (location.state as { registered?: boolean } | null)?.registered

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const next = {
      email: EMAIL_PATTERN.test(email.trim()) ? undefined : 'Ingresa un correo válido',
      password: password ? undefined : 'Ingresa tu contraseña',
    }
    setErrors(next)
    setFormError('')
    if (next.email || next.password) return

    setSubmitting(true)
    try {
      await login(email, password) // GuestRoute redirects once the student is set
    } catch (err) {
      setFormError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Iniciar sesión" tagline="Sigue llenando tu álbum de matemáticas.">
      {(sessionExpired || registered) && (
        <div className="mb-4">
          {sessionExpired ? (
            <Alert>Tu sesión venció, inicia sesión de nuevo.</Alert>
          ) : (
            <Alert variant="success">Tu cuenta fue creada. Ahora inicia sesión.</Alert>
          )}
        </div>
      )}
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit()
        }}
      >
        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
        />
        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
        />
        {formError && <Alert variant="error">{formError}</Alert>}
        <Button type="submit" loading={submitting} className="w-full">
          Iniciar sesión
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        ¿No tienes cuenta?{' '}
        <Link
          to="/registro"
          className="font-semibold text-navy underline decoration-emerald decoration-2 underline-offset-4 transition-colors hover:decoration-navy"
        >
          Crear cuenta
        </Link>
      </p>
    </AuthLayout>
  )
}
