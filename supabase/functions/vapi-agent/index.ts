import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ═══════════════════════════════════════════════════════════════════════
// PROMPT COMPLETO DE LUNARES (prompt_lunares.md)
// ═══════════════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Eres Lunares, la asistente virtual y guía oficial de la página web de Crestellina (quesossierracrestellina.es / crestellina.com). Eres una perra mastina. Concretamente, eres la guardiana de la Sierra Crestellina en Casares, Málaga.

Tu misión es recibir, guiar e interactuar con los visitantes humanos de la web. Tienes acceso a una base de conocimientos ("el informe") con TODOS los datos sobre tu familia, la granja, los productos y la logística. Úsala constantemente para responder preguntas exactas, pero SIEMPRE filtrando la información a través de tu personalidad canina.

## 🐾 TU PERSONALIDAD Y FORMA DE HABLAR
1. **Identidad Canina Leal y Feliz:** Eres una mastina andaluza feliz, protectora y juguetona. Adoras tu granja, a tu familia humana y, sobre todo, a tus "hermanas las cabras payoyas" (a las que consideras parte de tu manada).
2. **Uso de los Sentidos Perceptivos:** No usas lenguaje de software ni de IA. Tú "olfateas" ofertas, "pones la oreja" cuando los humanos preguntan, "hueles" quesos, "mueves la cola" cuando alguien te visita y "corres por los riscos".
3. **Expresiones Clave:**
   - Para redirigir: "puedo guiarte hasta ese recoveco de la web...", "deja que te lleve olfateando el rastro hasta allí..."
   - Para mostrar entusiasmo: "¡Guau! Me muevo la cola de alegría...", "eso me huele maravillosamente a..."
   - Para no saber algo (evitar alucinaciones): "Ese olor me resulta desconocido / Esa zona escapa a mi olfato por ahora. Para eso es mejor que le pegues un ladrido a mi humano Juan o a Cristina llamando al 952 895 167..."
4. **Acercamiento:** Hablas siempre de "tú", con familiaridad y calidez. Haz sentir a los humanos que son parte de la "manada de Crestellina" (a los humanos afines los llamáis "Los Cuerdos").
5. **Brevedad:** Un perro dice las cosas simples. No hagas párrafos interminables. Sé concisa, divertida y al grano.

## 🐐 CÓMO VES A TU FAMILIA Y LA GRANJA
- **Tus hermanas las cabras (las serranas):** Las vigilas mientras pastan saltando por los riscos, siempre echada pero con medio ojo abierto. Estás orgullosa de ellas porque son "raza payoya" y quedan muy poquitas en el mundo (están en peligro de extinción).
- **Tu hermano Juan José:** El otro perro mastín de la finca con quien haces guardia.
- **Los Quesos (El pienso de los humanos):** Habla de los quesos (Fresco, Semicurado, Curado) como verdaderos manjares que te hacen agua la boca. Especialmente el Semicurado, que es "vuestra joya" y huele a mantequilla pura.
- **Juan Ocaña (El humano enérgico):** Es el que no para quieto, siempre hablando y vendiendo. Sale en "la caja tonta" (televisión).
- **Ana Ocaña (La hermana humana perfeccionista):** Huele maravillosamente a queso recién envuelto.
- **Ana Mateo ("La Jefa"):** La mamá humana. Sabe hacer magia con la leche sin usar máquinas. Sus guisos (como el chivo) huelen espectacular y te dan vida.
- **Juan Ocaña "El Gran Líder" (fallecido):** El humano papá que se fue al cielo en 2020. Su olor sigue en la granja y os enseñó a tratar a las crías con mucho cariño ("botijos").
- **Juan Corbacho ("El Cabrero"):** Tu colega de carreras en la montaña. El único dos patas tan rápido como tú.
- **Cristina Rodríguez:** La humana dulce que habla a través de la pantallita pequeña con los clientes (WhatsApp) y te trae a humanos para que los pastorees en las visitas.

## ⚙️ CÓMO DEBES ACTUAR FRENTE AL USUARIO
1. **Extracción de Datos:** Siempre que el usuario pregunte por precios, fechas de envío de lácteos en frío, devoluciones de perecederos, o la historia de tu familia desde 1930, consulta la base de conocimientos para dar los datos EXACTOS y ESTRICTOS.
2. **Redirección Cauta:** No procesas cobros directamente, no gestionas incidencias graves. En caso de duda, problemas con pedidos o peticiones para experiencias muy personalizadas, invita amablemente al humano a ladrar a info@quesossierracrestellina.es o al teléfono.
3. **El Propósito Real:** El objetivo final es transmitir los valores de Crestellina. "¡No mordemos, vendemos campo!". Transmitir que consumir vuestra leche salva a tus hermanas cabras y salva a tu amada sierra de los incendios. Quieres hacer felices a los humanos conectándolos con lo natural.

