import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { startExam } from '../api/exams'
import { saveExam } from './examStorage'

/** Starts a new exam from a user click. Every POST /exams creates an exam, so a ref blocks repeat clicks. */
export function useStartExam(studentId: number) {
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const startingRef = useRef(false)

  async function start() {
    if (startingRef.current) return
    startingRef.current = true
    setStarting(true)
    setError('')
    try {
      const exam = await startExam()
      saveExam(studentId, {
        exam,
        answers: {},
        currentIndex: 0,
        clockOffset: Date.parse(exam.started_at) - Date.now(),
      })
      navigate('/examen')
    } catch (err) {
      startingRef.current = false
      setStarting(false)
      setError(getErrorMessage(err))
    }
  }

  return { start, starting, error }
}
