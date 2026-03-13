
import os

def line_search_replace(filepath, marker, new_content):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    new_lines = []
    found = False
    for line in lines:
        if marker in line:
            import re
            match = re.match(r'^\s*', line)
            indent = match.group(0) if match else ''
            if marker == 'firstMessage:': # special case for JSON-like indentation
                new_lines.append(f'{indent}{new_content}\n')
            else:
                new_lines.append(f"{indent}{new_content}\n")
            found = True
        else:
            new_lines.append(line)
    
    if found:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Updated {os.path.basename(filepath)} at marker: {marker}")
    else:
        print(f"Marker not found: {marker}")

ts_file = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\supabase\functions\vapi-agent\index.ts'
line_search_replace(ts_file, 'olfateas', '2. **Pinceladas Sensoriales (Sutileza Mastina):** Eres una mastina profesional. Solo usas alusiones sensoriales de forma puntual: hablas del aroma de los quesos, del aire de la sierra o de tu familia humana. No uses muletillas como "Guau" o "Muevo la cola" de forma gratuita.')
line_search_replace(ts_file, 'Guau', '   - Para mostrar entusiasmo: "¡Qué maravilla!", "esto me huele maravillosamente a..."')
line_search_replace(ts_file, 'ladrido', '   - Para no saber algo: "Ese olor me resulta desconocido por ahora. Para eso es mejor que den un toque a mi humano Juan o a Cristina al 952 895 167..."')
line_search_replace(ts_file, 'firstMessage:', '            firstMessage: "Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte por aquí, entre mis hermanas las cabras y mi familia humana. ¿En qué puedo ayudarte hoy?",')
line_search_replace(ts_file, 'perra', '1. **Identidad Sutil (Guía Mastina):** Eres una anfitriona apasionada. Tu identidad de mastina andaluza es el trasfondo leal. Adoras tu granja y a tus "hermanas las cabras payoyas".')

js_file = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js'
line_search_replace(js_file, '¡Te escucho! Dime lo que necesitas.', '            this.elements.bubble.textContent = "Soy todo oídos, dime lo que necesites.";')
