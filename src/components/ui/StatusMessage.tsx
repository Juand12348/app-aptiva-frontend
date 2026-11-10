import type { ReactNode } from 'react'

/** Full-page empty/error state: an empty album slot, a heading, a line and an action. */
export default function StatusMessage({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md animate-rise py-10 text-center">
      <div aria-hidden="true" className="mx-auto h-32 w-24 rounded-2xl border-[3px] border-dashed border-slot" />
      <h1 className="mt-6 text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-ink-muted">{text}</p>
      <div className="mt-6 flex justify-center">{children}</div>
    </div>
  )
}
