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
          className="rounded px-2 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      }
    />
  )
}
