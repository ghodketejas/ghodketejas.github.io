function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    if (parts[0] === name) {
      return decodeURIComponent(parts[1]);
    }
  }
  return '';
}

document.addEventListener('DOMContentLoaded', function () {
  // --- Last Visit Message ---
  const lastVisit = getCookie('lastVisit');
  const showMessagePref = getCookie('showVisitMessage');
  const messageDiv = document.getElementById('visit-message');
  const now = new Date().toLocaleString();
  setCookie('lastVisit', now, 365); // Always update visit

  if (messageDiv && showMessagePref !== 'false' && sessionStorage.getItem('visitMessageShown') !== 'true') {
    sessionStorage.setItem('visitMessageShown', 'true');

    if (!lastVisit) {
      messageDiv.textContent = 'Welcome to my portfolio for the first time! This website exhibits whatever I have learnt or achieved during my miniscule existence on this large planet.';
      messageDiv.style.display = 'block';
    } else {
      messageDiv.innerHTML = `
        Welcome back! Your last visit was ${lastVisit}.<br>
        <button class="btn btn-sm btn-success mt-2 me-2" id="keepMessage">Yes, keep showing</button>
        <button class="btn btn-sm btn-danger mt-2" id="hideMessage">No, hide it in future</button>
      `;
      messageDiv.style.display = 'block';

      document.getElementById('keepMessage').addEventListener('click', function () {
        setCookie('showVisitMessage', 'true', 365);
        messageDiv.innerHTML = 'Got it! We’ll keep showing this message.';
      });

      document.getElementById('hideMessage').addEventListener('click', function () {
        setCookie('showVisitMessage', 'false', 365);
        messageDiv.innerHTML = 'You won’t see this message again.';
      });
    }
  }

  // --- Dynamic "Last Edited" Date ---
  const lastEdited = document.getElementById('last-edited');
  if (lastEdited) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    lastEdited.textContent = today.toLocaleDateString('en-US', options);
  }

  // --- Draggable Hot Menu ---
  const menu = document.getElementById('hot-menu');
  if (menu) {
    let isDragging = false;
    let startX, startY, initialX = 0, initialY = 0;

    menu.style.position = 'fixed'; // Keep it anchored to viewport

    menu.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.clientX - initialX;
      startY = e.clientY - initialY;
      menu.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      initialX = e.clientX - startX;
      initialY = e.clientY - startY;
      menu.style.transform = `translate(${initialX}px, ${initialY}px)`;
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      menu.style.cursor = 'move';
    });
  }

  // --- Email Show/Hide Toggle ---
  const emailBtn = document.getElementById("toggle-email");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const email = document.getElementById("email");
      const btn = document.getElementById("toggle-email");
      if (email.style.display === "none") {
        email.style.display = "block";
        btn.textContent = "Hide Email";
      } else {
        email.style.display = "none";
        btn.textContent = "Show Email";
      }
    });
  }

  // --- Background Theme Toggle ---
  const bgBtn = document.getElementById("toggle-bg");
  if (bgBtn) {
    bgBtn.addEventListener("click", () => {
      document.body.classList.toggle("alt-theme");
    });
  }

  // --- Chat Input: Enter Key Sends ---
  // AI ASSISTANT TEMPORARILY DISABLED
  /*
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendChat();
      }
    });
  }

  // --- Hint Buttons ---
  document.querySelectorAll(".hint-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.textContent.trim();
      if (text.includes("Projects")) loadSample("What projects have you worked on?");
      else if (text.includes("language")) loadSample("What's your favorite programming language?");
      else if (text.includes("fun")) loadSample("Tell me something fun about you!");
    });
  });

  // Show chat overlay
  const openChatBtn = document.getElementById('open-chat-btn');
  const chatOverlay = document.getElementById('chat-overlay');
  const closeChatBtn = document.getElementById('close-chat-btn');

  openChatBtn.addEventListener('click', function() {
    chatOverlay.style.display = 'flex';
    openChatBtn.style.display = 'none';
  });

  closeChatBtn.addEventListener('click', function() {
    chatOverlay.style.display = 'none';
    openChatBtn.style.display = 'flex';
  });
  */
});

// Digital Clock
setInterval(() => {
  const now = new Date();
  const clock = document.getElementById("digit-clock");
  if (clock) clock.textContent = now.toLocaleTimeString();
}, 1000);

// Analog Clock with Canvas
function drawAnalogClock() {
  const canvas = document.getElementById("analog-clock");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  function drawClock() {
    const now = new Date();
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = "#222";
    ctx.fill();
    ctx.strokeStyle = "#0dcaf0";
    ctx.lineWidth = 4;
    ctx.stroke();

    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();
    const secAngle = sec * 6 * Math.PI / 180;
    const minAngle = (min + sec / 60) * 6 * Math.PI / 180;
    const hrAngle = (hr % 12 + min / 60) * 30 * Math.PI / 180;

    function drawHand(angle, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = "#0dcaf0";
      ctx.moveTo(0, 0);
      ctx.rotate(angle);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-angle);
    }

    drawHand(hrAngle, radius * 0.5, 6);
    drawHand(minAngle, radius * 0.75, 4);
    drawHand(secAngle, radius * 0.85, 2);
  }

  setInterval(drawClock, 1000);
}
drawAnalogClock();

// Jokes
function fetchJoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?format=txt")
    .then(res => res.text())
    .then(data => {
      const jokeBox = document.getElementById("joke-box");
      if (jokeBox) jokeBox.textContent = data;
    });
}
fetchJoke();
setInterval(fetchJoke, 60000);

// XKCD Comic
fetch("https://xkcd.vercel.app/?comic=latest")
  .then(res => res.json())
  .then(data => {
    const img = document.getElementById("xkcd-img");
    const title = document.getElementById("xkcd-title");
    if (img) img.src = data.img;
    if (title) title.textContent = data.title;
  });

// AI ASSISTANT TEMPORARILY DISABLED
/*
async function sendChat() {
  const input = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const chatContainer = document.getElementById("chat-container");
  const userMsg = input.value.trim();
  if (!userMsg) return;

  // Add chat-has-content class when first message is sent
  if (log.children.length === 0) {
    chatContainer.classList.add("chat-has-content");
  }

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerHTML = `<span>${userMsg}</span>`;
  log.appendChild(userBubble);
  input.value = "";

  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble bot typing";
  typingBubble.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
  log.appendChild(typingBubble);
  log.scrollTop = log.scrollHeight;

  try {
    const res = await fetch("https://tejas-chat-api.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });

    const data = await res.json();
    typingBubble.remove();

    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    const reply = data.reply || 'Something went wrong 😬';
    // Typing animation for bot reply
    let i = 0;
    function typeWriter() {
      if (i <= reply.length) {
        botBubble.innerHTML = `<span>${reply.slice(0, i)}</span>`;
        log.scrollTop = log.scrollHeight;
        i++;
        setTimeout(typeWriter, 15);
      }
    }
    log.appendChild(botBubble);
    typeWriter();

  } catch {
    typingBubble.remove();
    const errorBubble = document.createElement("div");
    errorBubble.className = "chat-bubble bot";
    errorBubble.innerHTML = `<span>Something went wrong 😬</span>`;
    log.appendChild(errorBubble);
  }

  log.scrollTop = log.scrollHeight;
}

function loadSample(text) {
  const input = document.getElementById("chat-input");
  input.value = text;

  // Delay slightly to ensure value is set before sending
  setTimeout(() => {
    sendChat();
  }, 50);
}
*/