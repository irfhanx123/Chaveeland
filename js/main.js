/**
 * CHAVEE - Core UI Utility Library
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAmbientCardGlow();
});

/**
 * Initializes sticky navigation bar changes and mobile hamburger drawer.
 */
function initNavigation() {
  const header = document.querySelector('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Dynamic scrolled class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      // Accessibility states
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-item a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }
}

/**
 * Creates a modern spotlight glowing effect on glass cards
 * by tracking cursor coordinates relative to card bounds.
 */
function initAmbientCardGlow() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within card
      const y = e.clientY - rect.top;  // y coordinate within card
      
      // Pass coordinates to CSS custom properties
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
