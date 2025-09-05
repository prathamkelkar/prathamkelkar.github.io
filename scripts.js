// Initialize AOS animations
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Initialize Feather Icons
feather.replace();

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuButton.querySelector('svg');
    if (mobileMenu.classList.contains('hidden')) {
        feather.replace();
    } else {
        icon.setAttribute('data-feather', 'x');
        feather.replace();
    }
});

// Enhanced back to top button with better mobile support
const backToTopButton = document.getElementById('back-to-top');
const scrollHandler = () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
};

// Throttle scroll events for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            scrollHandler();
            ticking = false;
        });
        ticking = true;
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Detect mobile browsers
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Adjust viewport for mobile devices
if (isMobile) {
    const viewport = document.querySelector('meta[name="viewport"]');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

// Prevent zoom on double-tap (iOS)
document.addEventListener('dblclick', (e) => {
    e.preventDefault();
}, { passive: false });

// Better touch feedback
document.querySelectorAll('button, a').forEach(el => {
    el.style.webkitTapHighlightColor = 'rgba(242, 77, 75, 0.3)';
});

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('svg');
            icon.setAttribute('data-feather', 'menu');
            feather.replace();
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
  // Helper function to truncate long text
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  // Fetch and render RSS episodes
  fetch("https://anchor.fm/s/f8380010/podcast/rss")
    .then(function (response) {
      return response.text();
    })
    .then(function (str) {
      return new window.DOMParser().parseFromString(str, "text/xml");
    })
    .then(function (data) {
      const items = data.querySelectorAll("item");
      const episodeList = document.getElementById("episode-list");
      episodeList.innerHTML = "";

      // Only show latest 3 episodes
      items.forEach(function (item, index) {
        if (index < 3) {
          const title = item.querySelector("title").textContent;
          const description = item.querySelector("description").textContent;
          const link = item.querySelector("link").textContent;

          const card = document.createElement("div");
          card.className =
            "episode-card opacity-0 translate-y-10 flex flex-col justify-between transform transition duration-700 ease-out hover:scale-105 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] text-left";

          card.innerHTML = `
            <!-- Quark Talk Logo -->
            <img src="QT_SQUARE_SMALL.png" alt="Quark Talk Logo" class="w-11/12 rounded-lg mb-6 mx-auto">

            <!-- Title -->
            <h3 class="text-2xl font-bold mb-3 text-accentred">${title}</h3>

            <!-- Description -->
            <p class="text-gray-300 text-lg mb-4">${truncateText(description, 140)}</p>

            <!-- Link -->
            <a href="${link}" target="_blank" class="text-accentyellow hover:underline flex items-center">
              Listen Now <i data-feather="arrow-right" class="ml-2 w-4 h-4"></i>
            </a>
          `;

          episodeList.appendChild(card);
        }
      });

      // Re-render feather icons
      feather.replace();

      // Animate on scroll using IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("opacity-0", "translate-y-10");
              entry.target.classList.add("opacity-100", "translate-y-0");
              observer.unobserve(entry.target); // Animate only once
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll(".episode-card").forEach((card) => {
        observer.observe(card);
      });
    })
    .catch(function (err) {
      console.error("Error fetching RSS feed:", err);
    });
});





