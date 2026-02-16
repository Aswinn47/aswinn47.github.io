/* ============================
   Basic UI interactions
   - Mobile menu toggle
   - Theme (light/dark) toggle (persisted in localStorage)
   - Smooth scroll + active nav highlight (IntersectionObserver)
   - Reveal-on-scroll (IntersectionObserver)
   - Contact form basic handling (no backend)
   ============================ */

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryMenu = document.getElementById('primary-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------------
  // Mobile menu
  // -------------
  mobileToggle.addEventListener('click', function () {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!expanded));
    primaryMenu.classList.toggle('open');
  });

  // Close mobile menu when a nav link is clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      primaryMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // -------------
  // Theme toggle (light/dark)
  // -------------
  const THEME_KEY = 'preferred-theme';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) body.classList.toggle('dark', saved === 'dark');

  themeToggle.addEventListener('click', function () {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    // update icon (simple)
themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
  });

  // -------------
  // Smooth scroll behavior for keyboard users (optional enhancement)
  // -------------
  // Links already use CSS scroll-behavior; this adds a small offset to account for sticky header
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - Math.round(headerHeight + 12);
        window.scrollTo({ top: y, behavior: 'smooth' });
        // update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({preventScroll:true});
      }
    });
  });

  // -------------
  // Active nav highlighting using IntersectionObserver
  // -------------
  const sections = document.querySelectorAll('main section[id]');
  const navMap = {};
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) navMap[href.slice(1)] = a;
  });

  const obsOptions = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0.2 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navLink = navMap[id];
      if (!navLink) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link.active').forEach(n => n.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }, obsOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // -------------
  // Reveal on scroll (simple)
  // -------------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // reveal once
      }
    });
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // -------------
  // Contact form (no backend) — basic validation and UI feedback
  // -------------
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();

    // Very simple client-side validation
    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all fields.';
      formStatus.style.color = 'var(--muted)';
      return;
    }

    // Since there is no backend, we simply show a friendly message and reset.
    formStatus.textContent = 'Thanks — your message was noted locally (no backend). Replace with your form endpoint or email link to actually send messages.';
    formStatus.style.color = 'var(--muted)';
    contactForm.reset();
  });

  // Accessibility: close menu with Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      primaryMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });

});