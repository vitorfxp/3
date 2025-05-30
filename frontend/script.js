document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    // Cria os 3 spans da animação
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        typingIndicator.appendChild(span);
    }
    
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingIndicator;
}

    function hideTypingIndicator(typingIndicator) {
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage('user-message', message);
        userInput.value = '';

        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch('https://three-1-8a6g.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) throw new Error("Erro no servidor");

            const data = await response.json();
            hideTypingIndicator(typingIndicator);
            addMessage('bot-message', data.response);

        } catch (error) {
            hideTypingIndicator(typingIndicator);
            addMessage('error-message', `Erro: ${error.message}`);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

