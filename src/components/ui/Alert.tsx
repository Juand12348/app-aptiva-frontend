import type { ReactNode } from 'react'

const variants = {
  info: 'border-navy/20 bg-paper text-navy',
  error: 'border-danger/30 bg-danger-tint text-danger',
  success: 'border-emerald/50 bg-emerald-tint text-emerald-ink',
}

export default function Alert({ variant = 'info', children }: { variant?: keyof typeof variants; children: ReactNode }) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`animate-rise rounded-xl border px-4 py-3 text-sm font-medium ${variants[variant]}`}
    >
      {children}
    </div>
  )
}
