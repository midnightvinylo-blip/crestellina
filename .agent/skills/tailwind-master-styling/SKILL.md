---
name: tailwind-master-styling
description: CSS Expert. Tailwind avanzado, Animaciones y Diseño Responsivo.
version: 3.0.0
---
# 💅 Protocolo: Tailwind Master

## 1. Sistema de Diseño (Tailwind Config)
- Definir colores semánticos en `tailwind.config.js` (ej: `primary`, `destructive`).
- Uso de variables CSS para soporte nativo de Dark Mode.

## 2. Responsividad (Mobile First)
- Escribir clases base para móvil y prefijos (`md:`, `lg:`) para escritorio.
- Evitar tamaños fijos en píxeles (usar `rem`, `%`, `vh/vw`).

## 3. Animaciones y Transiciones
- **Framer Motion:** Para animaciones complejas de entrada y salida.
- **Micro-interacciones:** `transition-all duration-300 ease-in-out` en botones y tarjetas.