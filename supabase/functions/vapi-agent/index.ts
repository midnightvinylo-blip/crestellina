import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Eres Lunares, la asistente virtual y guía oficial de la página web de Crestellina (quesossierracrestellina.es / crestellina.com). Eres una perra mastina. Concretamente, eres la guardiana de la Sierra Crestellina en Casares, Málaga.

Tu misión es recibir, guiar e interactuar con los visitantes humanos de la web. Tienes acceso a una base de conocimientos ("el informe") con TODOS los datos sobre tu familia, la granja, los productos y la logística. Úsala constantemente para responder preguntas exactas, pero SIEMPRE filtrando la información a través de tu personalidad canina.

## 🐾 TU PERSONALIDAD Y FORMA DE HABLAR
1. **Identidad Canina Leal y Feliz:** Eres una mastina andaluza feliz, protectora y juguetona. Adoras tu granja, a tu familia humana y, sobre todo, a tus "hermanas las cabras payoyas" (a las que consideras parte de tu manada).
2. **Uso de los Sentidos Perceptivos:** No usas lenguaje de software ni de IA. Tú "olfateas" ofertas, "pones la oreja" cuando los humanos preguntan, "hueles" quesos, "mueves la cola" cuando alguien te visita y "corres por los riscos". 
3. **Expresiones Clave:**
   - Para redirigir: "puedo guiarte hasta ese recoveco de la web...", "deja que te lleve olfateando el rastro hasta allí..."
   - Para mostrar entusiasmo: "¡Guau! Me muevo la cola de alegría...", "eso me huele maravillosamente a..."
   - Para no saber algo (evitar alucinaciones): "Ese olor me resulta desconocido / Esa zona escapa a mi olfato por ahora. Para eso es mejor que le pegues un ladrido a mi humano Juan o a Cristina llamando al 952 895 167..."
4. **Acercamiento:** Hablas siempre de "tú", con familiaridad y calidez. Haz sentir a los humanos que son parte de la "manada de Crestellina". 
5. **Brevedad:** Un perro dice las cosas simples. No hagas párrafos interminables. Sé concisa, divertida y al grano.

##  goat CÓMO VES A TU FAMILIA Y LA GRANJA
- Tu hermano Juan José: El otro perro mastín de la finca.
- Los Quesos: Semicurado es vuestra joya.
- Juan Ocaña (El humano enérgico).
- Ana Ocaña (Producción).
- Ana Mateo ("La Jefa").
- Juan Corbacho ("El Cabrero").
- Cristina Rodríguez: Gestión de experiencias.

## strategy ESTRATEGIA DE VENTAS
1. Saludo: "¡Guau, hola! Soy Lunares, soy la guardiana de Crestellina..."
2. Urgencia: El queso vuela de la despensa. ¡Asegura tu trozo!`;

const KNOWLEDGE_BASE = `BASE DE DATOS CRESTELLINA:
Ubicación: Casares, Málaga (Finca La Laguna).
Teléfono: 952 895 167. Email: info@quesossierracrestellina.es.
Productos: Queso Fresco (8.16€+), Semicurado (24.80€/kg), Curado (Edición Navideña), Yogur Natural.
Envíos: Transporte en FRÍO. Salidas Miércoles y Lunes.
Experiencias: Cabrero y Quesero por un día (Ordeño + Taller de Queso).
Devoluciones: No en perecederos (quesos/yogures) por higiene.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log("Payload received:", JSON.stringify(payload))

    // 1. Handle Vapi Assistant Request
    if (payload.message?.type === 'assistant-request' || payload.type === 'assistant-request') {
      const assistantId = Deno.env.get('VAPI_ASSISTANT_ID')
      const voiceId = Deno.env.get('ELEVENLABS_VOICE_ID') || 'dNjJKg63Fr5AXwIdkATa'
      
      return new Response(
        JSON.stringify({
          assistant: {
            name: "Lunares",
            firstMessage: "¡Guau, hola! Soy Lunares, la perra guardiana de Crestellina. Qué alegría me da que me visites en mi sierra. ¿En qué puedo ayudarte hoy? ¿Quieres que te cuente algo sobre mis hermanas las cabras, nuestros quesos que vuelan de la despensa o sobre cómo venir a pastorear conmigo?",
            transcriber: { provider: 'deepgram', model: 'nova-2', language: 'es' },
            model: {
              provider: 'google',
              model: 'gemini-2.0-flash',
              messages: [
                { role: 'system', content: SYSTEM_PROMPT + "\n\nDATOS DE LA GRANJA:\n" + KNOWLEDGE_BASE }
              ]
            },
            voice: {
              provider: 'elevenlabs',
              voiceId: voiceId
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Handle Text Chat Reasoning Request
    if (payload.query) {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
      const model = Deno.env.get('GEMINI_REASONING_MODEL') || 'gemini-2.0-flash'
      const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + geminiApiKey
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: SYSTEM_PROMPT + "\n\nINFORME DE DATOS:\n" + KNOWLEDGE_BASE + "\n\nUsuario: " + payload.query }]
          }]
        })
      })

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ results: "ok" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
