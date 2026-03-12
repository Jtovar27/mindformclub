/* =====================================================
   MINDFORM ACTIVE — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll behaviour ──────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Mobile nav ───────────────────────────────── */
  const burger  = document.querySelector('.navbar__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── Scroll reveal (IntersectionObserver) ─────── */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── FAQ accordion ────────────────────────────── */
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked (if was closed)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Product accordion (detail page) ─────────── */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });

  /* ── Gallery thumbnails (product page) ───────── */
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.querySelector('.gallery-main img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        const src = thumb.querySelector('img').src;
        mainImg.src = src;
      }
    });
  });

  /* ── Size selector ────────────────────────────── */
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.size-options')
        .querySelectorAll('.size-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ── Color swatch ─────────────────────────────── */
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatch.closest('.color-options')
        .querySelectorAll('.color-swatch')
        .forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });

  /* ── Filter tabs (shop page) ──────────────────── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tab.closest('.filter-tabs')
        .querySelectorAll('.filter-tab')
        .forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ── Quick Add toast ──────────────────────────── */
  document.querySelectorAll('.product-card__quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Added to bag');
    });
  });
  const addBtn = document.querySelector('.product-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => showToast('Added to bag'));
  }

  function showToast(msg) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;
    toast.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      background:var(--charcoal); color:var(--cream); padding:12px 28px;
      font-family:var(--font-body); font-size:0.72rem; letter-spacing:0.14em;
      text-transform:uppercase; font-weight:500; z-index:200;
      box-shadow:0 6px 32px rgba(35,31,32,0.2);
      opacity:0; transition:opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  /* ── Chatbot ──────────────────────────────────── */
  const chatFab     = document.querySelector('.chatbot-fab');
  const chatWindow  = document.querySelector('.chatbot-window');
  const chatClose   = document.querySelector('.chatbot-head-close');
  const chatInput   = document.querySelector('.chatbot-input-row input');
  const chatSend    = document.querySelector('.chatbot-send');
  const chatMessages = document.querySelector('.chatbot-messages');
  const chips       = document.querySelectorAll('.chip');

  const botResponses = {
    'sizing': 'Our pieces run true to size. For a relaxed fit, go up one size. Check the size guide on each product page for exact measurements.',
    'shipping': 'We ship across the U.S. Standard shipping takes 3–5 business days. Express options are available at checkout.',
    'returns': 'We offer free returns within 30 days of purchase. Items must be unworn and in original condition.',
    'collections': 'Our current collection includes Tops, Leggings, Sets, and Accessories. Visit the Shop page to explore everything.',
    'default': "Thanks for reaching out! Our team is here to help. For immediate assistance, feel free to browse our FAQ page or explore the collection."
  };

  function addMessage(text, isUser = false) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${isUser ? 'user' : 'bot'}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function botReply(input) {
    const text = input.toLowerCase();
    setTimeout(() => {
      if (text.includes('size') || text.includes('fit')) {
        addMessage(botResponses.sizing);
      } else if (text.includes('ship') || text.includes('deliver')) {
        addMessage(botResponses.shipping);
      } else if (text.includes('return') || text.includes('exchange')) {
        addMessage(botResponses.returns);
      } else if (text.includes('collection') || text.includes('product') || text.includes('shop')) {
        addMessage(botResponses.collections);
      } else {
        addMessage(botResponses.default);
      }
    }, 700);
  }

  function sendMessage() {
    if (!chatInput || !chatInput.value.trim()) return;
    const val = chatInput.value.trim();
    addMessage(val, true);
    chatInput.value = '';
    botReply(val);
  }

  if (chatFab) chatFab.addEventListener('click', () => chatWindow.classList.toggle('open'));
  if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  }
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      addMessage(chip.textContent, true);
      botReply(chip.textContent);
      chip.closest('.chatbot-chips').style.display = 'none';
    });
  });

  /* ── Newsletter form ──────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        showToast('You\'re on the list. Welcome to mindform.');
      }
    });
  });

  /* ── Active nav link ──────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
