from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "service": "chat-backend",
        "endpoint": "/chat (POST)"
    })

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        # Validação melhorada
        if not request.is_json:
            return jsonify({"error": "Payload deve ser JSON", "status": "error"}), 400
            
        data = request.get_json()
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({
                "error": "O campo 'message' é obrigatório e não pode estar vazio",
                "status": "error"
            }), 400

        ollama_response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False
            },
            timeout=30
        )
        
        response_data = ollama_response.json()
        return jsonify({
            "response": response_data.get("message", {}).get("content", "Sem resposta"),
            "status": "success"
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Timeout ao conectar com o serviço de chat",
            "status": "error"
        }), 504
        
    except Exception as e:
        return jsonify({
            "error": f"Erro no servidor: {str(e)}",
            "status": "error"
        }), 500

# Handler para erro 405
@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "error": f"Método {request.method} não permitido para esta rota",
        "allowed_methods": ["GET", "HEAD"] if request.path == "/" else ["POST"]
    }), 405

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)