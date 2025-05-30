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

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage('user-message', message);
        userInput.value = '';

        // Mostra o indicador de digitação (adicionado)
        document.getElementById('typing-indicator').style.display = 'flex';

        try {
            const response = await fetch('https://three-1-8a6g.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro no back-end");
            }

            const data = await response.json();
            // Esconde o indicador (adicionado)
            document.getElementById('typing-indicator').style.display = 'none';
            addMessage('bot-message', data.response);

        } catch (error) {
            document.getElementById('typing-indicator').style.display = 'none';
            addMessage('error-message', `Erro: ${error.message}`);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});