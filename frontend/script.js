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

    // CRIA o indicador apenas quando necessário (dinamicamente)
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('https://three-1-8a6g.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error("Erro no back-end");

        const data = await response.json();
        // REMOVE o indicador (se existir)
        if (typingIndicator.parentNode) typingIndicator.remove();
        addMessage('bot-message', data.response);

    } catch (error) {
        if (typingIndicator.parentNode) typingIndicator.remove();
        addMessage('error-message', `Erro: ${error.message}`);
    }
}
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});