import { request } from './client'
import type { ExamHistoryItem, Student } from './types'

export const getMe = () => request<Student>('/api/v1/students/me')

export const getExamHistory = () => request<ExamHistoryItem[]>('/api/v1/students/me/exams')
