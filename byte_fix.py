
import os

def replace_exact(filepath, search, replace):
    with open(filepath, 'rb') as f:
        data = f.read()
    
    # Try different encodings for the search string
    search_bytes = search.encode('utf-8')
    replace_bytes = replace.encode('utf-8')
    
    if search_bytes in data:
        new_data = data.replace(search_bytes, replace_bytes)
        with open(filepath, 'wb') as f:
            f.write(new_data)
        print(f"Updated {os.path.basename(filepath)}")
    else:
        # Try without the special characters to find it
        simple_search = "".join(c for c in str(search) if ord(c) < 128)
        print(f"Exact match not found in {os.path.basename(filepath)}. Searching for simplified: {simple_search}")

# Files
js_path = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\lunares-native.js'
ts_path = r'c:\Users\david\OneDrive\Escritorio\Crestellina Proyect\supabase\functions\vapi-agent\index.ts'

# JS Replacements
replace_exact(js_path, 
             'Hola, soy Lunares. Soy la guardiana de Crestellina y tu guía en esta web. ¿En qué puedo ayudarte?',
             'Hola, soy Lunares, la mastina guardiana de Sierra Crestellina. Es un placer tenerte aquí. ¿En qué puedo ayudarte hoy?')

replace_exact(js_path,
             '📡 ¡Te escucho! Dime lo que necesitas.',
             'Soy todo oídos, dime lo que necesites.')

# TS Replacements
replace_exact(ts_path,
             'Â¡Guau, hola! Soy Lunares, la perra guardiana de Crestellina. QuÃ© alegrÃ­a me da que me visites en mi sierra. Â¿En quÃ© puedo ayudarte hoy?',
             'Hola, soy Lunares, la mastina guardiana de Crestellina. Qué alegría tenerte por aquí. ¿En qué puedo ayudarte hoy?')

replace_exact(ts_path,
             'TÃº "olfateas" ofertas, "pones la oreja" cuando los humanos preguntan, "hueles" quesos, "mueves la cola" cuando alguien te visita y "corres por los riscos".',
             'Eres una mastina orgullosa de su tierra. Muestras tu entusiasmo a través de pinceladas sensoriales: hablas del aroma de los quesos y del aire de la sierra.')

replace_exact(ts_path,
             '"Â¡Guau!"',
             '"¡Qué maravilla!"')

print("Process finished.")
