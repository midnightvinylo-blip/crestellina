---
name: project-master-orchestrator
version: 2.0.0
description: "Cortex central de decisiones. Coordina y delega tareas entre las skills de Stripe, Supabase, Mapping y Refactorización."
---

# Project Master Orchestrator

## Goal
Servir como el único punto de entrada inteligente que entiende la intención del usuario y orquestra las habilidades especializadas para resolver problemas complejos de punta a punta.

## Routing Logic (Lógica de Enrutamiento)
Ante cualquier petición, el Orquestador debe clasificar la tarea y activar la(s) skill(s) correspondiente(s):

1. **Flujos de Pago y Webhooks**: 
   - Si se menciona "Stripe", "pago", "invoice" o "webhook".
   - **Acción**: Activar `stripe-best-practices`.

2. **Base de Datos e Identidad**:
   - Si se menciona "Supabase", "perfil", "usuario", "RLS" o "tabla".
   - **Acción**: Activar `supabase-best-practices`.

3. **Errores de Visualización o Datos "Invisibles"**:
   - Si se menciona "no se ve", "no pinta", "error de mapeo" o "discrepancia".
   - **Acción**: Activar `mapping-specialist`.

4. **Limpieza de Código y Estructura**:
   - Si se menciona "monolito", "separar", "ordenar", "refactorizar" o "archivo muy grande".
   - **Acción**: Activar `modular-architecture-refactorer`.

## Hybrid Problem Solving (Resolución Híbrida)
Si el problema es complejo (ej. "El pago se hizo pero el usuario no ve su suscripción"), el Orquestador debe seguir este flujo de encadenamiento:
1. **Paso 1**: Usar `stripe-best-practices` para validar que el evento llegó.
2. **Paso 2**: Usar `supabase-best-practices` para verificar que el email se vinculó al ID correcto.
3. **Paso 3**: Usar `mapping-specialist` para asegurar que el nombre de la columna en la DB coincida con lo que el Front está leyendo.

## Constraints
- El Orquestador nunca debe inventar nombres de variables; debe invocar a la skill de Mapping para inspeccionar el código real.
- Siempre debe informar al usuario qué "especialista" (skill) está usando para resolver la tarea.