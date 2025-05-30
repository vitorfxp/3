from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import logging

app = Flask(__name__)

# Configuração CORS para o front-end no Netlify
CORS(app, resources={
    r"/chat": {
        "origins": "https://chatbo22321342145.netlify.app",
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuração de logs
logging.basicConfig(level=logging.INFO)
app.logger.info("Servidor iniciado")

# Configuração do Gemini (use variável de ambiente GEMINI_API_KEY)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        # Validação do conteúdo
        if not request.is_json:
            app.logger.error("Content-Type não é JSON")
            return jsonify({"error": "Content-Type deve ser application/json"}), 400
            
        data = request.get_json()
        user_message = data.get("message")
        
        if not user_message:
            app.logger.error("Campo 'message' ausente")
            return jsonify({"error": "Campo 'message' é obrigatório"}), 400

        # Log da mensagem recebida
        app.logger.info(f"Mensagem recebida: {user_message[:100]}...")

        # Chamada para o Gemini
        response = model.generate_content(
            user_message,
            generation_config={
                "max_output_tokens": 2048,  # Controla o tamanho da resposta
                "temperature": 0.7         # Criatividade (0-1)
            }
        )
        
        app.logger.info(f"Resposta gerada: {response.text[:100]}...")
        
        return jsonify({
            "message": {
                "role": "assistant",
                "content": response.text
            },
            "status": "success"
        })
        
    except Exception as e:
        app.logger.error(f"Erro: {str(e)}")
        return jsonify({
            "error": f"Erro no servidor: {str(e)}",
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)), debug=False)