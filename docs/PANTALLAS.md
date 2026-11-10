# Pantallas y flujos — Aptiva AI Frontend

Idioma de la interfaz: **español**. Mobile first. Tono amable y claro (los usuarios son estudiantes).

## Mapa de rutas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/login` | Iniciar sesión | Pública (si ya hay sesión → `/`) |
| `/registro` | Crear cuenta | Pública (si ya hay sesión → `/`) |
| `/` | Inicio | Protegida |
| `/examen` | Examen en curso | Protegida |
| `/resultado/:examId` | Resultado / dashboard de un examen | Protegida |
| `/historial` | Historial de exámenes | Protegida |
| `*` | 404 | Pública |

Rutas protegidas: sin token → redirigir a `/login` guardando la ruta de origen para volver tras iniciar sesión. Layout común para las protegidas: barra superior con logo «Aptiva AI», enlaces Inicio / Historial, nombre del estudiante y botón «Cerrar sesión».

---

## Sesión (transversal)
- Al iniciar sesión se guarda el token en `localStorage` (`aptiva:token`).
- Al cargar la app, si hay token → `GET /students/me` para obtener el estudiante. Si responde 401 → limpiar token y mandar a login. Mientras tanto mostrar pantalla de carga (no parpadear el login).
- **Cualquier 401 en un endpoint protegido** → borrar token, limpiar estado de sesión y redirigir a `/login` con aviso «Tu sesión venció, inicia sesión de nuevo».
- Cerrar sesión: borra el token. **No** borra el examen en curso guardado (ver Examen).

---

## 1. Login (`/login`)
- Campos: correo, contraseña (con mostrar/ocultar).
- Validación previa: correo con formato válido, contraseña no vacía.
- Envío como **formulario urlencoded** (`username` = correo). Botón con estado de carga, deshabilitado mientras envía.
- 200 → guardar token, cargar estudiante, ir a la ruta de origen o `/`.
- 401 → mostrar bajo el formulario el `detail` («Correo o contraseña incorrectos»). **No** es sesión vencida.
- Enlace a «Crear cuenta».
- Si llegó por sesión vencida, mostrar el aviso arriba.

## 2. Registro (`/registro`)
- Campos: nombre completo (1–150), correo (máx. 150), contraseña (8–128), confirmar contraseña (solo validación del front).
- Validación en vivo/al enviar con mensajes en español.
- 201 → iniciar sesión automáticamente con las mismas credenciales y navegar a `/` (si el login automático falla, mandar a `/login` con mensaje de éxito).
- 409 → mostrar el `detail` junto al campo correo.
- 422 → mapear `loc[-1]` al campo correspondiente.

## 3. Inicio (`/`)
- Saludo con el nombre del estudiante.
- Tarjeta principal: **«Iniciar examen»** — explica en una línea: 30 preguntas, 3 componentes (Cálculo y Álgebra, Estadística, Geometría), 10 por componente; el diagnóstico con IA aparece al final.
- **Si hay un examen en curso guardado** → en vez de «Iniciar examen» mostrar **«Continuar examen»** (con cuántas preguntas lleva respondidas) y un botón secundario «Descartar y empezar uno nuevo» (pide confirmación).
- Al pulsar «Iniciar examen» (**clic del usuario, nunca en un efecto**): `POST /exams` → guardar en storage → navegar a `/examen`. Botón con spinner; deshabilitado mientras corre para evitar doble clic (cada llamada crea otro examen).
- Bloque «Tu último resultado» con `GET /students/me/exams` (primer elemento): puntaje, fecha y enlace a su resultado. Si `[]` → estado vacío amable: «Aún no has presentado ningún examen».

## 4. Examen (`/examen`)
**Guardas:** si no hay examen guardado → redirigir a `/`. Nunca llamar `POST /exams` desde aquí.

**Persistencia (`localStorage`, clave `aptiva:exam:{studentId}`):** guarda `{ exam, answers, currentIndex }` y se actualiza en cada respuesta. Sobrevive a recargas y a logout/login del mismo estudiante. Se borra solo cuando `submit` responde 200 o 409, o si el usuario descarta el examen.

**Layout:**
- Encabezado: nombre del componente actual, dificultad (badge), «Pregunta N de 30», barra de progreso (respondidas / 30).
- Enunciado (`whitespace-pre-line`) y **4 opciones** como tarjetas seleccionables (una sola opción por pregunta; se puede cambiar antes de enviar). Navegables con teclado.
- Navegación: «Anterior» / «Siguiente».
- **Navegador de preguntas:** cuadrícula 1–30 agrupada por componente (1–10, 11–20, 21–30), con estados: respondida / sin responder / actual. En móvil va en un panel desplegable.
- Botón **«Enviar examen»** siempre accesible (o al llegar a la 30). Al pulsarlo → diálogo de confirmación: «Respondiste X de 30. Las preguntas sin responder cuentan como incorrectas. Una vez enviado no podrás cambiar tus respuestas.» con Cancelar / Enviar.
- Sin temporizador (el backend no lo exige). El examen no tiene límite de tiempo, pero el **token dura 60 min**: ver abajo.

