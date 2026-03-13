
import os
import re

def robust_replace(filepath, pattern, replacement):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Use regex to find the string regardless of small character variations or spaces
    new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE | re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully updated {filepath}")
    else:
        print(f"No changes made to {filepath} for pattern: {pattern[:50]}...")

# Patterns for index.ts
ts_path = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\supabase\functions\vapi-agent\index.ts'
robust_replace(ts_path, r'Â¡Guau, hola!.*幫助te hoy\?', 'Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte por aquí. ¿En qué puedo ayudarte hoy?')
robust_replace(ts_path, r'TÃº \"olfateas\".*por los riscos\"', 'Eres una mastina orgullosa de su tierra. Muestras tu entusiasmo a través de pinceladas sensoriales: hablas del aroma de los quesos, del aire de la sierra y de la labor de tu familia humana.')

# Patterns for lunares-native.js
js_path = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js'
robust_replace(js_path, r'Hola, soy Lunares\. Soy la guardiana de Crestellina.*puedo ayudarte\?', 'Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?')
robust_replace(js_path, r'Â¡Guau! No sÃ© quÃ© pasÃ³', 'Vaya, parece que he perdido el rastro un momento.')
