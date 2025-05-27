from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  

app = Flask(__name__)
CORS(app)  


@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        # 1. Recebe a mensagem do frontend
        data = request.get_json()
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "Mensagem vazia"}), 400

        # 2. Envia para a Ollama
        ollama_response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False
            },
            timeout=30
        )
        
        # 3. Processa a resposta
        response_data = ollama_response.json()
        bot_response = response_data.get("message", {}).get("content", "Sem resposta")
        
        return jsonify({
            "response": bot_response,
            "status": "success"
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": f"Falha na conexão com Ollama: {str(e)}",
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)

    
