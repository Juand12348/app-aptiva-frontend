---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages/Login.tsx","src/pages/Register.tsx","src/components/AppLayout.tsx"]
---

# Aptiva AI — app shell, auth y pantallas de estudiante

Scope: toda la app (login, registro, inicio, examen, resultado, historial). Visitor mode: Operate.
Audiencia: bachilleres colombianos (10–11) preparando Saber 11, mayormente en celular.
Tarea: entrar, presentar 30 preguntas, entender su resultado y su evolución.
Restricciones: paleta fijada por el usuario 60/30/10 (azul pálido / marino / esmeralda); «muy expresiva»; respetar prefers-reduced-motion; el examen nunca compite con la pregunta.

## Direction contract

THESIS: Cada examen es un álbum de láminas que se llena: responder «pega» la lámina en su casilla. Rechaza la tarjeta blanca centrada con barra de progreso de toda app educativa.

OWN-WORLD: Fondo azul pálido #EAF2FB (60 %); bandas y tipografía marino #0E2240 (30 %); esmeralda #10B981 dueño exclusivo de todo estado vivo y llamada a la acción (10 %). Láminas: tarjetas blancas con borde blanco grueso, contorno marino de 2px, número de lámina en placa marina inclinada. Casilla vacía = borde punteado; pegada = esmeralda; actual = contorno marino. Display Bricolage Grotesque 800, cuerpo Figtree; cifras tabulares.

STORY: El estudiante reconoce el ritual del álbum, ve cuántas láminas lleva, entiende cada componente como una página (Cálculo y Álgebra 1–10, Estadística 11–20, Geometría 21–30) y termina con su álbum completo y un diagnóstico.

FIRST VIEWPORT: Banda marino arriba con marca «Aptiva.AI» y la página/sección actual en display grande; la tarjeta principal (formulario o pregunta) se monta sobre el borde de la banda como lámina con placa numerada; acción principal esmeralda abajo, a pulgar.

FORM: Álbum de láminas, candidato 5 de 7 de la lista propia. seed: 295932008a4f56aa
Signature interaction: pegar la lámina — al elegir/guardar, la lámina cae con giro leve y rebote y su casilla se rellena en esmeralda; las láminas de la banda flotan e ingresan escalonadas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
