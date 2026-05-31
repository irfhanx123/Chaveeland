/**
 * CHAVEE - Dynamic Events Engine
 */

// Mock Database of Curated Events
const EVENTS_DATA = [
  {
    id: 'evt-001',
    title: 'Gourmet Alchemy: Secret Gastronomy Night',
    category: 'culinary',
    categoryLabel: 'Culinary Craft',
    description: 'An intimate multi-course sensory dinner curated by a triple-Michelin starred chef. Exploring molecular cuisine paired with rare reserve vintages in an undisclosed private vault.',
    date: 'June 18, 2026',
    time: '20:00 - Midnight',
    location: 'The Vault, London',
    status: 'members',
    statusLabel: 'Members Exclusive',
    accentColor: '#d4af37'
  },
  {
    id: 'evt-002',
    title: 'Vernissage: Avant-Garde Light & Space',
    category: 'art',
    categoryLabel: 'Arts & Culture',
    description: 'Private preview of the immersive projection gallery by international digital sculptors. Meet the artists while enjoying high-altitude champagne on our outdoor deck.',
    date: 'June 25, 2026',
    time: '19:00 - 22:30',
    location: 'Rooftop Atelier, Soho',
    status: 'upcoming',
    statusLabel: 'Invites Open',
    accentColor: '#3498db'
  },
  {
    id: 'evt-003',
    title: 'The Sovereign Era: Decentralized Capitals & AI',
    category: 'ideas',
    categoryLabel: 'Tech & Ideas',
    description: 'An off-the-record fireside conversation featuring prominent venture capitalists, AI developers, and sovereign wealth managers discussing the future of sovereign data vaults.',
    date: 'July 09, 2026',
    time: '18:30 - 21:00',
    location: 'The Study, Westminster',
    status: 'upcoming',
    statusLabel: 'Limited Seats',
    accentColor: '#2ecc71'
  },
  {
    id: 'evt-004',
    title: 'Chavee midsummer Gala: Obsidian & Gold',
    category: 'galas',
    categoryLabel: 'Galas & Soir\u00e9es',
    description: 'Our flagship midsummer celebration. A black-tie grand evening featuring orchestral cyber-symphonies, live performance art installations, and curated artisan mixology stations.',
    date: 'July 25, 2026',
    time: '21:00 - 04:00',
    location: 'Chavee Hall, Belgravia',
    status: 'upcoming',
    statusLabel: '12 Invites Left',
    accentColor: '#9b59b6'
  },
  {
    id: 'evt-005',
    title: 'Whisky, Leather & Time: Masterclass Tasting',
    category: 'culinary',
    categoryLabel: 'Culinary Craft',
    description: 'A dedicated tasting of single malts from lost distilleries dating back to the late 19th century, led by a master distiller. Paired with aged artisan chocolates and Cuban cigars.',
    date: 'August 06, 2026',
    time: '20:30 - 23:00',
    location: 'The Cask Room',
    status: 'soldout',
    statusLabel: 'Fully Booked',
    accentColor: '#e67e22'
  },
  {
    id: 'evt-006',
    title: 'Sound bath Resonance: Ambient Soundscapes',
    category: 'art',
    categoryLabel: 'Arts & Culture',
    description: 'A multi-sensory restorative evening combining bio-feedback synthesizer soundscapes with deep crystal singing bowls, designed for deep relaxation and acoustic calibration.',
    date: 'August 20, 2026',
    time: '19:00 - 20:30',
    location: 'The Sanctuary, Chelsea',
    status: 'upcoming',
    statusLabel: 'Invites Open',
    accentColor: '#1abc9c'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const eventsGrid = document.getElementById('events-grid');
  const searchInput = document.getElementById('event-search');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let activeCategory = 'all';
  let searchQuery = '';

  // Initial render
  renderEvents();

  // Filter Buttons Click Handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      renderEvents();
    });
  });

  // Search input typing handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderEvents();
    });
  }

  /**
   * Main render function that filters list and updates UI
   */
  function renderEvents() {
    if (!eventsGrid) return;

    // Filter events
    const filteredEvents = EVENTS_DATA.filter(evt => {
      const matchesCategory = activeCategory === 'all' || evt.category === activeCategory;
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery) ||
                            evt.description.toLowerCase().includes(searchQuery) ||
                            evt.location.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    // Check if empty
    if (filteredEvents.length === 0) {
      eventsGrid.innerHTML = `
        <div class="no-events-found">
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h3>No Gatherings Found</h3>
          <p>We could not find any events matching "${escapeHtml(searchQuery)}" in this chapter.</p>
        </div>
      `;
      return;
    }

    // Render cards
    eventsGrid.innerHTML = filteredEvents.map(evt => {
      const statusClass = `status-${evt.status}`;
      const isSoldOut = evt.status === 'soldout';
      const ctaText = isSoldOut ? 'Join Waiting List' : 'Request Invitation';
      const btnClass = isSoldOut ? 'btn-outline' : 'btn-gold';

      return `
        <article class="glass-card event-card" data-category="${evt.category}" style="animation: fadeIn 0.4s ease-out forwards;">
          <div class="event-media">
            <span class="event-status-badge ${statusClass}">${evt.statusLabel}</span>
            <div class="event-art-canvas">
              ${generateEventVectorGraphic(evt.category, evt.title, evt.accentColor)}
            </div>
          </div>
          <div class="event-card-content">
            <span class="event-category-label">${evt.categoryLabel}</span>
            <h3 class="event-title">${evt.title}</h3>
            <p class="event-desc">${evt.description}</p>
            <div class="event-details-row">
              <span class="event-detail-item">
                <svg viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                ${evt.date}
              </span>
              <span class="event-detail-item">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                ${evt.location}
              </span>
            </div>
            <a href="signup.html?event=${encodeURIComponent(evt.id)}" class="btn ${btnClass} event-cta-btn">${ctaText}</a>
          </div>
        </article>
      `;
    }).join('');

    // Re-initialize hover effects on newly rendered cards
    if (window.initAmbientCardGlow) {
      window.initAmbientCardGlow();
    }
  }
});

