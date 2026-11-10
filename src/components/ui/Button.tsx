import type { ButtonHTMLAttributes } from 'react'
import { buttonBase, buttonVariants } from './buttonStyles'
import Spinner from './Spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: keyof typeof buttonVariants
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
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
