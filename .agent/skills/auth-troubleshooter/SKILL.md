---
name: auth-troubleshooter
version: 1.1.0
description: "Diagnóstico avanzado de autenticación: validación de JWT, tiempos de expiración y auditoría de seguridad de algoritmos."
---

# Auth Troubleshooter

## Goal
Analizar tokens de usuario para identificar fallos de sesión (401/403) y vulnerabilidades en la configuración del servidor.

## Instructions
1. **Invocación**: Usa el wrapper de comandos para analizar tokens.
   - Windows: `.\.agent\skills\auth-troubleshooter\scripts\check-auth.cmd "<token>"`
2. **Análisis de Seguridad**: Prioriza siempre el campo `security.threat_level`. Si es `CRITICAL`, advierte al usuario sobre el algoritmo `none`.
3. **Validación Temporal**: Compara `expires_in_seconds` para determinar si el problema del usuario es un token caducado.
4. **Contexto de Usuario**: Extrae los claims para verificar si el `user_id` o los roles coinciden con la acción intentada.

## Examples
- **Usuario**: "Mi sesión expira muy rápido."
- **Acción**: Ejecutar script -> Revisar `token_exp` -> Sugerir ajuste de TTL en el backend.

## Constraints
- No almacenar tokens en logs permanentes.
- No solicitar la `SECRET_KEY` del servidor; el análisis es sobre la estructura pública y el payload decodificado.