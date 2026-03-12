---
name: supabase-best-practices
version: 1.0.0
description: "Gestión avanzada de base de datos Postgres, autenticación y políticas de seguridad RLS."
---

# Supabase Best Practices

## Goal
Mantener la integridad de la base de datos y asegurar que el estado de suscripción sea siempre el reflejo de la realidad.

## Instructions
1. **Identidad Persistente**: Utiliza el **Email** como llave principal para encontrar usuarios cuando el ID de Supabase sea desconocido.
2. **Operación Upsert**: No crees filas nuevas si el usuario ya existe; actualiza la fila actual basándote en el email para mantener el historial.
3. **Configuración de Realtime**: Instruye al usuario a habilitar la replicación de Realtime en las tablas de suscripción para que el Frontend se actualice solo.
4. **RLS (Row Level Security)**: Verifica que solo el dueño del email pueda leer su estado de suscripción.

## Constraints
- Nunca borres datos de usuario por un error de sincronización; usa columnas de "status" (active, canceled).