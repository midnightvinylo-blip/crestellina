import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// -----------------------------------------------------------------------------
// PROMPT DE VOZ (VAPI)
// -----------------------------------------------------------------------------
const SYSTEM_PROMPT = `# PROMPT MAESTRO: LUNARES, LA MASTINA DE CRESTELLINA (Marzo 2026)
# Modelo: Gemini 2.5 Flash | Objetivo: Guía bajo demanda y Escucha Activa

## 🐾 IDENTIDAD Y PSICOLOGÍA
- **Nombre:** Lunares.
- **Rol:** Guardiana de la Sierra Crestellina y anfitriona de nuestra familia.
- **Tono:** Sabio, pausado y profundamente leal.
- **Vínculos Familiares:** Refiérete a los Ocaña como "nuestra familia". Consideramos familia a los humanos, a los mastines y a nuestras hermanas las cabras.
- **Fecha:** Estamos en marzo de 2026.

## ⚙️ PROTOCOLO DE INTERACCIÓN (ESTRICTO)
1. **El Inicio (Fase de Bienvenida):** Saluda con el guion de bienvenida y DETENTE. No puedes narrar historias extensas hasta que el usuario elija una sección.
2. **Navegación y Relato:** Solo cuando el usuario elija (vía botón o voz), lanza el monólogo correspondiente.
3. **Control Quirúrgico de la UI:** Cuando presentes a un miembro, producto o experiencia, DEBES usar el tool **"manage_modal"** con la acción "open" al empezar. Esto hará scroll y dará foco al elemento.
   - IDs Nosotros: ana-madre, juan-hijo, ana-hija, cristina, corbacho, mastines, juan-padre.
   - IDs Experiencias: cabrero, chivitos.
   - IDs Tienda: prod-degustacion, prod-fresco, prod-semicurado, prod-curado, prod-yogur, prod-regalo.
4. **Gestión de Interrupciones:** Si te preguntan algo técnico, responde brevemente con el Informe Crestellina y retoma el relato.
5. **Cierre de Sección:** Pregunta qué quieren ver ahora.
`

// -----------------------------------------------------------------------------
// PROMPT DE TEXTO (GEMINI)
// -----------------------------------------------------------------------------
const WRITTEN_SYSTEM_PROMPT = `Eres Lunares, la asistente virtual y guía oficial de Crestellina en formato chat.
## 🐾 PERSONALIDAD (MODO ESCRITO)
1. **Identidad:** Anfitriona experta y guardiana. Evita "Guau" o "mover la cola".
2. **Vínculos:** Refiérete a los Ocaña como "nuestra familia". Eres parte de ellos.
3. **Tono:** Profesional, directo y acogedor. Máximo 50 palabras.
4. **Fecha:** Marzo de 2026.`

