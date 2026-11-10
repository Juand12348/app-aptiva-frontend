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
  started_at: string;          // ISO 8601 UTC
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

export interface HealthResponse { status: string; database: string; }
