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
    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-messages');
    
    
    chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;
    
    try {
        const response = await fetch('https://three-1-8a6g.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        
        
        chatBox.innerHTML += `<div class="bot-message">${data.response}</div>`;
        
        
        document.getElementById('user-input').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
        
    } catch (error) {
        chatBox.innerHTML += `<div class="error-message">Erro: ${error.message}</div>`;
    }
}

  
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