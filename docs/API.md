# Contrato de la API — Aptiva AI

Fuente: páginas de Notion «Endpoints Auth», «Endpoints Exámenes» y «Endpoints Dashboard». Backend FastAPI.

- **Base URL (local):** `http://127.0.0.1:8000` → en el front: `VITE_API_URL`
- **Swagger:** `{BASE}/docs` · **OpenAPI:** `{BASE}/openapi.json`
- **Auth:** header `Authorization: Bearer <access_token>` en todos los endpoints marcados «Token: sí».

## Resumen

| # | Método | Ruta | Token | Para qué |
|---|--------|------|-------|----------|
| 1 | GET | `/health` | No | Estado de API y base de datos |
| 2 | POST | `/api/v1/auth/register` | No | Crear cuenta (no inicia sesión) |
| 3 | POST | `/api/v1/auth/login` | No | Obtener token (**formulario**, no JSON) |
| 4 | GET | `/api/v1/students/me` | Sí | Datos del estudiante autenticado |
| 5 | POST | `/api/v1/exams` | Sí | Iniciar examen (devuelve 30 preguntas) |
| 6 | POST | `/api/v1/exams/{exam_id}/submit` | Sí | Enviar respuestas: puntaje + diagnóstico IA |
| 7 | POST | `/api/v1/exams/{exam_id}/diagnosis` | Sí | Regenerar diagnóstico si falló |
| 8 | GET | `/api/v1/exams/{exam_id}/result` | Sí | Resultado de un examen ya enviado |
| 9 | GET | `/api/v1/students/me/exams` | Sí | Historial de exámenes enviados |
| 10 | GET | `/api/v1/students/me/stats` | Sí | Estadísticas agregadas para el dashboard |

---

## Tipos TypeScript (`src/api/types.ts`)

```ts
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
```

---

## 1. `GET /health`
Sin token ni body.

| Código | Respuesta |
|---|---|
| 200 | `{"status": "ok", "database": "ok"}` |
| 503 | `{"status": "degraded", "database": "unavailable"}` |

## 2. `POST /api/v1/auth/register`
`Content-Type: application/json`

```json
{ "full_name": "Ana Pérez", "email": "ana@correo.com", "password": "clave-segura" }
```

| Campo | Reglas |
|---|---|
| `full_name` | Obligatorio, 1–150 caracteres (se recortan espacios) |
| `email` | Obligatorio, formato correo, máx. 150 (se guarda en minúsculas) |
| `password` | Obligatorio, **8–128** caracteres. Nunca se devuelve |

| Código | Cuándo | Respuesta |
|---|---|---|
| 201 | Cuenta creada | `{"id": 2, "full_name": "Ana Pérez", "email": "ana@correo.com"}` |
| 409 | Correo ya registrado (sin distinguir mayúsculas) | `{"detail": "Ya existe una cuenta con ese correo"}` |
| 422 | Campo faltante / correo inválido / contraseña corta | Formato de validación (ver «Errores») |

**No inicia sesión.** Tras registrar, el front puede llamar a `/login` automáticamente con las mismas credenciales.

## 3. `POST /api/v1/auth/login`
`Content-Type: application/x-www-form-urlencoded` — **es un formulario, NO JSON** (estándar OAuth2).

