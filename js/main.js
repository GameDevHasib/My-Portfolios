/**
 * MD HASIBUL ISLAM - UNREAL ENGINE GAME DEVELOPER PORTFOLIO
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initProjectFilters();
  initModals();
  initContactForm();
  initCopyButtons();
});

/* ==========================================================================
   NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar Blur Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Active Link Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   AMBIENT HERO PARTICLE CANVAS
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };

  window.addEventListener('resize', resize);
  resize();

  const particleCount = Math.min(Math.floor(width / 20), 65);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00e5ff';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting cyber lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Only animate if reduced motion is not requested
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }
}

/* ==========================================================================
   PROJECT FILTERING SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   MODALS: VIDEO TRAILER & IMAGE LIGHTBOX
   ========================================================================== */
function initModals() {
  const videoModal = document.getElementById('videoModal');
  const imageModal = document.getElementById('imageModal');
  const videoFrame = document.getElementById('videoFrame');
  const lightboxImg = document.getElementById('lightboxImg');

  // Open Video Trailer Modal
  const trailerTriggers = document.querySelectorAll('[data-trailer-id]');
  trailerTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = trigger.getAttribute('data-trailer-id');
      if (videoId && videoFrame && videoModal) {
        videoFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        openModal(videoModal);
      }
    });
  });

  // Open Image Lightbox Modal
  const imageTriggers = document.querySelectorAll('[data-lightbox-src]');
  imageTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-lightbox-src');
      if (imgSrc && lightboxImg && imageModal) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = trigger.getAttribute('data-lightbox-title') || 'Game Screenshot';
        openModal(imageModal);
      }
    });
  });

  // Close Modals
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close when clicking outside modal container
  const allModals = document.querySelectorAll('.modal-backdrop');
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    allModals.forEach(m => m.classList.remove('active'));
    if (videoFrame) {
      videoFrame.src = ''; // Stop video playback
    }
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value || '';
    const email = document.getElementById('formEmail')?.value || '';
    const subject = document.getElementById('formSubject')?.value || 'Game Development Project Inquiry';
    const message = document.getElementById('formMessage')?.value || '';

    const mailtoLink = `mailto:gamedevhasib@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    window.location.href = mailtoLink;
    showToast('Opening your default email client...');
  });
}

/* ==========================================================================
   COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast('Failed to copy to clipboard.');
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-cyan);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