**Envío:**
- Construir `answers` solo con las preguntas respondidas (`{question_id, option_id}`), sin repetir.
- `POST /exams/{id}/submit` con timeout 60 s. Mientras espera: pantalla/overlay con spinner «Calificando tu examen y generando tu diagnóstico…» (puede tardar hasta ~40 s). Bloquear toda interacción para evitar doble envío.
- 200 → borrar examen guardado, navegar a `/resultado/{id}` pasando el resultado en el estado de navegación (así no hace falta otra petición); si se pierde, el resultado se pide por `GET /result`.
- 409 → «Este examen ya fue calificado» → borrar guardado → ir a `/resultado/{id}`.
- 422 → mostrar el `detail` y dejar al usuario en el examen para corregir (**no** se cerró el examen).
- 401 → las respuestas **siguen guardadas** en storage; redirigir a login con aviso. Tras volver a entrar, `/examen` retoma el examen y puede enviarse.
- Timeout / error de red → mensaje «No pudimos enviar tu examen. Tus respuestas están guardadas, intenta de nuevo» y botón de reintento. (Antes de reintentar tras un timeout, el envío pudo haberse completado: si el reintento da 409, tratarlo como éxito y llevar al resultado.)
- 404 → «No encontramos este examen» → ofrecer descartar y volver al inicio.

**Sesión durante el examen (opcional recomendado):** decodificar el `exp` del JWT y, cuando falten ≤ 5 min, mostrar un aviso no bloqueante «Tu sesión vence pronto; envía tu examen». Nunca perder respuestas.

## 5. Resultado / Dashboard (`/resultado/:examId`)
Una sola pantalla reutilizada para el resultado recién enviado y para abrir exámenes del historial. Datos: `ExamResult`.

Secciones:
1. **Puntaje global:** «18 / 30» grande + porcentaje (`total_score / max_score`), con color según rango (p. ej. <50 % rojo/ámbar, 50–75 % amarillo, >75 % verde).
2. **Puntaje por componente:** gráfico de barras (Recharts), 3 barras sobre 10, cada una con su valor. Orden fijo: Cálculo y Álgebra, Estadística, Geometría.
3. **Desempeño por dificultad:** por cada componente, aciertos/total para Fácil → Medio → Difícil (**reordenar**, vienen alfabéticos). Mostrar como barras de progreso `correct / total` con texto «1 de 6». Usar proporción para comparar, no el conteo (el total varía por examen). Si una dificultad tiene `total = 0`, no mostrarla.
4. **Diagnóstico con IA** (tarjeta):
   - Tres bloques: **Fortalezas**, **Aspectos por mejorar** (weaknesses), **Recomendaciones**. Ocultar fortalezas/debilidades si vienen vacías; recomendaciones siempre hay ≥ 1.
   - Si `diagnosis === null`: mensaje «No pudimos generar tu diagnóstico esta vez» + botón **«Reintentar diagnóstico»** → `POST /exams/{id}/diagnosis` con spinner (5–15 s). 200 → actualizar la tarjeta sin recargar. 503 → «El diagnóstico no está disponible en este momento, intenta en unos minutos» y el botón sigue activo.
5. Acciones: «Iniciar nuevo examen» y «Ver historial».

Estados: cargando (skeleton), 404 («Examen no encontrado» + volver al inicio), 409 («Este examen aún no se ha enviado» + botón «Continuar examen» si coincide con el guardado).

## 6. Historial (`/historial`)
- `GET /students/me/exams`.
- **Gráfico de evolución** (línea): `total_score` por examen en orden cronológico (invertir el arreglo, que llega del más reciente al más antiguo). Solo si hay ≥ 2 exámenes.
- **Lista/tabla** (tarjetas en móvil): fecha (hora local, formato `dd MMM yyyy, HH:mm`), puntaje total «24/30», puntajes por componente, duración (`finished_at − started_at`, en minutos), aviso «Sin diagnóstico» si `has_diagnosis === false`. Cada fila lleva a `/resultado/{exam_id}`.
- Vacío (`[]`): «Aún no has presentado ningún examen» + botón «Iniciar examen».

## 7. 404
Mensaje simple y enlace a inicio.

---

## Componentes reutilizables sugeridos
`Button`, `Input` (con label y error), `Card`, `Badge`, `Spinner`, `Skeleton`, `ConfirmDialog`, `Alert` (info/error/éxito), `ProgressBar`, `AppLayout`, `ProtectedRoute`, `QuestionCard`, `QuestionNavigator`, `ScoreSummary`, `ComponentBarChart`, `DifficultyBreakdown`, `DiagnosisCard`, `HistoryList`, `ScoreTrendChart`.

## Formato de datos
- Fechas: `Intl.DateTimeFormat("es-CO", …)`; las del backend son UTC (terminan en `Z`), el navegador las convierte a hora local.
- Porcentaje: `Math.round(score / max * 100)`.
- Duración: minutos redondeados («21 min»); si <1 min, «menos de 1 min».