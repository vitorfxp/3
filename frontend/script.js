// Criar partículas de fundo
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const colors = ['#00ffff', '#8000ff', '#ff0080', '#00ff80'];
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }, 200);
}

// Seu código JavaScript original
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Iniciar partículas
    createParticles();

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

