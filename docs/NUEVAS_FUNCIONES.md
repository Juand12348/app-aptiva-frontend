# Guía de frontend: examen con tiempo límite y dashboard del estudiante

Todas las rutas llevan `Authorization: Bearer <token>`. Con token vencido el backend responde 401: redirigir a login.

## 1. Examen con tiempo límite: paso a paso

1. **Iniciar.** `POST /api/v1/exams`. Guardar `exam_id`, `started_at`, `expires_at` y las 30 preguntas. Las opciones no traen la correcta.
2. **Corregir el reloj.** Al recibir la respuesta, calcular `offset = started_at - Date.now()`. Usar `Date.now() + offset` como hora actual. Así el contador no depende de la hora del PC.
3. **Persistir el progreso.** Guardar en `localStorage` las respuestas marcadas. El backend no tiene endpoint para recuperar un examen en curso; sin esto, recargar la página pierde todo.
4. **Mostrar el contador.** `expires_at - (Date.now() + offset)`, actualizado cada segundo. Avisar a los 10 min y a 1 min.
5. **Reanudar.** Si hay un examen guardado y `expires_at` no pasó, continuar con el mismo `exam_id`. No llamar a `POST /exams` de nuevo.
6. **Enviar.** Por botón o al llegar el contador a 0: `POST /api/v1/exams/{exam_id}/submit` con `{"answers": [{"question_id": …, "option_id": …}]}`. Solo las preguntas respondidas.
7. **Limpiar.** Borrar el examen de `localStorage` al terminar.

> **Recordatorio:** el backend no bloquea el envío tardío. Solo el front muestra el límite.

## 2. Cómo queda el dashboard

Dos endpoints alimentan todo, ambos de solo lectura.

### `GET /api/v1/students/me/stats` — pantalla principal del estudiante

- **Línea de evolución:** `evolution[].total_score` sobre `max_score`, del examen más antiguo al más reciente.
- **Componentes:** una tarjeta por elemento de `components`, con promedio, último puntaje, máximo y precisión por dificultad.
- **Dificultad global:** `by_difficulty`. Las etiquetas llegan ordenadas alfabéticamente (Difícil, Fácil, Medio); reordenarlas en el front a **Fácil, Medio, Difícil**.
- **Posición en el bloque:** `by_position_in_block`, dos barras: preguntas 1-5 frente a 6-10. Presentarlo como pista orientativa, no como conclusión.
- **Estado vacío:** si `exams_count` es 0, mostrar un mensaje invitando a hacer el primer examen.

### `GET /api/v1/exams/{exam_id}/result` — detalle de un intento

Puntajes, desglose por dificultad y diagnóstico de IA. Se abre al elegir un punto de la línea de evolución o un ítem del historial.

### `GET /api/v1/students/me/exams` — lista de intentos

Trae `has_diagnosis` (verificar el nombre exacto del campo) para decidir si se muestra el botón de ver diagnóstico.

## 3. Alcance

Con esto el backend queda cerrado. Quedan fuera, por decisión nuestra, el tiempo por pregunta y la marca de envío tardío.