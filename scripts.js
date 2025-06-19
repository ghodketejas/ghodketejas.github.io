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
    let offsetX = 0;
    let offsetY = 0;

    menu.addEventListener('mousedown', function (e) {
      isDragging = true;
      offsetX = e.clientX - menu.offsetLeft;
      offsetY = e.clientY - menu.offsetTop;
      menu.style.position = 'absolute';
      menu.style.zIndex = 9999;
      menu.style.cursor = 'move';
    });

    document.addEventListener('mousemove', function (e) {
      if (isDragging) {
        menu.style.left = e.clientX - offsetX + 'px';
        menu.style.top = e.clientY - offsetY + 'px';
      }
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });
  }
});
