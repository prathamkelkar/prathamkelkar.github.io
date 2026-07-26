/**
 * Portfolio Interactivity & Telemetry
 * Built with vanilla JS — zero dependencies, fast execution.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initActiveNavHighlighting();
  initSmoothAnchorScrolling();
  initSydneyTelemetry();
  initTextScramble();
  initKeyboardNav();
  initMagneticElements();
});

/**
 * 1. Dynamic Copyright Year
 */
function initDynamicYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Active Navigation Highlighting
 */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        navLinks.forEach((link) => {
          const linkHref = link.getAttribute('href').substring(1);
          link.style.color = (linkHref === currentId) ? 'var(--text-main)' : 'var(--text-muted)';
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 3. Smooth Anchor Scrolling
 */
function initSmoothAnchorScrolling() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * 4. Live Sydney Telemetry Bar
 */
function initSydneyTelemetry() {
  const header = document.querySelector('.header');
  if (!header) return;

  const telemetry = document.createElement('div');
  telemetry.className = 'telemetry-bar';
  telemetry.style.cssText = `
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: -0.01em;
  `;

  const nav = header.querySelector('.nav');
  if (nav) {
    header.insertBefore(telemetry, nav);
  } else {
    header.appendChild(telemetry);
  }

  function updateClock() {
    const now = new Date();
    
    const timeOptions = {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const tzOptions = {
      timeZone: 'Australia/Sydney',
      timeZoneName: 'short'
    };

    const timeStr = new Intl.DateTimeFormat('en-GB', timeOptions).format(now);
    const tzParts = new Intl.DateTimeFormat('en-US', tzOptions).formatToParts(now);
    const tzName = tzParts.find(p => p.type === 'timeZoneName')?.value || 'AEST';

    telemetry.innerHTML = `
      <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#10b981;" title="System Active"></span>
      <span>SYD ${timeStr} ${tzName}</span>
    `;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * 5. Terminal Text Scramble / Decryption Effect
 */
function initTextScramble() {
  const glyphs = '0123456789ABCDEF!#$/<>%&*[]{}';
  const targetElements = document.querySelectorAll('.mono-tag, .project-title a');

  targetElements.forEach((el) => {
    const originalText = el.textContent;
    let animationFrame;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      cancelAnimationFrame(animationFrame);

      function scramble() {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration) return originalText[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');

        if (iteration < originalText.length) {
          iteration += 1 / 2;
          animationFrame = requestAnimationFrame(scramble);
        } else {
          el.textContent = originalText;
        }
      }

      scramble();
    });

    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animationFrame);
      el.textContent = originalText;
    });
  });
}

/**
 * 6. FEATURE 3: Developer Keyboard Navigation (j / k / ?)
 * Jump between sections using Vim-style keyboard shortcuts and show a minimal hint toast.
 */
function initKeyboardNav() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  // Create subtle keybind hint in bottom-right corner
  const hintToast = document.createElement('div');
  hintToast.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-dark);
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    opacity: 0.7;
    transition: opacity var(--transition);
    pointer-events: none;
    z-index: 100;
  `;
  hintToast.innerHTML = `<span style="color: var(--accent);">[j/k]</span> Navigate &nbsp;<span style="color: var(--accent);">[?]</span> Shortcuts`;
  document.body.appendChild(hintToast);

  document.addEventListener('keydown', (e) => {
    // Ignore input fields if any exist
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    const scrollY = window.scrollY;
    let currentSectionIndex = 0;

    // Determine current visible section
    sections.forEach((sec, idx) => {
      if (scrollY >= sec.offsetTop - 150) {
        currentSectionIndex = idx;
      }
    });

    if (e.key === 'j' || e.key === 'J') {
      // Jump to next section
      const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
      sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'k' || e.key === 'K') {
      // Jump to previous section
      const prevIndex = Math.max(currentSectionIndex - 1, 0);
      sections[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === '?') {
      // Flash or toggle toast prominence
      hintToast.style.opacity = hintToast.style.opacity === '1' ? '0.7' : '1';
    }
  });
}

/**
 * 7. FEATURE 5: Magnetic Physical Cursor Easing
 * Gently pulls action links towards the cursor when hovering, giving a damped control-loop feel.
 */
function initMagneticElements() {
  const magneticTargets = document.querySelectorAll('.social-links a, .project-link, .nav a');

  magneticTargets.forEach((el) => {
    el.style.display = 'inline-block'; // Required for transform offsets
    el.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Dampened pull strength (max ~3-4px shift)
      const pullX = (e.clientX - centerX) * 0.2;
      const pullY = (e.clientY - centerY) * 0.2;

      el.style.transform = `translate(${pullX}px, ${pullY}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}