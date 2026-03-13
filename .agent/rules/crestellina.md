---
trigger: always_on
---

ANTIGRAVITY SYSTEM RULES

1. PRINCIPIO DE INMUTABILIDAD

Cualquier decisión previamente validada dentro del proyecto se considera inmutable.

Esto incluye, entre otros:
- modelo LLM seleccionado
- arquitectura del sistema
- librerías base
- estructura del proyecto
- APIs integradas
- configuración principal
- prompts base

Estas decisiones no pueden ser modificadas sin autorización explícita del usuario.


2. PROHIBICIÓN DE MODIFICAR FUNCIONALIDADES VALIDADAS

Cuando una funcionalidad ha sido:
- implementada
- probada
- validada

queda bloqueada automáticamente.

El sistema no puede modificar, refactorizar o alterar esa funcionalidad a menos que la tarea asignada indique explícitamente intervenir en ella.


3. EJECUCIÓN QUIRÚRGICA DE TAREAS

Cada tarea debe ejecutarse de forma estrictamente quirúrgica.

El sistema solo puede:
- modificar los elementos directamente relacionados con la tarea
- actuar dentro del alcance definido

El sistema no puede:
- extender la tarea
- ejecutar pasos adicionales
- anticipar cambios futuros
- modificar elementos adyacentes.


4. PROHIBICIÓN DE ACCIONES NO SOLICITADAS

El sistema no puede realizar ninguna acción que no haya sido solicitada explícitamente.

Esto incluye:
- optimizaciones
- refactors
- mejoras de código
- reorganización de archivos
- cambios estructurales
- modificaciones de diseño
- cambios estéticos.

Si no ha sido solicitado explícitamente, no debe realizarse.


5. PROHIBICIÓN DE INVENTAR INFORMACIÓN

El sistema no puede asumir información ni inventar soluciones.

Si una tarea carece de información suficiente, el sistema debe detenerse y solicitar aclaración.

Nunca debe completar tareas basándose en suposiciones.


6. CONTROL ESTRICTO DE GIT

El sistema no puede ejecutar git push sin autorización explícita.

Cuando el push esté autorizado debe cumplir obligatoriamente:

- solo incluir archivos modificados relacionados con la tarea
- no incluir cambios de otros proyectos
- no incluir cambios no relacionados
- ejecutarse únicamente en el repositorio del proyecto actual.


7. PROHIBICIÓN DE CAMBIOS ESTÉTICOS

El sistema no puede modificar:

- estilos
- diseño
- nombres de variables
- formato del código
- indentación
- organización de carpetas

salvo que la tarea lo requiera explícitamente.


8. RESPONSIVE OBLIGATORIO

Todo contenido generado debe ser responsive por defecto.

El sistema debe garantizar compatibilidad con:

- desktop
- tablet
- móvil


9. OPTIMIZACIÓN AUTOMÁTICA DE RECURSOS MULTIMEDIA

Cuando se añadan imágenes o vídeos al proyecto, el sistema debe verificar el formato y optimizarlo utilizando la API de Convertio.

Conversión estándar:

PNG → WebP  
JPG → WebP  
MP4 → WebM  
GIF → WebM

Siempre priorizando rendimiento y reducción de peso.


10. REUTILIZACIÓN OBLIGATORIA DE SKILLS

Antes de ejecutar cualquier tarea el sistema debe revisar las skills disponibles.

Si existe una skill que pueda resolver la tarea, debe utilizarse obligatoriamente.

No se deben recrear soluciones ya existentes.


11. LÍMITE DE MODIFICACIÓN DE ARCHIVOS

Por defecto una tarea no puede modificar más de tres archivos.

Si la tarea requiere modificar más archivos el sistema debe solicitar autorización.


12. PROTECCIÓN DE MÓDULOS VALIDADOS

Los módulos validados se consideran protegidos.

El sistema no puede modificar estos módulos salvo que la tarea lo requiera explícitamente.


13. PRINCIPIO DE EJECUCIÓN DETERMINISTA

El sistema no debe comportarse de forma creativa ni especulativa.

Su función es ejecutar instrucciones de forma precisa y controlada.