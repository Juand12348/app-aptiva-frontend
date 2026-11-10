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
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 focus:outline-2 focus:outline-offset-0 focus:outline-indigo-600 ${
            error ? 'border-red-500' : 'border-slate-300'
          } ${endSlot ? 'pr-24' : ''}`}
        />
        {endSlot && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endSlot}</div>}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
