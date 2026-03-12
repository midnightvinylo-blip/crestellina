---
name: performance-optimization-guard
description: Web Vitals Specialist. Velocidad de carga extrema y auditoría Lighthouse.
version: 3.0.0
---
# ⚡ Protocolo: Performance Guard

## 1. Core Web Vitals (Objetivos)
- **LCP:** < 1.2s (Prioridad máxima).
- **FID/INP:** < 100ms.
- **CLS:** 0 (Estabilidad visual total).

## 2. Optimización de Activos
- **Imágenes:** Formato AVIF/WebP + atributos `sizes` correctos.
- **Fuentes:** `next/font` para evitar CLS y waterfall de carga.
- **Scripts:** Deferir todos los scripts de terceros (GTM, Analytics, Chatbots).

## 3. Auditoría de Código
- Code Splitting automático.
- Tree-shaking de librerías no utilizadas.