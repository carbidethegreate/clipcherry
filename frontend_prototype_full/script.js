/*
 * CLIPcherry frontend prototype JS
 * Provides theme toggling and dynamic year display.
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  const yearSpan = document.getElementById('year');
  // Load stored theme
  const savedTheme = localStorage.getItem('clipcherry-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  }
  themeBtn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('clipcherry-theme', next);
  });
  // Set current year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Preview and chat functionality for gallery
  const previewModal = document.getElementById('preview-modal');
  const previewImage = document.getElementById('preview-image');
  const previewTitle = document.getElementById('preview-title');
  const previewDesc = document.getElementById('preview-description');
  const unlockBtn = document.getElementById('unlock-btn');
  const previewChatBtn = document.getElementById('preview-chat-btn');
  const previewClose = document.getElementById('preview-close');
  const chatOverlay = document.getElementById('chat-overlay');
  const chatTitle = document.getElementById('chat-title');
  const chatClose = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputField = document.getElementById('chat-input-field');
  const sendBtn = document.getElementById('send-btn');
  const tipBtn = document.getElementById('tip-btn');

  // Only attach if elements exist
  if (previewModal) {
    // Helper to open preview modal
    function openPreview(data) {
      previewImage.src = data.image;
      previewTitle.textContent = `${data.creator} – ${data.title}`;
      previewDesc.textContent = `Preview of ${data.title} by ${data.creator}.`;
      unlockBtn.textContent = data.price === '$0.00' ? 'View Free' : `Unlock (${data.price})`;
      // Attach creator to chat button
      previewChatBtn.dataset.creator = data.creator;
      previewModal.classList.add('active');
    }
    // Attach preview buttons
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = {
          title: btn.dataset.title,
          creator: btn.dataset.creator,
          price: btn.dataset.price,
          image: btn.dataset.image
        };
        openPreview(data);
      });
    });
    // Close preview
    previewClose.addEventListener('click', () => {
      previewModal.classList.remove('active');
    });
    // Chat from preview
    previewChatBtn.addEventListener('click', () => {
      const creator = previewChatBtn.dataset.creator;
      openChat(creator);
      previewModal.classList.remove('active');
    });
  }
  if (chatOverlay) {
    function openChat(creator) {
      chatTitle.textContent = `Chat with ${creator}`;
      chatOverlay.classList.add('active');
    }
    // Attach chat buttons on cards
    document.querySelectorAll('.chat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const creator = btn.dataset.creator;
        openChat(creator);
      });
    });
    // Close chat
    chatClose && chatClose.addEventListener('click', () => {
      chatOverlay.classList.remove('active');
    });
    // Send message
    sendBtn && sendBtn.addEventListener('click', () => {
      const msg = chatInputField.value.trim();
      if (!msg) return;
      const div = document.createElement('div');
      div.className = 'message supporter';
      div.textContent = msg;
      chatMessages.appendChild(div);
      chatInputField.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    // Tip button (static for demo)
    tipBtn && tipBtn.addEventListener('click', () => {
      alert('Thank you for your tip! (Simulation)');
    });
  }
});