import type { ReactNode } from 'react'

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-10 sm:items-center">
      <main className="w-full max-w-md">
        <p className="mb-6 text-center text-2xl font-bold text-indigo-700">Aptiva AI</p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-xl font-bold text-slate-900">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
