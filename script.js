/**
 * Minimalist Portfolio Interactivity
 * Built with vanilla JS for high performance and zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initActiveNavHighlighting();
  initSmoothAnchorScrolling();
  initCardSpotlightEffect();
});

/**
 * 1. Dynamic Copyright Year
 * Automatically updates the footer year so you never have to change it manually.
 */
function initDynamicYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Active Navigation Highlighting
 * Watch the viewport as you scroll and highlight the corresponding nav link.
 */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Triggers when section is near the top of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        navLinks.forEach((link) => {
          const linkHref = link.getAttribute('href').substring(1);
          if (linkHref === currentId) {
            link.style.color = 'var(--text-main)';
          } else {
            link.style.color = 'var(--text-muted)';
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 3. Smooth Anchor Scrolling
 * Ensures smooth scrolling for navigation links while updating focus for accessibility.
 */
function initSmoothAnchorScrolling() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * 4. Subtle Card Spotlight Effect
 * Adds a developer-focused subtle border tracking effect when hovering over project cards.
 */
function initCardSpotlightEffect() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Sets CSS variables dynamically for subtle custom interactions if expanded later
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}