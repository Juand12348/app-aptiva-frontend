import type { ReactNode } from 'react'

const variants = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
}

export default function Alert({ variant = 'info', children }: { variant?: keyof typeof variants; children: ReactNode }) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}
    >
      {children}
    </div>
  )
}