```ts
const body = new URLSearchParams({ username: email, password });
fetch(`${API}/api/v1/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body,
});
```

| Campo | Contenido |
|---|---|
| `username` | El **correo** del estudiante |
| `password` | La contraseña |

| Código | Cuándo | Respuesta |
|---|---|---|
| 200 | OK | `{"access_token": "eyJhbGciOi...", "token_type": "bearer"}` |
| 401 | Correo no existe o contraseña incorrecta (mismo mensaje a propósito) | `{"detail": "Correo o contraseña incorrectos"}` |
| 422 | Falta `username` o `password` | Formato de validación |

Token: dura **60 minutos**, **sin refresh token**. Al vencer, la API responde 401 y hay que volver a iniciar sesión.

## 4. `GET /api/v1/students/me`

| Código | Cuándo | Respuesta |
|---|---|---|
| 200 | Token válido | `{"id": 2, "full_name": "Ana Pérez", "email": "ana@correo.com"}` |
| 401 | Sin token | `{"detail": "No autenticado"}` |
| 401 | Token malformado, vencido o cuenta inexistente | `{"detail": "Token inválido o vencido"}` |

## 5. `POST /api/v1/exams`
Sin body. **Cada llamada crea un examen nuevo.**

Respuesta `201`:

```json
{
  "exam_id": 12,
  "started_at": "2026-11-06T15:04:05.123456Z",
  "expires_at": "2026-11-06T16:04:05.123456Z",
  "questions": [
    {
      "question_id": 87,
      "position": 1,
      "component": "Cálculo y Álgebra",
      "difficulty": "Medio",
      "statement": "¿Cuál es la derivada de f(x) = x^2?",
      "options": [
        {"option_id": 341, "text": "x"},
        {"option_id": 342, "text": "2x"},
        {"option_id": 343, "text": "x^3"},
        {"option_id": 344, "text": "2"}
      ]
    }
  ]
}
```

- `expires_at` = `started_at` + 1 h (según el ejemplo del backend). **El backend no bloquea envíos tardíos**: el límite solo lo aplica el front.
- Reloj: `offset = started_at − Date.now()` al recibir la respuesta; hora actual = `Date.now() + offset`. Así el contador no depende de la hora del PC.
- Siempre 30 preguntas, 10 por componente, sin repetir.
- `position` 1–30, agrupadas por componente: **1–10 Cálculo y Álgebra, 11–20 Estadística, 21–30 Geometría**.
- Siempre 4 opciones; ninguna indica cuál es la correcta.
- Errores: 401 (sin token / inválido / vencido).
- **No existe endpoint para recuperar un examen en curso** → guardar la respuesta en `localStorage`.
- Los enunciados pueden traer notación matemática en texto plano (ej. `x^2`); mostrarlos tal cual, respetando saltos de línea (`whitespace-pre-line`).

## 6. `POST /api/v1/exams/{exam_id}/submit`
`Content-Type: application/json`. **Solo se puede enviar una vez.** Tarda **5–15 s** (peor caso ~40 s) porque espera a Gemini → spinner + `timeout` 60 s.

```json
{ "answers": [ {"question_id": 87, "option_id": 342}, {"question_id": 15, "option_id": 60} ] }
```

- `answers`: lista de 0 a 30. Las preguntas sin responder **no se envían** y cuentan como incorrectas.
- `question_id` debe ser de este examen y no repetirse; `option_id` debe ser una de las 4 opciones de esa pregunta.

Respuesta `200` (tipo `ExamResult`):

```json
{
  "exam_id": 12,
  "total_score": 18,
  "max_score": 30,
  "components": [
    {
      "component": "Cálculo y Álgebra", "score": 3, "max_score": 10,
      "by_difficulty": [
        {"difficulty": "Difícil", "correct": 1, "total": 6},
        {"difficulty": "Fácil", "correct": 1, "total": 1},
        {"difficulty": "Medio", "correct": 1, "total": 3}
      ]
    },
    {"component": "Estadística", "score": 6, "max_score": 10, "by_difficulty": ["..."]},
    {"component": "Geometría", "score": 9, "max_score": 10, "by_difficulty": ["..."]}
  ],
  "diagnosis": {
    "strengths": ["Demuestras un excelente desempeño en Geometría, con 9 de 10 puntos."],
    "weaknesses": ["Tienes dificultades en las preguntas difíciles de Cálculo y Álgebra, con 1 acierto de 6."],
    "recommendations": ["Prioriza el estudio de Cálculo y Álgebra...", "Practica ejercicios de nivel medio y difícil...", "Refuerza los problemas complejos de Estadística."]
  }
}
```

Notas de presentación:
- `components` viene en orden alfabético (Cálculo y Álgebra, Estadística, Geometría).
- `by_difficulty` viene alfabético (Difícil, Fácil, Medio). **Reordenar en el front a Fácil → Medio → Difícil.**
- La cantidad de preguntas por dificultad **varía en cada examen** (se eligen al azar): para comparar usar `correct / total`, no `correct` solo.
- `diagnosis.strengths` / `weaknesses` pueden venir vacíos (0/30 o 30/30): no mostrar la sección vacía.
- `diagnosis` puede ser **`null`**: mostrar puntaje + botón «Reintentar diagnóstico» (endpoint 7).

| Código | Cuándo | Respuesta |
|---|---|---|
| 200 | Calificado y cerrado | Ver arriba |
| 401 | Sin token / inválido / vencido | `{"detail": "No autenticado"}` / `{"detail": "Token inválido o vencido"}` |
| 404 | Examen inexistente o de otro estudiante | `{"detail": "Examen no encontrado"}` |
| 409 | Ya fue enviado | `{"detail": "El examen ya fue enviado"}` |
| 422 | Pregunta no pertenece al examen | `{"detail": "La pregunta 99999 no pertenece a este examen"}` |
| 422 | Opción no pertenece a la pregunta | `{"detail": "La opción 60 no pertenece a la pregunta 87"}` |
| 422 | Pregunta repetida | `{"detail": "Hay preguntas respondidas más de una vez"}` |
| 422 | Body mal formado (falta `answers`, ids no numéricos, más de 30) | Formato FastAPI: `detail` es lista |

- Un **422 no cierra el examen**: se corrige y se reenvía.
- Un **409** significa que ya está calificado: **no reintentar**; navegar al resultado (`GET /result`).

## 7. `POST /api/v1/exams/{exam_id}/diagnosis`
Sin body. Pide a Gemini un diagnóstico nuevo para un examen ya enviado (reemplaza el anterior). También tarda **5–15 s** → spinner.

Respuesta `200` (tipo `Diagnosis`):

```json
{ "strengths": ["..."], "weaknesses": ["..."], "recommendations": ["...", "...", "..."] }
```

| Código | Cuándo | Respuesta |
|---|---|---|
| 200 | Generado y guardado | Ver arriba |
| 401 | Token | `{"detail": "No autenticado"}` / `{"detail": "Token inválido o vencido"}` |
| 404 | Examen inexistente o ajeno | `{"detail": "Examen no encontrado"}` |
| 409 | Examen aún no enviado | `{"detail": "El examen aún no ha sido enviado"}` |
| 503 | Gemini no respondió / inválido / saturado | `{"detail": "No se pudo contactar a Gemini"}` (texto puede variar) |

Ante un **503**: mostrar «El diagnóstico no está disponible en este momento, intenta en unos minutos» y **dejar el botón activo**.

## 8. `GET /api/v1/exams/{exam_id}/result`
Devuelve el **mismo formato** que `submit` (`ExamResult`) → **reutilizar el mismo componente** para ambas pantallas. Es rápido: **no llama a Gemini**. Sirve para abrir un examen desde el historial o recargar el dashboard.

| Código | Cuándo | Respuesta |
|---|---|---|
| 200 | Examen enviado | `ExamResult` |
| 401 | Token | igual que arriba |
| 404 | Inexistente o ajeno | `{"detail": "Examen no encontrado"}` |
| 409 | Examen en curso (no enviado) | `{"detail": "El examen aún no ha sido enviado"}` |

## 9. `GET /api/v1/students/me/exams`
Lista los exámenes **enviados** del estudiante, del más reciente al más antiguo. Los exámenes en curso no aparecen. Sin exámenes → `[]`.

```json
[
  {
    "exam_id": 15,
    "started_at": "2026-11-06T16:20:00.000000Z",
    "finished_at": "2026-11-06T16:41:12.000000Z",
    "total_score": 24, "max_score": 30,
    "components": [ {"component": "Cálculo y Álgebra", "score": 7, "max_score": 10, "by_difficulty": ["..."]} ],
    "has_diagnosis": true
  }
]
```

- Duración = `finished_at − started_at`.
- `has_diagnosis: false` → mostrar aviso en la tabla (Gemini falló y nunca se regeneró).
- **No incluye el texto del diagnóstico**; para verlo abrir el examen con `/result`.
- Errores: solo 401.

## 10. `GET /api/v1/students/me/stats`
Solo lectura. Ejemplo completo en `docs/data/student.json`. Forma: ver `StudentStats` arriba.

- `evolution`: del examen más antiguo al más reciente; `total_score` sobre `max_score`.
- `by_difficulty` (global y por componente) llega **alfabético** (Difícil, Fácil, Medio): reordenar en el front a **Fácil, Medio, Difícil**.
- `by_position_in_block`: `"1-5"` frente a `"6-10"`; mostrar como pista orientativa, no como conclusión.
- `accuracy` es una fracción 0..1 (redondeada a 2 decimales).
- Sin exámenes: `exams_count: 0` → estado vacío invitando al primer examen (no se verificó qué trae el resto de campos en ese caso; tratarlos como posiblemente vacíos).
- Errores: solo 401.

---

## Errores: cómo parsearlos

**Negocio (401, 404, 409 y los 422 de `submit`)** → `detail` es un **string en español**, listo para mostrar.

**Validación FastAPI (422)** → `detail` es una **lista** con mensajes en inglés:

```json
{ "detail": [ { "type": "string_too_short", "loc": ["body", "password"], "msg": "String should have at least 8 characters", "input": "corta", "ctx": {"min_length": 8} } ] }
```

Usar `loc[loc.length - 1]` para saber qué campo falló. **Recomendación:** validar en el formulario antes de enviar (correo con `@`, contraseña ≥ 8) para que casi nunca llegue un 422.

**500** → error inesperado; mensaje genérico: «Algo salió mal, intenta de nuevo».

Sugerencia de helper en `client.ts`:

```ts
export class ApiError extends Error {
  constructor(public status: number, message: string, public field?: string) { super(message); }
}
// parseError: si detail es string → message = detail
//             si detail es array  → message = "Revisa los datos ingresados", field = loc.at(-1)
```

## Próximo punto pendiente en el backend
- Agregar el origen del front (`http://localhost:5173` y el dominio de producción cuando exista) a la lista de CORS.
- (Opcional, mejora futura) endpoint para recuperar un examen en curso. Mientras no exista, el front lo cubre con `localStorage`.