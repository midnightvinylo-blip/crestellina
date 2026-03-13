
import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for search, replace in replacements:
        content = content.replace(search, replace)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Lunares-native.js replacements
js_file = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js'
js_reps = [
    ('Hola, soy Lunares. Soy la guardiana de Crestellina y tu guía en esta web. ¿En qué puedo ayudarte?', 
     'Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?'),
    ('¡Guau! No sé qué pasó...', 'Vaya, parece que he perdido el rastro un momento. ¿Podrías repetir eso?'),
    ('📡 ¡Te escucho! Dime lo que necesitas.', 'Soy todo oídos, dime lo que necesites.'),
    ('¡Hasta pronto! Aquí me quedo patrullando la Sierra 🐾', 'Ha sido un placer. Aquí me quedo para lo que necesites mientras recorres la Sierra.'),
    ('¡Hola! ... Soy Lunares, la guardiana de Crestellina y ahora tu guía aquí en la web. ... ¿Por dónde quieres empezar? ... ¿Te gustaría conocernos un poco mejor? ... ¿Saber sobre nuestras experiencias? ... ¿O quizás conocer nuestros productos artesanales? ... Yo te aconsejo, para que sea una experiencia más inmersiva, que empieces por conocernos un poco mejor.',
     'Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte de visita por aquí. ¿Por dónde te gustaría empezar? ¿Te apetece conocer nuestra historia, nuestras experiencias en la granja o prefieres ver nuestros productos artesanos? Mi consejo es que empieces conociéndonos un poco mejor.')
]

# Supabase index.ts replacements
ts_file = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\supabase\functions\vapi-agent\index.ts'
ts_reps = [
    ('¡Guau, hola! Soy Lunares, la perra guardiana de Crestellina. Qué alegría me da que me visites en mi sierra. ¿En qué puedo ayudarte hoy?', 
     'Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte por aquí, entre mis hermanas las cabras y mi familia humana. ¿En qué puedo ayudarte hoy?'),
    ('Tú "olfateas" ofertas, "pones la oreja" cuando los humanos preguntan, "hueles" quesos, "mueves la cola" cuando alguien te visita y "corres por los riscos".',
     'Eres una mastina orgullosa de su tierra. Muestras tu entusiasmo a través de pinceladas sensoriales: hablas del aroma de los quesos, del aire de la sierra y de la labor de tu familia humana.'),
    ('"¡Guau!"', '"¡Qué maravilla!"'),
    ('peguen un ladrido', 'den un toque')
]

replace_in_file(js_file, js_reps)
replace_in_file(ts_file, ts_reps)
print("Replacements completed successfully.")
