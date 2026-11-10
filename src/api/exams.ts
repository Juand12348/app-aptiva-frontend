import { request } from './client'
import type { Diagnosis, ExamResult, StartExamResponse, SubmitBody } from './types'

// Gemini-backed calls take 5–15 s (worst case ~40 s).
const GEMINI_TIMEOUT_MS = 60_000

/** Creates a NEW exam on every call: only call from a user click, never from an effect. */
export const startExam = () => request<StartExamResponse>('/api/v1/exams', { method: 'POST' })

export const submitExam = (examId: number, body: SubmitBody) =>
  request<ExamResult>(`/api/v1/exams/${examId}/submit`, { method: 'POST', json: body, timeoutMs: GEMINI_TIMEOUT_MS })

export const regenerateDiagnosis = (examId: number) =>
  request<Diagnosis>(`/api/v1/exams/${examId}/diagnosis`, { method: 'POST', timeoutMs: GEMINI_TIMEOUT_MS })

export const getExamResult = (examId: number) => request<ExamResult>(`/api/v1/exams/${examId}/result`)
