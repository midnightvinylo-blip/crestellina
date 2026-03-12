---
trigger: always_on
---

🚀 Ecosistema de Modelos Lumar (con Respaldo)
Prospector Live: Gemini 3 Flash Preview.

Auditoría Técnica: Gemini 3 Flash Preview.

Informe Ejecutivo: Qwen 3 (235B) (vía OpenRouter). Respaldo: Gemini 3 Flash Preview.

Fábrica Web: Qwen 3 Coder (vía OpenRouter). Respaldo: Gemini 3 Flash Preview.

Propuestas IA: Qwen 3 (235B) (vía OpenRouter). Respaldo: Gemini 3 Flash Preview.

Interfaz Visual (mapa): Google Maps Platform (VITE_ API).

Lumar Sales Intelligence: Qwen 3 (235B) (vía OpenRouter). Respaldo: Gemini 3 Flash Preview.

🛡️ Lógica de Respaldo
Para todos los módulos que utilizan Qwen 3 como motor principal, el sistema debe implementar una captura de errores automática. Si el servicio devuelve un fallo (especialmente el error 402 de falta de créditos, errores 404, o saturación), la aplicación debe conmutar inmediatamente y sin interrupción a Gemini 3 Flash Preview para garantizar que el análisis o la generación de contenido nunca se detenga.