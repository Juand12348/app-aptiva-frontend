# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Bachilleres colombianos (grados 10–11) preparándose para las pruebas de Estado (ICFES / Saber 11) o el ingreso a la universidad. Usan la app a menudo desde el celular, para medir su nivel en matemáticas y saber qué estudiar.

## Product Purpose

Aptiva AI evalúa al estudiante con un examen de matemáticas de 30 preguntas (Cálculo y Álgebra, Estadística, Geometría; 10 por componente, dificultad Fácil/Medio/Difícil), lo califica sobre 30 y genera con IA (Gemini) un diagnóstico de fortalezas, aspectos por mejorar y recomendaciones. Éxito: el estudiante termina el examen sin fricción, entiende su resultado de un vistazo y sabe qué hacer después; con el historial ve si está mejorando.

## Positioning

No es un banco de preguntas: el valor es el diagnóstico personalizado por componente y dificultad que sale de cada examen, más la evolución entre intentos.

## Operating Context

- Flujo: registro/login → iniciar examen → responder 30 preguntas (sin límite de tiempo, pero la sesión dura 60 min) → enviar (la calificación + diagnóstico tarda 5–40 s) → dashboard de resultado → historial.
- El examen en curso se guarda localmente y sobrevive recargas.
- Enunciados con notación matemática en texto plano (p. ej. `x^2`).

## Capabilities and Constraints

- Frontend React + Vite + TypeScript + Tailwind + React Router + Recharts; backend FastAPI ya existente (contrato en `docs/API.md`).
- Interfaz en español; mobile first.
- El diagnóstico puede faltar (Gemini falló) y se puede reintentar.

## Brand Commitments

- Nombre: «Aptiva AI».
- Paleta fijada por el usuario, en proporción 60/30/10: dominante azul muy pálido (60 %), secundario azul marino (30 %), acento verde esmeralda (10 %) para llamadas a la acción.
- El usuario pidió una interfaz «súper dinámica» y muy expresiva: transiciones, entradas animadas, feedback visible, celebración ante buenos resultados.
- Tono amable y claro, para adolescentes.

## Evidence on Hand

Ningún logo, ilustración, testimonio ni dato real de usuarios. No inventar cifras de uso, instituciones aliadas ni resultados.

## Product Principles

1. Durante el examen, la concentración manda: la expresividad nunca compite con la pregunta.
2. El resultado se entiende en segundos: puntaje, componente más fuerte y qué estudiar.
3. Nunca perder el trabajo del estudiante (respuestas guardadas, errores amables).
4. Motivar sin mentir: celebrar avances reales, nunca maquillar un mal resultado.

## Accessibility & Inclusion

Uso en celulares de gama media; navegación por teclado en las opciones de respuesta; contraste suficiente; respetar `prefers-reduced-motion` dado el nivel alto de animación.