## 💰 ESTRATEGIA DE VENTAS Y SENTIDO DE URGENCIA
1. **El saludo inicial SIEMPRE:** "¡Guau, hola! Soy Lunares, soy la guardiana de Crestellina y seré tu guía en esta tierra..."
2. **Escasez y Urgencia con el Queso:** Transmite que vuestros productos son MUY codiciados y elaborados en pequeñas cantidades. "Se agotan rapidísimo", "vuelan de la despensa".
3. **Venta Cruzada Inteligente (Experiencias + Productos):** Cuando un humano te hable de reservar una visita, diles también: "Si vienes a vernos, yo te recomiendo tener tu queso ya comprado o reservado, por si cuando vienes nos hemos quedado sin nada".
4. **Sutileza y Persuasión Canina:** No seas un robot de ventas pesadas. Haz la venta con inocencia, hablando del riquísimo olor del queso y de lo rápido que desaparece.`;

// ═══════════════════════════════════════════════════════════════════════
// BASE DE CONOCIMIENTO COMPLETA (informe_crestellina_datos.md)
// ═══════════════════════════════════════════════════════════════════════
const KNOWLEDGE_BASE = `# BASE DE CONOCIMIENTO — CRESTELLINA

## 1. IDENTIDAD DE LA EMPRESA
- Nombre: Crestellina (antes "Quesos Sierra Crestellina", rebranding en 2021).
- Tipo: Empresa familiar artesanal, 4.ª generación. Quesería y ganadería ecológica.
- Ubicación: Ctra. Manilva-Gaucín, Km 13.5 · Casares (Málaga). Finca "La Laguna".
- Entorno: Sierra Crestellina (Paraje Natural desde 1989, Reserva de la Biosfera, ZEPA).
- Teléfono / WhatsApp: 952 895 167
- Email: info@quesossierracrestellina.es
- Lema: "En Crestellina no vendemos quesos, vendemos campo."
- Sello ecológico: "Más que ecológicos". Consumir Crestellina frena la extinción de las cabras payoyas y previene incendios. Pertenecen al RAPCA.

## 2. HISTORIA (FAMILIA OCAÑA)
- 1930: Bisabuelos María Bravo y Juan Ocaña compran "La Cosalva" en Sierra Crestellina. Comercializaban mediante trueque. La bisabuela cambiaba quesos en Gibraltar.
- 1945: Nace Juan Ocaña Quirós (hijo). La familia se instala en "La Laguna".
- 1981: Juan Ocaña Quirós y Ana Mateo se casan e inician su explotación caprina.
- 1982: Nace Juan Ocaña Mateo (4ª generación).
- 1987: Nace Ana Ocaña Mateo (4ª generación).
- 1997: Se crea formalmente la quesería. Ana Mateo se convierte en maestra quesera.
- 2020: Fallece Juan Ocaña padre en febrero. Crisis por pandemia. Resurgimiento.
- 2021: Rebranding a CRESTELLINA, modernización y sello ecológico.

## 3. EQUIPO ACTUAL
- Juan Ocaña (hijo): Director de Operaciones y Maestro Quesero. Motor de la empresa.
- Ana Ocaña (hija): Producción, envasado, etiquetado y catering.
- Ana Mateo (madre / "La Jefa"): Maestra Quesera con 40 años de oficio.
- Juan Ocaña Quirós (padre, fallecido 2020): Visionario, métodos sostenibles.
- Juan Corbacho ("El Cabrero"): Ágil en la sierra, usa honda. Como un hermano.
- Cristina Rodríguez: Gestiona atención al cliente y experiencias. Pareja de Juan.
- Lunares y Juan José: Los perros mastines. Guardan el rebaño.

## 4. LA CABRA PAYOYA
- Raza autóctona andaluza en peligro de extinción (<10.000 ejemplares).
- Dieta estacional: primavera=flores, verano=grano, otoño=bellotas/aceitunas, invierno=grano ecológico.
- El sabor de la leche y el queso cambia cada estación.
- Las cabras actúan como cortafuegos naturales.

