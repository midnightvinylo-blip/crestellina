---
name: video-remotion-master
version: 1.2.0
type: logic-heavy
runtime: nodejs20
capabilities:
  - headless-rendering
  - react-to-video-compilation
  - local-asset-pipelining
activation:
  intent: "render_video_programmatic"
  trigger_phrases:
    - "Genera un video con Remotion"
    - "Renderiza composición de video"
    - "Crea un mp4 con React"
---

# Overview
Motor de renderizado de video programático 100% gratuito. Utiliza los recursos locales del sistema para transformar componentes de React en archivos de video profesionales sin depender de APIs externas.

# Implementation
1. **Engine**: Remotion (Local Node.js Runtime).
2. **Dependencies**: Requiere `ffmpeg` instalado en el sistema y `@remotion/cli`.
3. **Workflow**: 
   - El agente genera el archivo `.tsx`.
   - La skill invoca el comando `npx remotion render`.
   - El archivo resultante se guarda en la carpeta `/out`.

# Constraints
- El tiempo de renderizado depende de la CPU disponible.
- No hay límites de uso ni cuotas mensuales.

# Reference
Documentación de Estándares Antigravity: https://antigravity.google/docs/skills/logic-heavy