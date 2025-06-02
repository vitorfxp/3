// Mostra o chat após a animação de intro
setTimeout(() => {
  document.getElementById("chat-container").classList.remove("hidden");
}, 4500);

// Variáveis globais
let userAvatarSrc = null;
const botAvatarSrc = null;

// Elementos DOM
const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const avatarSetup = document.getElementById("avatar-setup");
const avatarUpload = document.getElementById("avatar-upload");
const currentAvatar = document.getElementById("current-avatar");
const uploadBtn = document.getElementById("upload-btn");
const startChatBtn = document.getElementById("start-chat-btn");

// Event listeners para avatar
uploadBtn.addEventListener("click", () => avatarUpload.click());
avatarUpload.addEventListener("change", handleAvatarUpload);
startChatBtn.addEventListener("click", () => {
  avatarSetup.style.display = "none";
  userInput.focus();
});

// Upload de avatar
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userAvatarSrc = e.target.result;
      currentAvatar.innerHTML = `<img src="${userAvatarSrc}" class="avatar-image" alt="Seu avatar">`;
    };
    reader.readAsDataURL(file);
  }
}

// Envio de mensagem
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Verifica palavra-chave
  if (userMessage.toLowerCase() === "computandose") {
    verificarPalavraChave(userMessage);
    userInput.value = "";
    return;
  }

  addMessage(userMessage, "user");
  userInput.value = "";

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

function verificarPalavraChave(texto) {
  const qrContainer = document.getElementById("qrcode-container");
  if (!qrContainer) return;

  if (texto.toLowerCase().includes("computandose")) {
    // Delay de 100ms para sincronizar com a animação
    setTimeout(() => {
      qrContainer.classList.remove("hidden");
      qrContainer.classList.add("visible");
      addMessage("Aqui está o QR Code do Dragão! 🐉", "bot"); // Mensagem mais personalizada
    }, 100);
  }
}

// ✅ Função atualizada com suporte a Markdown
function addMessage(text, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", sender);

  const avatar = document.createElement("div");
  avatar.classList.add(sender === "user" ? "user-avatar" : "bot-avatar");

if (sender === "user" && userAvatarSrc) {
  avatar.innerHTML = `<img src="${userAvatarSrc}" class="avatar-image" alt="Você">`;
} else if (sender === "user") {
  avatar.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="white">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>`;
} else {
  avatar.innerHTML = `<img src="avatar-bot.png" class="bot-avatar-image" alt="Bot">`;
}


  const message = document.createElement("div");
  message.classList.add("message");

  // ✅ Aqui está o Markdown funcionando!
  if (sender === "bot") {
    message.innerHTML = marked.parse(text);
  } else {
    message.textContent = text;
  }

  messageContainer.appendChild(avatar);
  messageContainer.appendChild(message);
  chatBox.appendChild(messageContainer);
  scrollToBottom();
}

// Indicador de digitação
function addTypingIndicator() {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", "bot");

  const avatar = document.createElement("div");
  avatar.classList.add("bot-avatar");
  avatar.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="white">
    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1L13.5,2.5L16.17,5.17L10.5,10.84L4.83,5.17L7.5,2.5L6,1L0,7V9L3,6L9,12L3,18V20L6,17L9.41,20.41L12,17.82L14.59,20.41L18,17L21,20V18L15,12L21,9Z"/>
  </svg>`;

  const message = document.createElement("div");
  message.classList.add("message");
  message.innerHTML = "Digitando...";
  message.style.opacity = "0.7";

  messageContainer.appendChild(avatar);
  messageContainer.appendChild(message);
  chatBox.appendChild(messageContainer);
  scrollToBottom();
  
  return messageContainer;
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

