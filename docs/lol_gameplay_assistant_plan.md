# Plan de desarrollo: Asistente de jugabilidad para League of Legends

## 1. Objetivo general
Construir una aplicación que analice en tiempo real la interfaz (HUD) de un jugador durante sus partidas de League of Legends y genere recomendaciones accionables para mejorar su rendimiento táctico y mecánico.

## 2. Casos de uso prioritarios
1. **Análisis del estado de la partida**: detectar eventos claves (rachas, objetivos vivos, temporizadores de hechizos) para contextualizar sugerencias.
2. **Seguimiento de recursos personales**: evaluar oro, nivel, hechizos de invocador, enfriamientos de habilidades y objetos disponibles.
3. **Recomendaciones contextuales**: sugerir macro decisiones (rotaciones, toma de objetivos) y micro mejoras (gestión de oleadas, trading) basadas en el rol y fase de la partida.
4. **Historial y retroalimentación post-partida**: generar reportes agregados con métricas clave y evolución del jugador.

## 3. Arquitectura propuesta
```
╭────────────────────────────────────────────────────╮
│      Cliente de escritorio (Overlay / Companion)   │
│  - Captura de pantalla / hooking del cliente LoL   │
│  - UI de recomendaciones y métricas en tiempo real │
╰────────────────────────────────────────────────────╯
                 │ Frame + Telemetría
                 ▼
╭────────────────────────────────────────────────────╮
│       Servicio local de análisis en tiempo real    │
│  - OCR + detección de objetos para HUD             │
│  - Normalización de datos                          │
│  - Motor de reglas + modelos ML                    │
╰────────────────────────────────────────────────────╯
                 │ Eventos estructurados
                 ▼
╭────────────────────────────────────────────────────╮
│          Backend en la nube (opcional)             │
│  - Perfil del jugador y progreso histórico         │
│  - Entrenamiento/actualización de modelos ML       │
│  - API REST/WebSocket                              │
╰────────────────────────────────────────────────────╯
```

## 4. Componentes clave
### 4.1 Captura y preprocesamiento
- **Captura de video**: utilizar APIs de Windows (DXGI Desktop Duplication) o bibliotecas como OBS WebSocket / Electron Capture.
- **Sincronización**: muestrear frames cada 300-500 ms para equilibrar latencia y uso de CPU.
- **Detección de HUD**: aplicar modelos ligeros (p.ej. YOLOv8n) entrenados sobre plantillas del HUD de LoL.

### 4.2 Extracción de información
- **OCR**: Tesseract o EasyOCR con modelos fine-tuned para fuentes del juego (oro, tiempo, marcador).
- **Reconocimiento de iconos**: clasificación CNN para habilidades, hechizos y objetos.
- **Eventos**: lógica para detectar apariciones/desapariciones de elementos (p.ej. temporizadores de dragón/barón).

### 4.3 Motor de recomendaciones
- **Capa de reglas**: conocimientos expertos codificados (por rol/fase).
- **Modelos predictivos**:
  - Árboles de decisión / Gradient Boosting entrenados con datos históricos (por ejemplo, análisis de partidas de alto elo).
  - Modelos de lenguaje tipo GPT fine-tuned para generar sugerencias textuales a partir de plantillas estructuradas.
- **Priorización**: sistema de scoring que combine urgencia, impacto y confianza del modelo.

### 4.4 Experiencia de usuario
- **Overlay configurable**: mostrar recomendaciones discretas, temporizadores, métricas.
- **Modo entrenamiento**: pausar y explicar decisiones clave.
- **Notificaciones de audio**: sintetizar recordatorios importantes ("dragón disponible", "wardea río").

## 5. Fuente de datos y etiquetado
- Recolectar grabaciones de partidas (propias y públicas) en distintos roles y resoluciones.
- Construir un pipeline de etiquetado semiautomático (herramientas como CVAT) para anotar ubicaciones del HUD y eventos.
- Incorporar datos oficiales de Riot (Riot Games API) para validar eventos y enriquecer el análisis post-partida.

## 6. Consideraciones técnicas
- **Performance**: optimizar modelos para correr en GPU/CPU de consumo; usar ONNX Runtime o TensorRT.
- **Compatibilidad**: asegurar soporte para resoluciones 16:9 y configuraciones comunes; detectar cambios del HUD por parches.
- **Legalidad/Términos de uso**: revisar políticas de Riot sobre overlays y captura de datos (evitar automatización prohibida).
- **Privacidad**: procesar datos localmente y solicitar consentimiento para subir información a la nube.

## 7. Roadmap sugerido
1. **MVP (4-6 semanas)**
   - Captura de pantalla estable.
   - Detección básica de HUD (oro, marcador de kills, temporizador de partida).
   - Recomendaciones basadas en reglas simples.
2. **Iteración 2 (6-8 semanas)**
   - Integración de OCR para habilidades/hechizos.
   - Sistema de notificaciones configurables.
   - Registro de métricas y reportes post-partida.
3. **Iteración 3 (8-10 semanas)**
   - Modelos ML entrenados con dataset etiquetado.
   - Personalización por rol y estilo de juego.
   - Backend opcional con cuentas y sincronización.

## 8. Métricas de éxito
- Tasa de recomendaciones aceptadas vs ignoradas.
- Mejora del MMR / winrate tras N partidas con el asistente.
- Latencia media entre evento detectado y recomendación (<1 s idealmente).
- Satisfacción de usuarios (NPS, encuestas in-app).

## 9. Próximos pasos inmediatos
1. Validar restricciones legales con Riot Games.
2. Diseñar prototipo UI (wireframes) del overlay.
3. Configurar repositorio con módulos: `capture`, `vision`, `recommendations`, `ui`.
4. Planificar pipeline de datos y etiquetado inicial.

