from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
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

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "service": "chat-backend (Render)",
        "endpoint": "/chat (POST)"
    })

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    # --- LOGS PARA DEBUG DO PAYLOAD ---
    app.logger.info(f"\n[HEADERS]: {request.headers}\n[DATA RAW]: {request.data}\n[CONTENT-TYPE]: {request.content_type}")

    try:
        # Aceita JSON ou FormData
        if request.content_type == 'application/json':
            data = request.get_json()
            app.logger.info(f"[JSON RECEBIDO]: {data}")  # Log do JSON parseado
        else:
            data = request.form.to_dict()
            app.logger.info(f"[FORM DATA RECEBIDO]: {data}")  # Log de formulário

        # Validação do campo 'message'
        user_message = data.get("message", "").strip()
        if not user_message:
            app.logger.error("[ERRO]: Campo 'message' vazio ou ausente")
            return jsonify({
                "error": "Campo 'message' é obrigatório",
                "status": "error"
            }), 400

        # --- CHAMADA PARA O OLLAMA ---
        OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
        app.logger.info(f"[OLLAMA REQUEST]: Enviando mensagem: '{user_message[:50]}...'")

        ollama_response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False
            },
            timeout=45
        )
        ollama_response.raise_for_status()

        response_data = ollama_response.json()
        app.logger.info(f"[OLLAMA RESPONSE]: Resposta recebida: {response_data.get('message', {}).get('content', '')[:100]}...")

        return jsonify({
            "response": response_data.get("message", {}).get("content", "Sem resposta"),
            "status": "success"
        })

    except requests.exceptions.RequestException as e:
        app.logger.error(f"[ERRO OLLAMA]: {str(e)}")
        return jsonify({
            "error": f"Erro ao acessar o serviço de chat: {str(e)}",
            "status": "error"
        }), 502 if isinstance(e, (requests.Timeout, requests.ConnectionError)) else 500

    except Exception as e:
        app.logger.error(f"[ERRO INTERNO]: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Erro interno no servidor",
            "status": "error"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)