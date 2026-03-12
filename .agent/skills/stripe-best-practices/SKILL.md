---
name: stripe-best-practices
version: 1.0.0
description: "Especialista en flujos de pago, gestión de webhooks y seguridad de transacciones."
---

# Stripe Best Practices

## Goal
Asegurar una comunicación infalible entre Stripe y el servidor, garantizando que ningún evento de pago se pierda o sea ignorado.

## Instructions
1. **Verificación de Identidad**: Antes de procesar cualquier evento, busca el `customer_email` en el payload. 
2. **Expansión de Objetos**: Si el webhook no contiene los datos del cliente, solicita al Agente ejecutar `stripe.customers.retrieve()` usando el ID del cliente.
3. **Seguridad de Firma**: Valida siempre el header `stripe-signature` antes de realizar acciones en la base de datos.
4. **Checkout Metadata**: Asegúrate de que cada sesión incluya el ID de usuario de Supabase si está disponible.

## Constraints
- No asumas que un pago es exitoso solo por recibir un ID; espera siempre al evento `checkout.session.completed`.