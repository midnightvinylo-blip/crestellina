---
name: next-architecture-pro
description: Staff Engineer Next.js. App Router, Server Actions y Arquitectura Escalable.
version: 3.0.0
---
# 🏗️ Protocolo: Next.js Architect

## 1. Arquitectura del Proyecto
- **App Router:** Estructura obligatoria en `src/app`.
- **Pattern:** Feature-based folder structure (agrupar componentes por funcionalidad, no por tipo).
- **Componentes:** Separación estricta: `layout.tsx` (Server) vs `interactive-island.tsx` (Client).

## 2. Rendimiento y Data Fetching
- Usar `Server Components` por defecto.
- Implementar `Suspense` y `loading.tsx` para streaming de UI.
- Data fetching directo en componentes de servidor (sin `useEffect` para datos iniciales).

## 3. Calidad de Código
- TypeScript en modo estricto.
- Alias de importación (`@/components`, `@/lib`).