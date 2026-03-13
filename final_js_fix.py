
import os

def replace_bubble_and_intros(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # 1. Bubble text
    import re
    bubble_pattern = r'<div id="lunares-speech-bubble" class="visible">.*?</div>'
    content = re.sub(bubble_pattern, '<div id="lunares-speech-bubble" class="visible">Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?</div>', content)
    
    # 2. First Message in startVoiceCall
    first_msg_pattern = r'const firstMessage = choice && intros\[choice\]\s+\? intros\[choice\]\s+: ".*?";'
    new_first_msg = 'const firstMessage = choice && intros[choice] ? intros[choice] : "Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte de visita por aquí. ¿Te apetece conocer nuestra historia, nuestras experiencias o prefieres ver nuestros productos artesanos?";'
    content = re.sub(first_msg_pattern, new_first_msg, content, flags=re.DOTALL)

    # 3. Intros
    intros_pattern = r'const intros = {.*?};'
    new_intros = '''const intros = {
            nosotros: "Hola, es un placer saludarte. Acompáñame y te contaré la historia de mi familia.",
            experiencias: "Claro que sí, déjame que te guíe por nuestras experiencias en la granja.",
            tienda: "Vamos a la tienda, te voy a acompañar para que conozcas nuestros quesos artesanales."
        };'''
    content = re.sub(intros_pattern, new_intros, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updates applied to lunares-native.js")

replace_bubble_and_intros(r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js')