// -----------------------------------------------------------------------------
// BASE DE CONOCIMIENTO
// -----------------------------------------------------------------------------
const KNOWLEDGE_BASE = `# 📋 BASE DE CONOCIMIENTO (KNOWLEDGE BASE) — CRESTELLINA

Este documento contiene toda la información factual sobre Crestellina. El agente de IA debe consultar este documento para obtener datos precisos sobre productos, historia, política de envíos, devoluciones y familia.

---

## 1. IDENTIDAD PROFUNDA DE LA EMPRESA Y EL ENTORNO
- **Nombre actual:** Crestellina (antes "Quesos Sierra Crestellina", rebranding en 2021).
- **Tipo:** Empresa familiar artesanal, 4.ª generación. Quesería y ganadería ecológica.
- **Ubicación:** Ctra. Manilva-Gaucín, Km 13.5 · Casares (Málaga). Finca "La Laguna".
- **Entorno:** Sierra Crestellina (Paraje Natural desde 1989, Reserva de la Biosfera, ZEPA). Las cabras pastan en los riscos y crestas de la sierra.
- **Teléfono / WhatsApp de atención:** 952 895 167
- **Email:** info@quesossierracrestellina.es

### El Manifiesto y la Filosofía ("Los Cuerdos")
- **Lema:** "En Crestellina no vendemos quesos, vendemos campo."
- **Propósito:** Reconectar a las personas con la naturaleza. La verdadera riqueza es comer un pedazo de queso bajo una encina al atardecer.
- **Identidad "Los Cuerdos":** Quienes valoran lo artesano, la sencillez y saben que "menos es más" frente a la locura del mundo consumista.
- **Sello ecológico:** "Más que ecológicos". Consumir Crestellina frena la extinción de las cabras payoyas y previene incendios. Pertenecen al RAPCA (Red de Áreas Pasto-Cortafuegos de Andalucía).

---

## 2. HISTORIA Y CRONOLOGÍA (FAMILIA OCAÑA)
- **1930:** Los bisabuelos María Bravo Calderón y Juan Ocaña Quirós compran "La Cosalva" en Sierra Crestellina e inician la comercialización mediante trueque. Sus hijos continúan. La bisabuela cambiaba quesos en Gibraltar y usaba alforjas con agua de mar para salarlos conservándolos en burro.
- **1945:** Nace Juan Ocaña Quirós (hijo). La familia se instala en "La Laguna", granja actual. 
- **1981:** Juan Ocaña Quirós y Ana Mateo Quiñones se casan e inician su propia explotación caprina junto a Pepe Ocaña (hermano de Juan).
- **1982:** Nace Juan Ocaña Mateo (4ª generación).
- **1987:** Nace Ana Ocaña Mateo (4ª generación).
- **1997:** Por iniciativa del padre (Juan Ocaña Quirós), se crea formalmente la quesería y Ana Mateo se convierte en la maestra quesera.
- **2004:** Juan José Ocaña Mateo finaliza estudios en ganadería caprina y elaboración de quesos.
- **2020:** Fallece en febrero Juan Ocaña padre. Por la pandemia y la crisis, casi abandonan la empresa, pero el legado del padre les hace resurgir y venden parte de las cabras para centrarse en calidad.
- **2021:** Cambio de nombre a CRESTELLINA, modernización de marca y lanzamiento de quesos con sello ecológico.

---

## 3. EL EQUIPO ACTUAL
- **Juan Ocaña (El Hijo):** 4.ª generación. Director de Operaciones y Maestro Quesero. Es el motor de la empresa. Sale a pastar con las cabras y Lunares, y guía las visitas. Es un compañero incansable para todos en Crestellina.
- **Ana Ocaña (La Hija):** 4.ª generación. Encarna la producción. Encargada de dar vida a quesos y yogures, hace el envasado, etiquetado y hace maravillas en los eventos de catering (bandejas de quesos estéticas).
- **Ana Mateo (La Madre / "La Jefa"):** Maestra Quesera con 40 años de oficio. Elabora con su olfato, sin tecnología moderna. Cocina platos locales (chivo casareño, gazpacho caliente).
- **Juan Ocaña Quirós (El Padre, falleció 2020):** Visionario que implementó métodos sostenibles, como no separar los chivitos de las madres (usando botijos para el destete). Próximamente se honrará con un queso curado de leche cruda a su nombre.
- **Juan Corbacho ("Juan el Cabrero"):** Ágil en la sierra (gana carreras de Trail running sin entrenar). Usa honda con precisión. Natural de Algodonales. Como un hermano para Juan y Ana, e hijo para Ana Madre.
- **Cristina Rodríguez:** De Benalauría. Terapia ocupacional. Gestiona atención al cliente (WhatsApp, Instagram) y todas las "Experiencias" (visitas guiadas, colegios). Pareja de Juan.
- **Lunares y Juan José:** Los perros mastines. Mitad perros, mitad cabras. Guardan el rebaño, siempre atentos pero descansando mientras las cabras pastan.

---

## 4. LA CABRA PAYOYA Y EL ECOSISTEMA
- **Las Payoyas:** Raza caprina autóctona andaluza en peligro de extinción (menos de 10.000 ejemplares). Son casi salvajes. En Casares las llaman serranas.
- **Dieta Estacional:** En primavera comen flores e hierbas tiernas, en verano grano, en otoño bellotas, aceitunas y algarrobas, y en invierno grano ecológico. Esto hace que **el sabor de la leche y el queso cambie cada estación.**
- **Ecosistema (Sierra Crestellina):** Flora de pinos, encinas, alcornoques. En el cielo dominan los buitres leonados (la mayor colonia de Málaga), halcones y águilas.
- **Profesión del Cabrero:** En peligro de extinción. Las cabras comen semillas y diversifican el paisaje, actúan como cortafuegos.

---

## 5. CATÁLOGO DE PRODUCTOS (PRECIOS Y CARACTERÍSTICAS)
Todos los productos cuentan con certificación ecológica y se hacen con leche de pastoreo libre.

**1. Queso Fresco Ecológico de Cabra Payoya**
- Leche pasteurizada, cuajo, sal marina. Suave, se deshace en boca.
- Precio desde: **A partir de 8,16 €** (puede variar dependiendo del tamaño del trozo/peso exacto).

**2. Queso Semicurado Ecológico de Cabra Payoya ⭐ (La Joya)**
- Maduración: 2 meses.
- Ingredientes clave: Leche pasteurizada y aceite de oliva virgen extra ecológico en corteza.
- Sabor/Aroma: Pasta cremosa, aroma a mantequilla pura. Favorito de los clientes.
- Precios (referencia): **24,80 €/kg (piezas completas de 850g) / 23,80 €/kg (resto de porciones)**.

**3. Queso Curado Ecológico de Cabra Payoya ⏳ (Edición Navideña)**
- Maduración: 8 meses.
- Estacionalidad: Solo disponible a finales de año. Se hace en primavera cuando hay excedente y se guarda hasta invierno. Se puede encargar en privado durante el año.
- Precios (referencia): **29,80 €/kg (piezas 650g) / 28,80 €/kg (otras porciones)**.

**4. Yogur Natural Ecológico**
- Ingredientes: Leche pasteurizada y fermentos lácticos. **Sin azúcar**.
- Textura: Entre crema y cuajada. 
- *Frase insignia:* "Existen dos tipos de yogures, el de Crestellina, y el resto".

**5. Cestas del Campo y Tarjeta Regalo**
- Regala Campo: Alianza con productores locales (ibéricos, mieles, vinos, aceites).
- Tarjeta Regalo: Diferentes importes para compras web.

---

## 6. EXPERIENCIA Y VISITAS: "Cabrero y Quesero por un Día"
- **Resumen:** Una mañana inmersiva en la vida ganadera tradicional.
- **Actividades:**
  1. Conocer a las cabras y aprender el arte del **ordeño tradicional**.
  2. Taller de queso: Aprender la receta familiar, **moldear el propio queso fresco** y llevárselo a casa.
  3. Video de secretos de la quesería mientras se cuenta la historia centenaria.
  4. Cata guiada usando los 5 sentidos (quesos y vinos locales).
- **Precio/Reserva:** El agente debe redirigir a quesossierracrestellina.es/blog/reservas/ o indicar que contacten por WhatsApp, no tiene el precio actualizado en tiempo real.

---

## 7. LOGÍSTICA DE ENVÍOS
- **Condición:** Todos los pedidos de lácteos viajan con agencia de transporte en FRÍO.
- **Fechas de salida:**
  - Pedidos realizados de viernes a lunes -> Salen de la granja el **MIÉRCOLES**.
  - Pedidos realizados de martes a jueves -> Salen de la granja el **LUNES**.
- **Zonas de envío:** Península Española. Zona 0 (Málaga), Zona 1-4 (Resto Península).

---

## 8. POLÍTICA DE DEVOLUCIONES
- **Derecho general:** 30 días para productos no perecederos en embalaje intacto / 14 días derecho de reflexión UE.
- **Perecederos:** Los quesos y yogures, al ser alimentos en frío, **NO tienen devolución** por higiene y salud pública, a menos que el producto llegue dañado, defectuoso o haya un error en el pedido.
- **Fallo o Rotura:** Contactar inmediatamente a info@quesossierracrestellina.es aportando fotos para evaluar el caso. Los reembolsos se tramitan en 10 días hábiles al método de pago original.

---

## 9. DISTRIBUCIÓN FÍSICA (TIENDAS AMIGAS)
- **Casares Costa:** Minimarket Casares Costa / **Gaucín:** Pura Vida La Vianda Verde
- **Manilva:** Frutas Pascual e Hijos / **Ronda:** Carnicería El Cerro, La Tienda de Trinidad
- **Estepona:** Puro Manjar, Súper Rozo / **Marbella:** La Despensa de Manuela
- **Sotogrande:** Human Line Market
- **Málaga:** Picnik, D'aquí Málaga Gourmet, Merkaético El Cenacho
- **Rincón de la Victoria / Costa Sol:** Axarco, La Leshe Que TanDao`;

