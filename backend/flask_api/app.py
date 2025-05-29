from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging

app = Flask(__name__)

# Configuração CORS para Render (liberando métodos e headers necessários)
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Em produção, substitua pelo seu domínio front-end
        "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
    }
})

# Configuração de logs (útil para debug no Render)
logging.basicConfig(level=logging.INFO)
app.logger.info("Servidor iniciado")

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "service": "chat-backend (Render)",
        "endpoint": "/chat (POST)",
        "docs": "Envie POST com { 'message': 'texto' } para /chat"
    })

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        # Aceita JSON ou FormData
        if request.content_type == 'application/json':
            data = request.get_json()
        else:
            data = request.form.to_dict()

        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({
                "error": "Campo 'message' é obrigatório",
                "status": "error"
            }), 400

        # URL do Ollama (substitua pela sua se necessário)
        OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
        
        app.logger.info(f"Processando mensagem: {user_message[:50]}...")
        
        # Chamada para o Ollama com timeout ajustado para cloud
        ollama_response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False
            },
            timeout=45  # Timeout aumentado para ambientes cloud
        )
        
        ollama_response.raise_for_status()  # Lança erro para respostas 4XX/5XX
        
        response_data = ollama_response.json()
        return jsonify({
            "response": response_data.get("message", {}).get("content", "Sem resposta"),
            "status": "success"
        })

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Erro no Ollama: {str(e)}")
        return jsonify({
            "error": f"Erro ao acessar o serviço de chat: {str(e)}",
            "status": "error"
        }), 502 if isinstance(e, (requests.Timeout, requests.ConnectionError)) else 500
        
    except Exception as e:
        app.logger.error(f"Erro interno: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Erro interno no servidor",
            "status": "error"
        }), 500

# Configuração do servidor para o Render
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)