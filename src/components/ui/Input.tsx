import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  /** Element rendered inside the field, on the right (e.g. show/hide password). */
  endSlot?: ReactNode
}

export default function Input({ label, error, endSlot, className = '', ...rest }: Props) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={`${error ? 'animate-nudge' : ''} ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border-2 bg-white px-3.5 py-3 text-base text-navy transition-colors duration-200 hover:border-navy focus:border-navy ${
            error ? 'border-danger' : 'border-slot'
          } ${endSlot ? 'pr-24' : ''}`}
        />
        {endSlot && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endSlot}</div>}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
