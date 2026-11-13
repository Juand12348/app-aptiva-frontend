export type Component = "Cálculo y Álgebra" | "Estadística" | "Geometría";
export type Difficulty = "Fácil" | "Medio" | "Difícil";

export interface Student { id: number; full_name: string; email: string; }

export interface TokenResponse { access_token: string; token_type: "bearer"; }

export interface RegisterBody { full_name: string; email: string; password: string; }

export interface QuestionOption { option_id: number; text: string; }

export interface Question {
  question_id: number;
  position: number;            // 1..30
  component: Component;
  difficulty: Difficulty;
  statement: string;
  options: QuestionOption[];   // siempre 4, sin indicar la correcta
}

export interface StartExamResponse {
  exam_id: number;
  started_at: string;          // ISO 8601 UTC (hora del servidor: base para corregir el reloj)
  expires_at: string;          // ISO 8601 UTC, límite del examen (el backend no bloquea envíos tardíos)
  questions: Question[];       // siempre 30
}

export interface Answer { question_id: number; option_id: number; }
export interface SubmitBody { answers: Answer[]; }   // 0..30 elementos

export interface DifficultyBreakdown { difficulty: Difficulty; correct: number; total: number; }

export interface ComponentScore {
  component: Component;
  score: number;               // sobre 10
  max_score: number;           // 10
  by_difficulty: DifficultyBreakdown[];  // orden alfabético: Difícil, Fácil, Medio
}

export interface Diagnosis {
  strengths: string[];         // 0..4, puede venir vacío
  weaknesses: string[];        // 0..4, puede venir vacío
  recommendations: string[];   // 3..5, siempre al menos una
}

export interface ExamResult {
  exam_id: number;
  total_score: number;         // sobre 30
  max_score: number;           // 30
  components: ComponentScore[];// 3, orden alfabético
  diagnosis: Diagnosis | null; // null si Gemini falló
}

export interface ExamHistoryItem {
  exam_id: number;
  started_at: string;
  finished_at: string;
  total_score: number;
  max_score: number;
  components: ComponentScore[];
  has_diagnosis: boolean;
}

/** Acierto agregado; `label` es Difícil/Fácil/Medio (alfabético) o "1-5"/"6-10". */
export interface AccuracyBucket { label: string; correct: number; total: number; accuracy: number; }  // accuracy 0..1

export interface EvolutionPoint {
  exam_id: number;
  finished_at: string;
  total_score: number;
  max_score: number;
  component_scores: Record<Component, number>;
}

export interface ComponentStats {
  component: Component;
  average_score: number;
  latest_score: number;
  max_score: number;           // 10
  by_difficulty: AccuracyBucket[];
}

export interface StudentStats {
  exams_count: number;         // 0 → estado vacío
  evolution: EvolutionPoint[]; // del más antiguo al más reciente
  components: ComponentStats[];
  by_difficulty: AccuracyBucket[];
  by_position_in_block: AccuracyBucket[];  // "1-5" y "6-10"
}

export interface HealthResponse { status: string; database: string; }
