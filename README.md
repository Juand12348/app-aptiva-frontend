# Aptiva AI — Frontend

Cliente web de Aptiva AI: el estudiante presenta un examen de matemáticas de 30 preguntas (Cálculo y Álgebra, Estadística y Geometría, 10 de cada una), recibe su puntaje sobre 30, un diagnóstico generado con IA y un historial de su evolución.

El backend (FastAPI) es un proyecto aparte. Su contrato está en [`docs/API.md`](docs/API.md).

## Requisitos

- Node.js 20 o superior
- El backend de Aptiva AI corriendo y accesible

## Cómo correrlo

```bash
npm install
cp .env.example .env   # y ajusta VITE_API_URL
npm run dev            # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Revisión de tipos y build de producción en `dist/` |
| `npm run preview` | Sirve el build de `dist/` para probarlo |
| `npm run lint` | ESLint |

## Variables de entorno

| Variable | Ejemplo | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000` | URL base del backend, sin `/` al final |

`.env` no se sube al repositorio; `.env.example` sirve de plantilla. Vite lee la variable al compilar, así que tras cambiarla hay que reiniciar `npm run dev` o volver a hacer el build.

## CORS (importante)

El backend solo acepta peticiones de los orígenes que tenga configurados. Para desarrollo, debe incluir `http://localhost:5173`, y en producción el dominio donde se publique el front.

Abre la app siempre por `http://localhost:5173` y no por `http://127.0.0.1:5173`: para el navegador son orígenes distintos y el segundo será rechazado.

## Cómo funciona (lo que no es obvio)

- **Login** se envía como formulario (`application/x-www-form-urlencoded`, campo `username` = correo), no como JSON.
- **Sesión**: el token JWT dura 60 minutos y no se renueva. Se guarda en `localStorage` (`aptiva:token`). Cualquier 401 en un endpoint protegido cierra la sesión y lleva al login con un aviso. Durante el examen aparece un aviso cuando faltan 5 minutos o menos.
- **Examen en curso**: `POST /exams` crea un examen nuevo en cada llamada y no hay forma de recuperarlo desde el backend. Por eso solo se llama desde un clic (con protección contra doble clic) y el examen se guarda en `localStorage` (`aptiva:exam:{id del estudiante}`) con cada respuesta. Sobrevive a recargas y a cerrar y abrir sesión con el mismo usuario.
- **Envío**: la calificación con diagnóstico tarda de 5 a 40 s; la pantalla queda bloqueada mientras tanto, con un tiempo límite de 60 s. Si el envío falla por red, las respuestas siguen guardadas y se puede reintentar. Un 409 significa que el examen ya fue calificado y lleva al resultado.
- **Diagnóstico**: si la IA falla, el puntaje queda guardado y el resultado muestra «Reintentar diagnóstico».

## Estructura

```
src/
  api/          client.ts (wrapper de fetch: token, timeout, errores), auth.ts, exams.ts, students.ts, types.ts
  auth/         AuthContext, rutas protegidas y de invitado, token y su vencimiento
  pages/        Login, Register, Home, Exam, Result, History, NotFound
  components/   ui/ (botones, campos, alertas, diálogo), exam/, result/, charts/ (Recharts)
  lib/          formato de fechas y puntajes, constantes, examen guardado, hooks
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, React Router y Recharts. Las pantallas de Resultado e Historial (las que usan gráficos) se cargan bajo demanda.

## Diseño

El sistema visual (paleta azul pálido / marino / esmeralda, tipografías Bricolage Grotesque y Figtree autoalojadas, la «lámina» como componente base y las animaciones) está documentado en [`DESIGN.md`](DESIGN.md). Las animaciones se desactivan si el sistema pide reducir el movimiento.
