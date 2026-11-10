# Plan de construcción — Frontend Aptiva AI

Trabaja **una fase a la vez**. Al terminar cada una: `npm run build` + `npm run lint` sin errores, verificar los criterios, commit y resumen breve. No avances a la siguiente fase sin que el usuario lo confirme.

Lee antes: `CLAUDE.md`, `docs/API.md`, `docs/PANTALLAS.md`.

---

## Fase 0 — Base del proyecto
**Hacer**
- Verificar que el proyecto Vite + React + TS corre. Instalar: `tailwindcss` (+ plugin de Vite según la versión), `react-router-dom`, `recharts`.
- Crear la estructura de carpetas de `CLAUDE.md`.
- `.env` y `.env.example` con `VITE_API_URL=http://127.0.0.1:8000`.
- Configurar rutas vacías para todas las pantallas del mapa de rutas y un `AppLayout` mínimo.
- Revisar que `main.tsx` use `StrictMode` (así se detectan efectos duplicados desde el inicio).

**Aceptación**
- `npm run dev` abre en `http://localhost:5173` y navega entre rutas placeholder.
- Tailwind aplica estilos.
- Probar `GET {VITE_API_URL}/health` desde el navegador: si falla por **CORS**, avisar al usuario que debe agregar `http://localhost:5173` al CORS del backend (no cambiar el backend desde aquí).

## Fase 1 — Capa de API y tipos
**Hacer**
- `src/api/types.ts` exactamente como en `docs/API.md`.
- `src/api/client.ts`: wrapper de `fetch` que lee `VITE_API_URL`, inyecta `Authorization: Bearer`, soporta timeout con `AbortController`, parsea errores a `ApiError` (string vs lista de FastAPI), y ante **401 en endpoints protegidos** limpia el token y dispara el cierre de sesión (callback registrable).
- Funciones tipadas: `health`, `register`, `login` (urlencoded), `getMe`, `startExam`, `submitExam` (timeout 60 s), `regenerateDiagnosis` (timeout 60 s), `getExamResult`, `getExamHistory`.
- `src/auth/tokenStorage.ts` (`aptiva:token`).

**Aceptación**
- Sin `any`. Cada función devuelve el tipo correcto.
- `login` envía `application/x-www-form-urlencoded` con `username`/`password`.
- Un 401 en `login` NO dispara el cierre de sesión global (es credencial incorrecta).

## Fase 2 — Autenticación
**Hacer**
- `AuthContext` (estudiante, estado de carga, `login`, `register`, `logout`), restauración de sesión al cargar vía `getMe`.
- `ProtectedRoute` y redirección de rutas públicas si ya hay sesión.
- Pantallas `Login` y `Register` según `docs/PANTALLAS.md`, con validación y manejo de 401/409/422.
- Aviso de «sesión vencida» al ser expulsado por un 401.

**Aceptación**
- Registro → login automático → Inicio.
- Credenciales malas muestran «Correo o contraseña incorrectos» en el formulario.
- Recargar la página con sesión activa no manda al login.
- Con un token inválido en storage se limpia y se va a login.

## Fase 3 — Layout e Inicio
**Hacer**
- `AppLayout` con barra superior (logo, Inicio, Historial, nombre, cerrar sesión), responsive.
- Pantalla `Inicio`: saludo, tarjeta «Iniciar examen», bloque «Tu último resultado» con el historial.
- `src/lib/examStorage.ts`: guardar/leer/borrar el examen en curso por estudiante (`aptiva:exam:{studentId}`) con `{ exam, answers, currentIndex }`.
- «Iniciar examen» → **solo por clic**, `startExam`, guardar, navegar a `/examen`. «Continuar examen» / «Descartar» si ya hay uno guardado.

**Aceptación**
- Doble clic en «Iniciar examen» no crea dos exámenes.
- Con un examen guardado, Inicio ofrece continuar o descartar (con confirmación).
- Estado vacío correcto cuando no hay historial.

## Fase 4 — Pantalla de examen
**Hacer**
- `Exam` con guarda (sin examen guardado → `/`), pregunta actual, 4 opciones seleccionables, anterior/siguiente, barra de progreso, navegador 1–30 agrupado por componente.
- Cada respuesta/cambio de pregunta se persiste en storage.
- Diálogo de confirmación de envío con el conteo de preguntas sin responder.
- (Sin enviar todavía el submit real si prefieres probar antes; deja el handler listo.)

**Aceptación**
- Recargar en medio del examen conserva respuestas y posición.
- Cerrar sesión y volver a entrar con el mismo usuario retoma el examen.
- Se puede navegar a cualquier pregunta desde el navegador de preguntas.
- Funciona bien en pantalla de celular y con teclado.

## Fase 5 — Envío y resultado/dashboard
**Hacer**
- Handler de `submitExam`: overlay de carga bloqueante, timeout 60 s, y manejo de 200 / 409 / 422 / 401 / 404 / red según `docs/PANTALLAS.md`.
- Pantalla `Resultado` (reutilizable para submit e historial): puntaje global, barras por componente (Recharts), desglose por dificultad (reordenado Fácil → Medio → Difícil, usando `correct/total`), tarjeta de diagnóstico.
- Si `diagnosis === null`: botón «Reintentar diagnóstico» (`regenerateDiagnosis`) con spinner y manejo del 503.
- Cargar por `getExamResult` cuando no llega el resultado por el estado de navegación.

**Aceptación**
- Enviar el examen lleva al resultado y borra el examen guardado.
- Un 409 se trata como «ya calificado» y lleva al resultado.
- Un 422 deja al estudiante en el examen sin perder respuestas.
- Con `diagnosis: null` aparece el botón y, al reintentar con éxito, la tarjeta se actualiza sin recargar.
- Fortalezas/debilidades vacías no dejan secciones vacías.

## Fase 6 — Historial
**Hacer**
- Pantalla `Historial`: gráfico de evolución (si ≥ 2 exámenes), lista/tarjetas con fecha local, puntaje, puntajes por componente, duración y aviso de «Sin diagnóstico»; clic → `/resultado/:id`.

**Aceptación**
- Orden correcto (más reciente primero en la lista, cronológico en el gráfico).
- Estado vacío con botón para iniciar un examen.

## Fase 7 — Pulido y cierre
**Hacer**
- Revisar estados de carga/error/vacío en todas las pantallas; página 404.
- Accesibilidad básica (labels, foco, contraste, teclado) y responsive en 360 px, 768 px y escritorio.
- Aviso opcional de vencimiento de sesión durante el examen (decodificando `exp` del JWT).
- Limpiar código muerto, revisar que ningún componente llame `fetch` directo y que no queden `console.log`.
- `README.md` con cómo correr el proyecto, variables de entorno y nota de CORS.
- Probar el recorrido completo contra el backend real: registro → examen → submit → resultado → historial → reintentar diagnóstico.

**Aceptación**
- Recorrido completo sin errores en consola.
- `npm run build` y `npm run lint` limpios.

---

## Pendientes fuera del front (backend)
- Agregar `http://localhost:5173` (y el dominio de producción cuando exista) al CORS.
- Definir la URL del backend desplegado para `VITE_API_URL` en producción.
- (Mejora futura) endpoint para recuperar un examen en curso.