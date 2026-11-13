import { request } from './client'
import type { ExamHistoryItem, Student, StudentStats } from './types'

export const getMe = () => request<Student>('/api/v1/students/me')

export const getExamHistory = () => request<ExamHistoryItem[]>('/api/v1/students/me/exams')

export const getMyStats = () => request<StudentStats>('/api/v1/students/me/stats')
