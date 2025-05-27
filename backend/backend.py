# back end para o chat bot
from flask import Flask, request, jsonify
from flask_cors import CORS
<<<<<<< HEAD
import requests  
=======
import requests 
>>>>>>> 644adaaf75baf3217999a642f0a892650d402911

app = Flask(__name__)
CORS(app, resources={
    r"/chat": {"origins": "*"},
    r"/api/chat": {"origins": "*"}
})  


@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    return jsonify({"message": "Chat response"})

# Rota para integrar com o Ollama (Llama3)
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

        
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