/**
 * Generates an inline premium SVG illustration according to event category
 */
function generateEventVectorGraphic(category, title, accentColor) {
  const seed = title.charCodeAt(0) + title.charCodeAt(title.length - 1);
  
  if (category === 'culinary') {
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="background:#13110e">
        <defs>
          <radialGradient id="grad-c-${seed}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#13110e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-c-${seed})"/>
        <!-- Abstract Culinary Glass Shapes -->
        <circle cx="200" cy="110" r="55" fill="none" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1"/>
        <circle cx="200" cy="110" r="45" fill="none" stroke="${accentColor}" stroke-opacity="0.1" stroke-width="2"/>
        <path d="M 175 110 L 225 110" stroke="${accentColor}" stroke-opacity="0.2"/>
        <path d="M 200 85 L 200 135" stroke="${accentColor}" stroke-opacity="0.2"/>
        <circle cx="200" cy="110" r="3" fill="${accentColor}" fill-opacity="0.7"/>
        <path d="M 140 150 Q 200 170 260 150" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1.5"/>
      </svg>
    `;
  }
  
  if (category === 'art') {
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="background:#0e1114">
        <defs>
          <linearGradient id="grad-a-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#0e1114" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-a-${seed})"/>
        <!-- Geometric Modernist Lines -->
        <path d="M 50 160 L 150 60 L 250 160 L 350 60" fill="none" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1.5"/>
        <circle cx="150" cy="60" r="20" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1"/>
        <circle cx="250" cy="160" r="35" fill="none" stroke="${accentColor}" stroke-opacity="0.1" stroke-width="1"/>
        <line x1="50" y1="110" x2="350" y2="110" stroke="${accentColor}" stroke-opacity="0.08" stroke-dasharray="5,5"/>
        <circle cx="200" cy="110" r="4" fill="${accentColor}" fill-opacity="0.6"/>
      </svg>
    `;
  }

  if (category === 'ideas') {
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="background:#0d1310">
        <defs>
          <radialGradient id="grad-i-${seed}" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#0d1310" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad-i-${seed})"/>
        <!-- Matrix / Constellation Lines -->
        <circle cx="120" cy="70" r="5" fill="${accentColor}" fill-opacity="0.4"/>
        <circle cx="280" cy="70" r="5" fill="${accentColor}" fill-opacity="0.4"/>
        <circle cx="200" cy="150" r="8" fill="none" stroke="${accentColor}" stroke-opacity="0.6" stroke-width="1.5"/>
        <line x1="120" y1="70" x2="200" y2="150" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1"/>
        <line x1="280" y1="70" x2="200" y2="150" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1"/>
        <line x1="120" y1="70" x2="280" y2="70" stroke="${accentColor}" stroke-opacity="0.1" stroke-width="1"/>
        
        <circle cx="160" cy="110" r="3" fill="${accentColor}" fill-opacity="0.3"/>
        <circle cx="240" cy="110" r="3" fill="${accentColor}" fill-opacity="0.3"/>
        <line x1="160" y1="110" x2="240" y2="110" stroke="${accentColor}" stroke-opacity="0.15"/>
      </svg>
    `;
  }
  
  // Default is Gala Constellation
  return `
    <svg width="100%" height="100%" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="background:#110e14">
      <defs>
        <radialGradient id="grad-g-${seed}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#110e14" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad-g-${seed})"/>
      <!-- Constellations & Diamonds -->
      <polygon points="200,60 230,110 200,160 170,110" fill="none" stroke="${accentColor}" stroke-opacity="0.35" stroke-width="1.5"/>
      <polygon points="200,75 220,110 200,145 180,110" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1"/>
      <line x1="200" y1="30" x2="200" y2="190" stroke="${accentColor}" stroke-opacity="0.1"/>
      <line x1="120" y1="110" x2="280" y2="110" stroke="${accentColor}" stroke-opacity="0.1"/>
      <circle cx="200" cy="60" r="3" fill="${accentColor}"/>
      <circle cx="200" cy="160" r="3" fill="${accentColor}"/>
      <circle cx="170" cy="110" r="3" fill="${accentColor}"/>
      <circle cx="230" cy="110" r="3" fill="${accentColor}"/>
    </svg>
  `;
}

/**
 * Escapes HTML characters to prevent XSS injection
 */
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
