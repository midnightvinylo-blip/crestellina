#!/usr/bin/env python3
import sys
import json
import base64
import time

def decode_part(part):
    """Decodifica Base64URL a JSON."""
    try:
        padded = part + '=' * (4 - len(part) % 4)
        return json.loads(base64.urlsafe_b64decode(padded).decode('utf-8'))
    except Exception:
        return None

def analyze_token(token):
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return {"status": "error", "message": "Token mal formado. Debe tener 3 partes."}

        header = decode_part(parts[0])
        payload = decode_part(parts[1])
        
        if not header or not payload:
            return {"status": "error", "message": "No se pudo decodificar el contenido del token."}

        alg = header.get('alg', 'UNKNOWN').upper()
        now = time.time()
        exp = payload.get('exp', 0)
        
        # Auditoría de Seguridad
        is_vulnerable = (alg == "NONE")
        threat = "CRITICAL" if is_vulnerable else "LOW"
        
        return {
            "status": "success",
            "security": {
                "algorithm": alg,
                "is_vulnerable": is_vulnerable,
                "threat_level": threat,
                "security_note": "¡ALERTA! El algoritmo 'none' detectado." if is_vulnerable else "Algoritmo estándar."
            },
            "claims": payload,
            "timing": {
                "is_expired": (exp < now) if exp else "No exp claim",
                "expires_in_seconds": int(exp - now) if exp else 0,
                "current_server_time": int(now)
            }
        }
    except Exception as e:
        return {"status": "error", "message": f"Error inesperado: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere un token como argumento."}))
    else:
        print(json.dumps(analyze_token(sys.argv[1]), indent=2))