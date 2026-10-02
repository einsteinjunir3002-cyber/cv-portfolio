import smartlearnImg from './assets/images/project-smartlearn.png';
import likemImg from './assets/images/project-likem.jpeg';
import rentImg from './assets/images/project-rent.svg';
import solarImg from './assets/images/project-solar.svg';
import harmonyImg from './assets/images/project-harmony.jpeg';

function initAll() {
  initNavbar();
  initMobileMenu();
  initScrollspy();
  initProjectFilters();
  initProjectModal();
  initCopyButtons();
  initContactForm();
  initCvDownloadTracker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* --------------------------------------------------------------------------
   1. NAVBAR ELEVATION & SCROLL STATE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = drawer ? drawer.querySelectorAll('.mobile-link, a') : [];

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking any menu link
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLLSPY (ACTIVE LINK HIGHLIGHT)
   -------------------------------------------------------------------------- */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   4. PROJECT CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE PROJECT DETAILS MODAL
   -------------------------------------------------------------------------- */
const PROJECT_DATA = {
  smartlearn: {
    title: 'SmartLearn — AI-Powered Collaborative Learning Platform',
    badge: 'UCC Final-Year Capstone Project (2025 – 2026)',
    type: 'Academic Capstone Project &bull; 4-Year Computer Science Degree',
    image: smartlearnImg,
    repo: 'https://github.com/einsteinjunir3002-cyber/L400-PROJECT-SUBMISSION',
    repoText: 'View GitHub Repository',
    summary: 'A comprehensive, full-stack collaborative learning management system co-created as our final-year project at the University of Cape Coast (UCC). Designed to modernize university study by providing an always-available contextual AI study tutor alongside peer collaboration spaces.',
    features: [
      '🤖 <strong>Contextual AI Study Assistant:</strong> Chat tutor that provides structured, subject-relevant academic guidance.',
      '🏢 <strong>Collaborative Workspaces:</strong> Real-time shared study spaces for classmates to pool notes and discussions.',
      '📚 <strong>General Resource Library:</strong> Structured repository organized by academic topics and course materials.',
      '📝 <strong>Interactive Quizzes & AI Feedback:</strong> Instant evaluation and feedback on knowledge checks.',
      '💬 <strong>Direct Student Messaging:</strong> Integrated peer-to-peer communication directly on platform.',
      '🔐 <strong>Secure Authentication:</strong> JWT token authentication and role-based access control.'
    ],
    tech: ['React', 'Vite', 'Node.js', 'Express', 'SQLite (better-sqlite3)', 'JWT', 'Context API', 'Vanilla CSS'],
    contribution: 'Researched backend and API endpoints, co-built the React frontend, structured the pre-seeded SQLite database schema, and integrated the AI assistant service endpoint.'
  },
  likem: {
    title: 'LIKEM Perfumes — Ghanaian Social-Commerce & E-Commerce Platform',
    badge: 'Production Client Solution (2026)',
    type: 'Real-World Client E-Commerce Project',
    image: likemImg,
    repo: 'https://github.com/einsteinjunir3002-cyber/Likem-Store',
    repoText: 'View GitHub Repository',
    summary: 'A production-grade e-commerce web platform engineered for an independent Ghanaian fragrance vendor selling perfumes through WhatsApp and social media. Solved the operational challenge of manual stock inquiries by building an automated storefront with Ghana Mobile Money and WhatsApp order dispatch.',
    features: [
      '📲 <strong>Dual Checkout Flow:</strong> Mode A allows 1-click WhatsApp order generation with prefilled product names and GH₵ totals; Mode B provides server-verified online checkout.',
      '💳 <strong>Paystack Ghana Integration:</strong> Accepts MTN Mobile Money, Telecel Cash, AT Money, and bank debit cards.',
      '🇬🇭 <strong>Ghana Regional Shipping Engine:</strong> Automated delivery fee calculation across Greater Accra and all 16 Ghanaian regions.',
      '📊 <strong>Owner Admin Portal:</strong> Product price editor, catalog manager, inventory deduplication, and a WhatsApp Sale Recorder for tracking off-platform sales.',
      '📸 <strong>Media Management:</strong> High-res photo catalog with dimension validation and SHA256 image deduplication.'
    ],
    tech: ['Next.js (App Router)', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Paystack Ghana API', 'WhatsApp Click-to-Chat'],
    contribution: 'Solely built the full-stack application, integrated the Paystack Ghana webhook architecture, modeled the Prisma relational database, and deployed the storefront.'
  },
  rent: {
    title: 'Bekoe Rental Property Website & Tenancy Management System',
    badge: 'Enterprise Property Solution (2026)',
    type: 'Family Enterprise Web Platform & Admin Dashboard',
    image: rentImg,
    repo: '',
    repoText: 'Real-World Local Business Platform',
    summary: 'A full-stack property presentation and tenancy management system created specifically for Richard Bekoe\'s residential rental property located at Adenta New Site, behind West Africa Senior High School (WASHS), Greater Accra. Designed to streamline tenant inquiries, room availability, and lease documentation.',
    features: [
      '🏠 <strong>Public Room Catalog:</strong> Detailed room listings with verified amenities, pricing terms, and real-time availability status.',
      '📅 <strong>Physical Viewing Booking:</strong> Prospective tenants can select and schedule in-person viewing slots.',
      '📝 <strong>Online Tenancy Application:</strong> Application portal with Ghana Card / ID verification upload support.',
      '💬 <strong>Direct WhatsApp Inquiry:</strong> Instant 1-click messaging connection to management for room questions.',
      '🛡️ <strong>Owner Admin Portal:</strong> Room CRUD, public publishing toggles, tenant agreements repository, and CMS content blocks.'
    ],
    tech: ['Next.js 14+ (App Router)', 'TypeScript', 'Prisma ORM', 'Tailwind CSS', 'Lucide Icons', 'SQLite / PostgreSQL'],
    contribution: 'Designed and engineered the complete solution from concept to production, providing direct value to a real family business in Adentan.'
  },
  solar: {
    title: 'ARSPCS — Autonomous Robotic Solar Panel Cleaning Simulation',
    badge: 'Systems Engineering & Telemetry (2026)',
    type: 'Engineering Simulation & Telemetry Analytics',
    image: solarImg,
    repo: 'https://github.com/einsteinjunir3002-cyber/joy-solar-robot-simulator',
    repoText: 'View GitHub Repository',
    summary: 'An advanced physics-based telemetry and state-machine simulation model designed to evaluate autonomous robotic solar panel cleaning efficiency in dusty West African tropical climates. Evaluates battery degradation cycles, dust soiling reduction, and operational state dynamics.',
    features: [
      '⚙️ <strong>Finite State Machine:</strong> Precise transition model (IDLE, DEPLOY, TRAVERSE_ROW, BRUSH_PANEL, DOCK, RECHARGE).',
      '📉 <strong>Environmental Soiling Model:</strong> Physics-grounded dust accumulation and cleaning efficiency tracking.',
      '🔋 <strong>Battery Degradation Telemetry:</strong> Depth-of-discharge and cycle degradation calculations.',
      '📊 <strong>Automated Reporting:</strong> Generates executive client HTML and PDF summary reports with Matplotlib data visualizations.',
      '🧪 <strong>Automated Test Suite:</strong> Comprehensive unit testing for state transitions and battery edge cases.'
    ],
    tech: ['Python 3', 'State Machine Architecture', 'Matplotlib', 'Physics Simulation', 'Automated Unit Tests'],
    contribution: 'Engineered the simulation core, telemetry logging pipeline, state machine transitions, and client technical reporting format.'
  },
  harmony: {
    title: 'Harmony Haven Enterprise — Multi-Brand E-Commerce Platform',
    badge: 'Multi-Brand Ghanaian Commercial Hub (2026)',
    type: 'Commercial Enterprise Multi-Brand Platform',
    image: harmonyImg,
    repo: 'https://github.com/einsteinjunir3002-cyber/harmony-haven-enterprise',
    repoText: 'View GitHub Repository',
    summary: 'A full-stack, multi-brand Ghanaian enterprise commerce platform powering multiple sister business verticals: Kowah\'s Dishes (fresh homemade Ghanaian culinary meals) and 4U HEARTLINES (bespoke poetry commissions, scented candles, and curated gift boxes).',
    features: [
      '🛍️ <strong>Multi-Brand Storefront:</strong> Unified architecture hosting independent child brand storefronts under one master enterprise.',
      '🚚 <strong>Ghana Nationwide Delivery:</strong> Integrated delivery fee schedules covering all 16 Ghanaian regions.',
      '📱 <strong>WhatsApp Dispatch:</strong> Direct order routing to business lines for immediate fulfillment.',
      '💳 <strong>Paystack / MoMo Support:</strong> Secure transaction pipeline with webhook state verification.',
      '📈 <strong>Executive Management Center:</strong> Multi-brand catalog, inventory controls, and order tracking.'
    ],
    tech: ['Next.js App Router', 'TypeScript', 'Prisma ORM', 'Paystack API', 'WhatsApp Dispatch', 'Tailwind CSS'],
    contribution: 'Architected the multi-brand database schema, developed storefront interfaces, and implemented payment and order confirmation pipelines.'
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalContent) return;

  function openProject(projectId) {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    let repoBtnHtml = '';
    if (data.repo) {
      repoBtnHtml = `
        <a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>${data.repoText}</span>
        </a>
      `;
    } else {
      repoBtnHtml = `
        <span class="badge-pill-verified" style="font-size: 0.85rem; padding: 6px 12px; background: rgba(16,185,129,0.15); border-radius: 6px;">
          ✓ ${data.repoText}
        </span>
      `;
    }

    const techTags = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    const featuresList = data.features.map(f => `<li style="margin-bottom: 6px; font-size: 0.9rem; color: #cbd5e1;">${f}</li>`).join('');

    modalContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="glass-pill" style="font-size: 0.75rem; color: var(--accent-cyan-light); margin-bottom: 8px;">${data.badge}</span>
        <h3 id="modal-project-title" style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 6px;">${data.title}</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">${data.type}</p>
      </div>

      <div style="border-radius: 12px; overflow: hidden; margin-bottom: 20px; max-height: 280px; background: #0f172a;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em;">Overview</h4>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.6;">${data.summary}</p>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.03em;">Key Features &amp; Modules</h4>
        <ul style="list-style: none; padding-left: 0;">${featuresList}</ul>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.03em;">Technologies Used</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">${techTags}</div>
      </div>

      <div style="margin-bottom: 24px; padding: 12px 14px; background: rgba(0,0,0,0.3); border-left: 3px solid var(--accent-cyan-light); border-radius: 6px;">
        <strong style="color: #fff; font-size: 0.88rem;">Samuel's Role &amp; Contribution:</strong>
        <p style="font-size: 0.88rem; color: #94a3b8; margin-top: 4px; line-height: 1.5;">${data.contribution}</p>
      </div>

      <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
        ${repoBtnHtml}
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.dataset.project;
      openProject(pId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. COPY TO CLIPBOARD BUTTONS
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied to clipboard: ${text}`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${text}`);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const subject = form.elements['subject'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !subject || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please fill out all required fields before submitting.';
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please provide a valid email address.';
      return;
    }

    // Construct mailto intent
    const mailtoUrl = `mailto:einsteinjunir3002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      ✓ Thank you, <strong>${escapeHtml(name)}</strong>! Your message is being directed to Samuel's email client.
    `;

    showToast('Opening email client for dispatch...');

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   8. CV DOWNLOAD INTERACTION
   -------------------------------------------------------------------------- */
function initCvDownloadTracker() {
  const downloadBtns = document.querySelectorAll('.cv-download-trigger');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading official 2-page ATS CV (PDF)...');
    });
  });
}

/* --------------------------------------------------------------------------
   9. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, duration);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
