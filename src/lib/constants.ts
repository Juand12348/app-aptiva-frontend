import type { Component, Difficulty } from '../api/types'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const TOTAL_QUESTIONS = 30

export const OPTION_LETTERS = ['A', 'B', 'C', 'D']

/** One-line personality for each album page. */
export const COMPONENT_NOTES: Record<Component, string> = {
  'Cálculo y Álgebra': 'Ecuaciones, funciones y derivadas.',
  Estadística: 'Datos, promedios y probabilidades.',
  Geometría: 'Figuras, ángulos, áreas y volúmenes.',
}

/** The API sends Difícil, Fácil, Medio (alphabetical); students read easy → hard. */
export const DIFFICULTY_ORDER: Difficulty[] = ['Fácil', 'Medio', 'Difícil']

export const DIFFICULTY_LEVEL: Record<Difficulty, number> = { Fácil: 1, Medio: 2, Difícil: 3 }