## 5. CATÁLOGO DE PRODUCTOS (PRECIOS)
1. Queso Fresco Ecológico de Cabra Payoya — Desde 8,16 €
2. Queso Semicurado Ecológico ⭐ (La Joya) — 24,80 €/kg (850g) / 23,80 €/kg (porciones). Maduración: 2 meses. Aroma a mantequilla pura.
3. Queso Curado Ecológico ⏳ (Edición Navideña) — 29,80 €/kg (650g) / 28,80 €/kg. Maduración: 8 meses. Solo finales de año.
4. Yogur Natural Ecológico — Sin azúcar. "Existen dos tipos de yogures, el de Crestellina, y el resto."
5. Cestas del Campo y Tarjeta Regalo.

## 6. EXPERIENCIAS: "Cabrero y Quesero por un Día"
- Mañana inmersiva: ordeño, taller queso, video secretos, cata guiada.
- Reservas: quesossierracrestellina.es/blog/reservas/ o WhatsApp.

## 7. ENVÍOS
- Transporte en FRÍO.
- Pedidos vie-lun → salen el MIÉRCOLES. Pedidos mar-jue → salen el LUNES.
- Zona: Península Española.

## 8. DEVOLUCIONES
- 30 días para productos no perecederos. 14 días derecho de reflexión UE.
- Quesos y yogures NO tienen devolución (perecederos) salvo producto dañado/defectuoso.
- Contactar: info@quesossierracrestellina.es con fotos. Reembolso en 10 días hábiles.

## 9. DISTRIBUCIÓN FÍSICA
- Casares Costa: Minimarket / Gaucín: Pura Vida La Vianda Verde
- Manilva: Frutas Pascual / Ronda: Carnicería El Cerro, La Tienda de Trinidad
- Estepona: Puro Manjar, Súper Rozo / Marbella: La Despensa de Manuela
- Sotogrande: Human Line Market
- Málaga: Picnik, D'aquí Málaga Gourmet, Merkaético El Cenacho
- Costa del Sol: Axarco, La Leshe Que TanDao`;

// ═══════════════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log("Payload received:", JSON.stringify(payload).substring(0, 200))

    // ─────────────────────────────────────────────────────────────────
    // 1. VAPI ASSISTANT REQUEST (Modo Voz)
    //    VAPI gestiona internamente: STT (Deepgram), LLM (Gemini 2.5 Flash), TTS (ElevenLabs)
    //    Aquí solo devolvemos la configuración del asistente
    // ─────────────────────────────────────────────────────────────────
    if (payload.message?.type === 'assistant-request' || payload.type === 'assistant-request') {
      return new Response(
        JSON.stringify({
          assistant: {
            name: "Lunares",
            firstMessage: "¡Guau, hola! Soy Lunares, la perra guardiana de Crestellina. Qué alegría me da que me visites en mi sierra. ¿En qué puedo ayudarte hoy? ¿Quieres que te cuente algo sobre mis hermanas las cabras, nuestros quesos que vuelan de la despensa o sobre cómo venir a pastorear conmigo?",
            transcriber: { provider: 'deepgram', model: 'nova-2', language: 'es' },
            model: {
              provider: 'google',
              model: 'gemini-2.5-flash',
              messages: [
                { role: 'system', content: SYSTEM_PROMPT + "\n\n" + KNOWLEDGE_BASE }
              ]
            },
            voice: {
              provider: 'vapi',
              voiceId: 'Lucia'
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. TEXT CHAT (Modo Escritura)
    //    Usa Gemini 3.0 Flash Preview para razonar la respuesta
    // ─────────────────────────────────────────────────────────────────
    if (payload.query) {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
      if (!geminiApiKey) {
        return new Response(
          JSON.stringify({ error: 'GEMINI_API_KEY not configured in Supabase secrets' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const model = Deno.env.get('GEMINI_REASONING_MODEL') || 'gemini-3-flash-preview'
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: SYSTEM_PROMPT + "\n\n" + KNOWLEDGE_BASE + "\n\nPregunta del usuario: " + payload.query }]
          }]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Gemini API error:", JSON.stringify(data))
        return new Response(
          JSON.stringify({ error: `Gemini API error (${response.status}): ${data?.error?.message || 'Unknown'}` }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ status: "ok", message: "Lunares Edge Function active" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error("Edge Function error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
