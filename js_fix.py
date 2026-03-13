
import os

def line_replace(filepath, marker, new_line_content):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    updated = False
    for i, line in enumerate(lines):
        if marker in line:
            # Keep the indentation
            indent = line[:line.find('<') if '<' in line else 0]
            if 'id="lunares-speech-bubble"' in line:
               lines[i] = f'{indent}<div id="lunares-speech-bubble" class="visible">{new_line_content}</div>\n'
               updated = True
               print(f"Updated line {i+1} in {os.path.basename(filepath)}")
    
    if updated:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    else:
        print(f"Marker '{marker}' not found in {os.path.basename(filepath)}")

js_path = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js'
line_replace(js_path, 'id="lunares-speech-bubble"', 'Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?')

# Also fix the voice intros in startVoiceCall
def multi_line_replace(filepath, start_marker, end_marker, new_content):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    pattern = re.escape(start_marker) + ".*?" + re.escape(end_marker)
    import re
    new_content_full = re.sub(pattern, start_marker + new_content + end_marker, content, flags=re.DOTALL)
    
    if new_content_full != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content_full)
        print(f"Updated block in {os.path.basename(filepath)}")

multi_line_replace(js_path, 'const intros = {', '};', '''
            nosotros: "Hola, es un placer saludarte. Acompáñame y te contaré la historia de mi familia.",
            experiencias: "Claro que sí, déjame que te guíe por nuestras experiencias en la granja.",
            tienda: "Vamos a la tienda, te voy a acompañar para que conozcas nuestros quesos artesanales."
        ''')
