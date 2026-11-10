import type { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
}

export default function Button({
  loading = false,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