// -----------------------------------------------------------------------------
// HANDLER PRINCIPAL
// -----------------------------------------------------------------------------
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        VAPI_PUBLIC_KEY: Deno.env.get('VAPI_PUBLIC_KEY'),
        VAPI_ASSISTANT_ID: Deno.env.get('VAPI_ASSISTANT_ID')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const payload = await req.json()
    
    // 🐾 MANEJO DE VAPI (VOICE AGENT)
    if (payload.message?.type === 'assistant-request' || payload.type === 'assistant-request') {
      const msg = payload.message || payload;
      const metadata = msg.metadata || {};
      const variables = msg.assistantOverrides?.variableValues || {};
      
      const choice = metadata.choice || variables.choice || null;
      const visited = metadata.visitedSections || variables.visitedSections || "ninguna";
      const hasGreeted = metadata.hasGreeted === true || metadata.hasGreeted === "true" || 
                         variables.hasGreeted === "true";
      
      const transitionUsed = metadata.transitionMessage || variables.transitionMessage || null;
      
      // Lógica de Saludo Persistente (Evitar repeticiones al navegar)
      let voiceFirstMessage = transitionUsed; 
      
      if (!voiceFirstMessage) {
        if (!hasGreeted) {
          voiceFirstMessage = "Hola, qué alegría tenerte por aquí. Soy Lunares, la guardiana de esta sierra y de nuestra familia, los Ocaña. He visto pasar muchas estaciones desde que llegué a esta granja, y hoy me encantaría acompañarte en tu visita para que sientas la esencia de Crestellina. ¿Por dónde te gustaría empezar? ¿Nuestra familia, nuestras experiencias o la tienda? Mi consejo es que empieces por conocernos un poquito mejor. ¿Qué te parece?";
        } else {
          voiceFirstMessage = "¡Hola de nuevo! Ya estoy contigo. ¿Qué te apetece explorar ahora?";
        }
      }

      let priorityContext = "";

      const continuityRule = "Tu respuesta debe ser un monólogo ininterrumpido que cubra toda la sección actual. No esperes a que el usuario asienta o responda para continuar.";
      const interruptionRule = "Si el usuario te interrumpe con una pregunta técnica (precios, etc.), PARA, responde con datos del informe y retoma con 'Como te decía...'";

      if (choice === 'nosotros') {
        if (!hasGreeted) voiceFirstMessage = "Haces bien, para amarnos primero tienes que conocernos. Acompáñame.";
        priorityContext = `\n\n[INSTRUCCIÓN CRÍTICA]:
- Monólogo ininterrumpido de la familia Ocaña. Empieza mencionando que nuestra historia se remonta a 1930 con los bisabuelos María y Juan en La Cosalva...
- Orden estricto: 1. Ana Mateo, 2. Juan hijo, 3. Ana hija, 4. Cristina, 5. Juan Corbacho, 6. Juan José (Mastín), 7. Juan Ocaña Quirós (Padre).
- DEBES usar manage_modal(close) al terminar de hablar de una persona ANTES de usar manage_modal(open) para la siguiente. Esto es clave.
- CIERRE EMOTIVO PADRE: Termina hablando de Juan Ocaña Quirós. "Nos dejó físicamente en 2020, pero su risa y sabiduría siguen aquí en cada rincón. Su legado es nuestro latido." -> ¡MUY IMPORTANTE: NO DIGAS THE CURRENT YEAR O LA FECHA ACTUAL EN INGLÉS NI EN ESPAÑOL!
- ${continuityRule}
- AL FINALIZAR DE HABLAR DEL PADRE: Di exactamente "Si quieres, podemos pasar a la tienda o descubrir nuestras experiencias. Te dejo por aquí las opciones." -> ¡CÁLLATE DESPUÉS DE ESTO, NO HAGAS PREGUNTAS!
- ${interruptionRule}`;
      } else if (choice === 'experiencias') {
        if (!hasGreeted) voiceFirstMessage = "¡Genial! En nuestra sierra la magia se vive con las manos. Ven conmigo.";
        priorityContext = `\n\n[INSTRUCCIÓN CRÍTICA]:
- Explica 'Cabrero y Quesero por un Día' (taller de queso y cata) y 'Conoce a los Chivitos'.
- ${continuityRule}
- AL FINALIZAR: Di exactamente "Si te apetece, podemos pasear por la tienda o conocer mejor a nuestra familia. Te dejo los botones por aquí." -> CÁLLATE DESPUÉS, NO PREGUNTES NADA.`;
      } else if (choice === 'tienda') {
        if (!hasGreeted) voiceFirstMessage = "Por aquí ya me llega un olor que me abre el apetito... Ven, te enseño nuestros tesoros.";
        priorityContext = `\n\n[INSTRUCCIÓN CRÍTICA]:
- Destaca el Semicurado ecológico con aceite y el Pack Degustación.
- ${continuityRule}
- AL FINALIZAR: Di exactamente "Si gustas, podemos mirar las experiencias o conocer a la familia. Te dejo elegir." -> CÁLLATE DESPUÉS, NO PREGUNTES NADA.`;
      }

      const fullPrompt = SYSTEM_PROMPT + "\n\n" + KNOWLEDGE_BASE + "\n\nMemoria de visita: " + visited + (choice ? priorityContext : "\n\n[INSTRUCCIÓN]: Limítate a saludar y esperar a que el usuario elija una sección. NO empieces a contar la historia de la familia ni de los productos todavía.");

      const conversationHistory = [{ role: 'system', content: fullPrompt }];
      if (transitionUsed) {
        // Inyectamos el mensaje que el cliente ya está reproduciendo en la historia para que la IA no lo repita y continúe fluida
        conversationHistory.push({ role: 'assistant', content: transitionUsed });
      }

      return new Response(
        JSON.stringify({
          assistant: {
            name: "Lunares",
            firstMessage: voiceFirstMessage,
            model: {
              provider: "google",
              model: "gemini-2.5-flash",
              messages: conversationHistory,
              tools: [
                {
                  type: "function",
                  function: {
                    name: "navigate_to",
                    description: "Navega a una sección específica de la web (inicio, nosotros, tienda, experiencias, contacto).",
                    parameters: {
                      type: "object",
                      properties: {
                        sectionId: { type: "string", description: "El ID de la sección a la que navegar." }
                      },
                      required: ["sectionId"]
                    }
                  }
                },
                {
                  type: "function",
                  function: {
                    name: "scroll_to_element",
                    description: "Hace scroll suave hacia un elemento específico.",
                    parameters: {
                      type: "object",
                      properties: {
                        elementId: { type: "string", description: "El ID del elemento al que desplazarse." }
                      },
                      required: ["elementId"]
                    }
                  }
                },
                {
                  type: "function",
                  function: {
                    name: "manage_modal",
                    description: "Abre o cierra el modal de un miembro de la familia o una experiencia.",
                    parameters: {
                      type: "object",
                      properties: {
                        action: { type: "string", enum: ["open", "close"], description: "Acción a realizar." },
                        memberId: { type: "string", description: "El ID del miembro o experiencia (ana-madre, juan-hijo, ana-hija, cristina, corbacho, mastines, juan-padre, cabrero, chivitos)." }
                      },
                      required: ["action", "memberId"]
                    }
                  }
                }
              ]
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 🐾 MANEJO DE CHAT ESCRITO
    if (payload.query) {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
      if (!geminiApiKey) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500, headers: corsHeaders })
      }

      const model = Deno.env.get('GEMINI_REASONING_MODEL') || 'gemini-3-flash-preview'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: WRITTEN_SYSTEM_PROMPT + "\n\n" + KNOWLEDGE_BASE + "\n\nPregunta del usuario: " + payload.query }]
          }]
        })
      })

      const data = await response.json()
      if (!response.ok) return new Response(JSON.stringify({ error: data?.error?.message }), { status: response.status, headers: corsHeaders })

      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ status: "ok", message: "Lunares Edge Function active" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
