# back end para o chat bot
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)

# CORS configurado para o front-end no Netlify
CORS(app, resources={
    r"/chat": {
        "origins": "https://chatbo22321342145.netlify.app",
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type deve ser application/json"}), 400
            
        data = request.get_json()
        user_message = data.get("message")
        
        if not user_message:
            return jsonify({"error": "Campo 'message' é obrigatório"}), 400

        # Integração com Ollama (substitua pela sua lógica)
        ollama_response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False
            },
            timeout=30
        )
        ollama_response.raise_for_status()
        
        return jsonify(ollama_response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro no Ollama: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)), debug=False)