// Mostra o chat após a animação de intro
setTimeout(() => {
  document.getElementById("chat-container").classList.remove("hidden");
}, 4500);

const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  userInput.value = "";

  // Mostra indicador de digitação
  const typingIndicator = addTypingIndicator();
  
  try {
    const botReply = await sendMessageToAPI(userMessage);
    chatBox.removeChild(typingIndicator);
    addMessage(botReply, "bot");
  } catch (error) {
    chatBox.removeChild(typingIndicator);
    addMessage("Desculpe, ocorreu um erro. Tente novamente.", "bot");
  }
});

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatBox.appendChild(message);
  scrollToBottom();
}

function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.classList.add("message", "bot");
  indicator.innerHTML = "Digitando...";
  indicator.style.opacity = "0.7";
  chatBox.appendChild(indicator);
  scrollToBottom();
  return indicator;
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessageToAPI(message) {
  try {
    const response = await fetch("https://three-1-8a6g.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.response || "Erro na resposta.";
  } catch (err) {
    throw new Error("Erro ao conectar com o servidor.");
  }
}

// Foco automático no input quando o chat aparecer
setTimeout(() => {
  userInput.focus();
}, 5000);

// Enter para enviar, Shift+Enter para nova linha
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});