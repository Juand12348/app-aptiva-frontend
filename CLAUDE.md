# Aptiva AI — Frontend

## Qué es esto
Frontend en **React** de Aptiva AI, una app que evalúa estudiantes con un examen de matemáticas de **30 preguntas** (3 componentes × 10 preguntas). El backend califica sobre 30, genera un diagnóstico con Gemini y devuelve datos para un dashboard e historial.

- El **backend ya está hecho** (FastAPI, otro desarrollador). Este repo es solo el frontend.
- Los docs originales del backend mencionan Streamlit; **ignóralo**: aquí el cliente es React. Lo demás del contrato (rutas, formatos, errores) sigue valiendo.
- Todo el texto de la interfaz va **en español**. El código (variables, funciones, archivos) va en **inglés**.

## Documentos que debes leer antes de escribir código
1. `docs/API.md` — contrato completo de los 9 endpoints, tipos TypeScript y casos borde. **Es la fuente de verdad**; no inventes endpoints ni campos.
2. `docs/PANTALLAS.md` — rutas, pantallas, estados y flujos de usuario.
3. `docs/PLAN.md` — fases de construcción con criterios de aceptación. Trabaja **una fase a la vez**.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Recharts (gráficos del dashboard)
- `fetch` nativo con un wrapper propio (sin axios)
- Estado de sesión con Context API (sin Redux ni librerías de estado)

Si una fase pide algo que no está en esta lista, **pregunta antes de instalar dependencias nuevas**.

## Comandos
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Variables de entorno
```
VITE_API_URL=http://127.0.0.1:8000
```
Nunca hardcodear la URL del backend: siempre `import.meta.env.VITE_API_URL`.

## Estructura de carpetas
```
src/
  api/          client.ts (wrapper fetch), auth.ts, exams.ts, students.ts, types.ts
  auth/         AuthContext.tsx, ProtectedRoute.tsx, tokenStorage.ts
  pages/        Login, Register, Home, Exam, Result, History, NotFound
  components/   ui/ (botones, inputs, cards, spinner), charts/, exam/, result/
  lib/          format.ts (fechas, porcentajes), constants.ts, examStorage.ts
```

## Reglas críticas del backend (no romper)
1. **Login es un formulario, no JSON**: `Content-Type: application/x-www-form-urlencoded`, campos `username` (= el correo) y `password`. Usar `URLSearchParams`.
2. **Token JWT dura 60 min, sin refresh.** Ante cualquier **401 en un endpoint protegido** → borrar token y mandar a `/login`. (El 401 del propio login NO es sesión vencida: es "Correo o contraseña incorrectos" y se muestra en el formulario.)
3. **`POST /exams` crea un examen nuevo en cada llamada** y no existe endpoint para recuperar un examen en curso. Se llama **una sola vez, desde un clic del usuario** (nunca desde un `useEffect`, porque React StrictMode lo ejecuta dos veces en dev y crearía dos exámenes). La respuesta se persiste en `localStorage` para sobrevivir recargas.
4. **`submit` tarda 5–15 s (peor caso ~40 s)**: spinner, botón deshabilitado y `timeout` de 60 s (AbortController).
5. **`submit` solo se puede hacer una vez**: 409 = ya fue calificado, no reintentar; llevar al resultado.
6. **`diagnosis` puede venir `null`** (Gemini falló). El puntaje sí queda guardado. Mostrar puntaje + botón «Reintentar diagnóstico».
7. Los errores 401/404/409 traen `detail` como **string en español** listo para mostrar. Los 422 de validación de FastAPI traen `detail` como **lista** en inglés; los 422 de negocio de `submit` traen string. El cliente debe manejar ambos formatos.
8. Fechas del backend: ISO 8601 en **UTC**; mostrarlas en hora local del usuario.
9. **CORS**: el backend solo acepta orígenes configurados (originalmente `http://localhost:8501`). Para Vite hay que agregar `http://localhost:5173` en el backend. Abrir el front siempre por `localhost`, no por `127.0.0.1` (son orígenes distintos).

## Convenciones de código
- Componentes funcionales + hooks, un componente por archivo, nombres en PascalCase.
- TypeScript estricto: sin `any`. Los tipos de la API viven en `src/api/types.ts` y reflejan exactamente `docs/API.md`.
- Toda llamada a la API pasa por `src/api/client.ts` (inyecta el token, maneja 401, parsea errores). Los componentes nunca llaman `fetch` directamente.
- Cada pantalla que carga datos maneja explícitamente **cargando / error / vacío / éxito**.
- Tailwind para estilos; sin CSS suelto salvo lo imprescindible. Diseño responsive (mobile first): los estudiantes pueden usar el celular.
- Accesibilidad básica: labels en inputs, foco visible, botones con texto, contraste suficiente, opciones de respuesta navegables con teclado.
- Mensajes de error al usuario en español y amables; nunca mostrar stack traces ni JSON crudo.

## Cómo trabajar
- Antes de cada fase: lee la fase en `docs/PLAN.md`, di en 3–5 líneas qué vas a hacer y luego hazlo.
- Al terminar una fase: verifica que cumple sus criterios de aceptación, corre `npm run build` y `npm run lint`, y resume qué quedó hecho y qué quedó pendiente.
- Haz un commit por fase con mensaje claro (`feat: auth screens`, etc.).
- Si el contrato de la API es ambiguo o algo no coincide con lo que responde el backend real, **pregunta** en lugar de asumir.
- No toques archivos de configuración (vite, tsconfig, eslint) sin explicar por qué.