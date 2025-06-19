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
  const lastVisit = getCookie('lastVisit');
  const showMessagePref = getCookie('showVisitMessage');
  const messageDiv = document.getElementById('visit-message');
  const now = new Date().toLocaleString();

  setCookie('lastVisit', now, 365); // Always update visit

  // Don't run if element not found or if user disabled message
  if (!messageDiv || showMessagePref === 'false') return;

  // Avoid showing again this session
  if (sessionStorage.getItem('visitMessageShown') === 'true') return;

  // Mark as shown for this session
  sessionStorage.setItem('visitMessageShown', 'true');

  // First time visitor
  if (!lastVisit) {
    messageDiv.textContent =
      'Welcome to my portfolio for the first time! This website exhibits whatever I have learnt or achieved during my miniscule existence on this large planet.';
    messageDiv.style.display = 'block';
    return;
  }

  // Returning visitor with no opt-out
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
});