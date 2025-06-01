window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const chatContainer = document.getElementById("chat-container");

  setTimeout(() => {
    intro.style.display = "none";
    chatContainer.classList.remove("hidden");
    document.body.style.background = "#fff";
  }, 3000);
});

const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("user-input");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  input.value = "";

  const botReply = await sendMessageToAPI(userMessage);
  addMessage(botReply, "bot");
});

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatBox.appendChild(message);
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
    return "Erro ao conectar com o servidor.";
  }
}
function typeText(text, elementId, speed = 50, callback) {
  let i = 0;
  const target = document.getElementById(elementId);
  function typing() {
    if (i < text.length) {
      target.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

window.onload = () => {
  setTimeout(() => {
    typeText("Como posso ajudar você hoje?", "typing-effect", 50, () => {
      setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        document.getElementById("chat-container").classList.remove("hidden");
      }, 1000);
    });
  }, 2000); // tempo de exibição inicial do "Bem-vindo"
};

