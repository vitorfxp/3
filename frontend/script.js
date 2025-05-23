document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Função para adicionar mensagem ao chat
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enviar mensagem para a API Flask
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-messages');
    
    // Adiciona mensagem do usuário
    chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;
    
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        
        // Adiciona resposta do bot (AGORA FUNCIONANDO)
        chatBox.innerHTML += `<div class="bot-message">${data.response}</div>`;
        
        // Limpa input e rola para a última mensagem
        document.getElementById('user-input').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
        
    } catch (error) {
        chatBox.innerHTML += `<div class="error-message">Erro: ${error.message}</div>`;
    }
}

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});