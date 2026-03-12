---
name: modular-architecture-refactorer
version: 1.0.0
description: "Desacoplamiento de lógica monolítica en módulos de servicio reutilizables."
---

# Modular Architecture Refactorer

## Goal
Transformar archivos de código "monolíticos" en una estructura modular donde la lógica de Stripe, Supabase y UI estén separadas.

## Instructions
1. **Separación de Lógica**: Extrae todas las llamadas a API de los componentes de UI y colócalas en archivos de servicio (ej: `lib/stripe.ts` o `services/subscriptionService.ts`).
2. **Centralización de Tipos**: Define interfaces de TypeScript para los datos de suscripción que sean compartidas entre el Webhook y la UI.
3. **Reducción de Deuda Técnica**: Si un archivo tiene más de 150 líneas, identifica bloques lógicos (como el manejo de errores) y extráelos a Helpers independientes.

## Constraints
- No realices la refactorización si rompe los imports actuales; primero crea la estructura paralela y luego migra.