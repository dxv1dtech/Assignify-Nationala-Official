const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;
let isResponseGenerating = false;
let chatHistory = [];

const API_KEY = "AIzaSyBz2qb-bJGAZXyzrYqK99vUkI1ZFwdZf64";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Load theme and chat data
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");
  document.body.classList.toggle("light_mode", isLightMode);
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// Create a new message DOM element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    if (currentWordIndex >= words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;

      // ✅ Remove loading bar
      const loadingIndicator = incomingMessageDiv.querySelector(".loading-indicator");
      if (loadingIndicator) loadingIndicator.remove();

      // ✅ Remove loading class from entire message
      incomingMessageDiv.classList.remove("loading");

      localStorage.setItem("saved-chats", chatContainer.innerHTML);
      return;
    }

    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }, 75);
};

const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    // Construim conținutul conversației
    const contents = [
      {
        role: "user",
        parts: [{
          text: `Ești un tutor școlar. Înțelegi română și engleză, dar răspunzi doar în română.
Accepți doar întrebări despre materiile școlare (Matematică, Română, Istorie, Geografie, Științe).
Dacă întrebarea nu e despre școală, răspunde: "Sunt aici să te ajut doar cu materii școlare. Te rog pune o întrebare legată de școală."`
        }]
      },
      // 🧠 Adăugăm întreg istoricul conversației aici
      ...chatHistory.map(entry => ({
        role: entry.role,
        parts: [{ text: entry.text }]
      }))
    ];

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response.ok || !reply) {
      throw new Error(data?.error?.message || "No valid response received.");
    }

    chatHistory.push({ role: "model", text: reply });

    const cleanResponse = reply.replace(/\*\*(.*?)\*\*/g, "$1");
    showTypingEffect(cleanResponse, textElement, incomingMessageDiv);
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message || "Something went wrong.";
    incomingMessageDiv.classList.add("error");
    incomingMessageDiv.classList.remove("loading");
  }
};

// Show loading animation (no avatar or copy button)
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
    <p class="text"></p>
    <div class="loading-indicator">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
    </div>
  </div>`;
  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv);
};

// Handle user message
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;
  isResponseGenerating = true;

  const html = `<div class="message-content">
    <p class="text"></p>
  </div>`;
  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);

  typingForm.reset();
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showLoadingAnimation, 500);

  chatHistory.push({ role: "user", text: userMessage });
};

// Event listeners
deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
  chatHistory = [];
});

suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});

loadDataFromLocalstorage();
