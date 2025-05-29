from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  

@app.route('/')
def home():
    return jsonify({"status": "online", "service": "chat-backend"})

# Rota do chatbot
@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        # Resposta pré-flight para CORS
        return jsonify({"status": "ok"}), 200
    
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"error": "Mensagem vazia"}), 400

        ollama_response = requests.post(
            "http://localhost:11434/api/chat",  # Ou sua URL remota da Ollama
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

    except Exception as e:
        return jsonify({
            "error": f"Erro no servidor: {str(e)}",
            "status": "error"
        }), 500


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        "error": "Method not allowed",
        "allowed_methods": ["GET", "HEAD"]
    }), 405

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Usa a porta do Render ou 10000
    app.run(host="0.0.0.0", port=port, debug=False)
