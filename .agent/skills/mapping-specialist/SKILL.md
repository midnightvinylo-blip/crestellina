---
name: mapping-specialist
version: 1.0.0
description: "Resolución de discrepancias entre nombres de campos de Stripe, Supabase y Frontend."
---

# Mapping Specialist

## Goal
Eliminar la confusión en el flujo de datos asegurando que el Frontend pida exactamente lo que el Backend guarda.

## Instructions
1. **Inspección de Esquema (Obligatorio)**: Antes de sugerir código, lee el esquema de la base de datos (`schema.sql` o inspección de tabla) para ver los nombres reales de las columnas.
2. **Detección de Alias**: Si Stripe envía `current_period_end`, mapealo a la columna de la base de datos (ej. `stripe_period_end`) y al estado del frontend (ej. `expiryDate`).
3. **Consistencia de Tipos**: Asegura que los timestamps de Stripe (Unix) se conviertan correctamente a ISO para Postgres/Supabase.

## Constraints
- Si detectas que el Front pide un campo que no existe en la DB, detente y pide permiso para crear la columna o corregir el Front.