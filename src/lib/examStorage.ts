import type { StartExamResponse } from '../api/types'

export interface SavedExam {
  exam: StartExamResponse
  /** question_id → option_id */
  answers: Record<number, number>
  currentIndex: number
}

const key = (studentId: number) => `aptiva:exam:${studentId}`

export function loadExam(studentId: number): SavedExam | null {
  try {
    const raw = localStorage.getItem(key(studentId))
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<SavedExam>
    // Storage is user-editable: only trust the shape we wrote.
    if (
      typeof saved.exam?.exam_id !== 'number' ||
      !Array.isArray(saved.exam.questions) ||
      typeof saved.answers !== 'object' ||
      saved.answers === null ||
      typeof saved.currentIndex !== 'number'
    ) {
      return null
    }
    return saved as SavedExam
  } catch {
    return null
  }
}

export function saveExam(studentId: number, saved: SavedExam) {
  localStorage.setItem(key(studentId), JSON.stringify(saved))
}

export function clearExam(studentId: number) {
  localStorage.removeItem(key(studentId))
}

export const answeredCount = (saved: SavedExam) => Object.keys(saved.answers).length
