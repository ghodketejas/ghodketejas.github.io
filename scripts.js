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
});

// Digital Clock
setInterval(() => {
  const now = new Date();
  document.getElementById("digit-clock").textContent = now.toLocaleTimeString();
}, 1000);

// Analog Clock with Canvas
function drawAnalogClock() {
  const canvas = document.getElementById("analog-clock");
  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  function drawClock() {
    const now = new Date();
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    // Clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = "#222";
    ctx.fill();
    ctx.strokeStyle = "#0dcaf0";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Hands
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

function fetchJoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?format=txt")
    .then(res => res.text())
    .then(data => {
      document.getElementById("joke-box").textContent = data;
    });
}
fetchJoke();
setInterval(fetchJoke, 60000);

fetch("https://xkcd.vercel.app/?comic=latest")
  .then(res => res.json())
  .then(data => {
    document.getElementById("xkcd-img").src = data.img;
    document.getElementById("xkcd-title").textContent = data.title;
  });

async function sendChat() {
  const input = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const userMsg = input.value.trim();
  if (!userMsg) return;

  log.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
  input.value = "";

  const botTyping = document.createElement("div");
  botTyping.id = "typing";
  botTyping.innerHTML = `<em>TejasBot is typing...</em>`;
  log.appendChild(botTyping);
  log.scrollTop = log.scrollHeight;

  const res = await fetch("https://ghodketejas-github-io.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMsg })
  });

  const data = await res.json();
  botTyping.remove();

  const botResponse = document.createElement("div");
  botResponse.innerHTML = `<strong>TejasBot:</strong> ${data.reply}`;
  log.appendChild(botResponse);
  log.scrollTop = log.scrollHeight;
}

function loadSample(text) {
  document.getElementById("chat-input").value = text;
  sendChat();
}
