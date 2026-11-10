import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, getErrorMessage } from '../api/client'
import { useAuth } from '../auth/useAuth'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import { EMAIL_PATTERN } from '../lib/constants'

type Field = 'full_name' | 'email' | 'password' | 'confirm'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const FIELDS: Field[] = ['full_name', 'email', 'password', 'confirm']
const isField = (value: string | undefined): value is Field => FIELDS.includes(value as Field)

function validate(v: Values): Errors {
  const name = v.full_name.trim()
  const email = v.email.trim()
  return {
    full_name: !name ? 'Ingresa tu nombre completo' : name.length > 150 ? 'Máximo 150 caracteres' : undefined,
    email: !EMAIL_PATTERN.test(email) ? 'Ingresa un correo válido' : email.length > 150 ? 'Máximo 150 caracteres' : undefined,
    password:
      v.password.length < 8 ? 'Mínimo 8 caracteres' : v.password.length > 128 ? 'Máximo 128 caracteres' : undefined,
    confirm: v.confirm !== v.password ? 'Las contraseñas no coinciden' : undefined,
  }
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>({ full_name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const change = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit() {
    const next = validate(values)
    setErrors(next)
    setFormError('')
    if (FIELDS.some((f) => next[f])) return

    setSubmitting(true)
    try {
      const loggedIn = await register({
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      // On success GuestRoute redirects to "/" once the student is set.
      if (!loggedIn) navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setErrors({ email: err.message })
      else if (err instanceof ApiError && isField(err.field)) setErrors({ [err.field]: err.message })
      else setFormError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Crear cuenta">
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit()
        }}
      >
        <Input
          label="Nombre completo"
          autoComplete="name"
          maxLength={150}
          value={values.full_name}
          onChange={change('full_name')}
          error={errors.full_name}
        />
        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          maxLength={150}
          value={values.email}
          onChange={change('email')}
          error={errors.email}
        />
        <PasswordInput
          label="Contraseña (mínimo 8 caracteres)"
          autoComplete="new-password"
          maxLength={128}
          value={values.password}
          onChange={change('password')}
          error={errors.password}
        />
        <PasswordInput
          label="Confirmar contraseña"
          autoComplete="new-password"
          maxLength={128}
          value={values.confirm}
          onChange={change('confirm')}
          error={errors.confirm}
        />
        {formError && <Alert variant="error">{formError}</Alert>}
        <Button type="submit" loading={submitting} className="w-full">
          Crear cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
