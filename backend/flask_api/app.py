from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import logging

app = Flask(__name__)

# Configuração CORS para Render
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuração de logs
logging.basicConfig(level=logging.INFO)
app.logger.info("Servidor iniciado")

# Configuração do Gemini (use variável de ambiente GEMINI_API_KEY no Render)
genai.configure(api_key=os.environ.get("AIzaSyDkCmpPVbuCOK20nJ_e46fnqJt1XIN3KAs"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "service": "chat-backend (Render)",
        "endpoint": "/chat (POST)",
        "model": "Gemini 1.5 Flash"
    })

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    # --- LOGS PARA DEBUG ---
    app.logger.info(f"\n[HEADERS]: {request.headers}\n[DATA RAW]: {request.data}\n[CONTENT-TYPE]: {request.content_type}")

    try:
        # Aceita JSON ou FormData
        if request.content_type == 'application/json':
            data = request.get_json()
            app.logger.info(f"[JSON RECEBIDO]: {data}")
        else:
            data = request.form.to_dict()
            app.logger.info(f"[FORM DATA RECEBIDO]: {data}")

        # Validação do campo 'message'
        user_message = data.get("message", "").strip()
        if not user_message:
            app.logger.error("[ERRO]: Campo 'message' vazio ou ausente")
            return jsonify({
                "error": "Campo 'message' é obrigatório",
                "status": "error"
            }), 400

        # --- CHAMADA PARA O GEMINI ---
        app.logger.info(f"[GEMINI REQUEST]: Enviando mensagem: '{user_message[:50]}...'")
        
        response = model.generate_content(
            user_message,
            generation_config={
                "max_output_tokens": 2048,  # Ajuste conforme necessário
                "temperature": 0.7
            }
        )
        
        app.logger.info(f"[GEMINI RESPONSE]: Resposta recebida: {response.text[:100]}...")

        return jsonify({
            "response": response.text,
            "status": "success"
        })

    except Exception as e:
        app.logger.error(f"[ERRO GEMINI]: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Erro no servidor: {str(e)}",
            "status": "error"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)