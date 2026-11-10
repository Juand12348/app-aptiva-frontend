import { useState, type ComponentProps } from 'react'
import Input from './Input'

export default function PasswordInput(props: Omit<ComponentProps<typeof Input>, 'type' | 'endSlot'>) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-navy underline decoration-emerald decoration-2 underline-offset-4 transition-colors hover:bg-paper"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      }
    />
  )
}
