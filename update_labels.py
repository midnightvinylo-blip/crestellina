
import os

files = ['index.html', 'tienda.html', 'nosotros.html', 'experiencias.html', 'contacto.html', 'temp.html']

for filename in files:
    filepath = os.path.join(r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect', filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Replace link text specifically
    # Example: href="contacto.html">Ubicación</a> -> href="contacto.html">Contacto</a>
    import re
    
    # 1. Links to contacto.html that say Ubicación
    content = re.sub(r'href="contacto\.html">Ubicación</a>', 'href="contacto.html">Contacto</a>', content)
    
    # 2. Section headers
    # Example: <h4 ...>Ubicación</h4> -> <h4 ...>Contacto</h4>
    content = re.sub(r'(<h4[^>]*>)\s*Ubicación\s*(</h4>)', r'\1Contacto\2', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated labels in {filename}")

print("Labels update finished.")
