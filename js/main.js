/**
 * ACUMEN GLOBAL - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initScrollAnimations();
  initStatsCounters();
  initModalHandler();
  initLiveClocks();
  initNewsletter();
  initFaqAccordion();
  initHeroConstellationCanvas();
  initCardTiltPhysics();
  initMagneticButtons();
});

/* --------------------------------------------------------------------------
   Sticky Navbar on Scroll
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   Mobile Drawer Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   Scroll Animations & Staggered Reveal (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // Auto-tag home page & global sections for smooth staggered reveal
  const revealTargets = document.querySelectorAll(
    '.perspective-grid, .pathway-row, .landmarks-grid, .steps-grid, .resources-grid, .cta-banner-content, .fade-in-up'
  );

  revealTargets.forEach(el => {
    if (!el.classList.contains('fade-in-up')) {
      el.classList.add('fade-in-up');
    }
  });

  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // Interactive Landmark Cards Switcher
  initLandmarkCards();

  // Hero 3D Globe Interactive Parallax
  initHeroParallax();
}

/* --------------------------------------------------------------------------
   Interactive Global Flight & Constellation Particle Canvas (Hero)
   -------------------------------------------------------------------------- */
function initHeroConstellationCanvas() {
  const canvas = document.getElementById('heroConstellationCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDist: 120 };
  let animationFrameId;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 45);
    const colors = ['#D4AF37', '#1746D2', '#3D6CF0', '#00A86B', '#F4C430'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting vectors
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(23, 70, 210, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw mouse proximity vectors
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.maxDist) {
          const alpha = (1 - dist / mouse.maxDist) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulseAngle) * 0.2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  const heroSection = document.querySelector('.hero-exact');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }
}

/* --------------------------------------------------------------------------
   3D Card Tilt Physics with Specular Glare (Landmarks, Steps, Resources)
   -------------------------------------------------------------------------- */
function initCardTiltPhysics() {
  const cards = document.querySelectorAll(
    '.landmark-card, .step-card, .resource-article-card, .pathway-image-box'
  );

  cards.forEach(card => {
    // Add specular glare overlay if not present
    if (!card.querySelector('.card-specular-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-specular-glare';
      card.appendChild(glare);
    }

    const glare = card.querySelector('.card-specular-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
      const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

      // 3D rotation angles
      const rotateX = -yPercent * 7;
      const rotateY = xPercent * 7;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3) 0%, rgba(23, 70, 210, 0.08) 50%, transparent 80%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Magnetic Button Pull Physics
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.btn-hero-solid, .btn-cta-white, .pathway-pill');

  magneticElements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Landmark Cards (USA, UK, Australia, Singapore, UAE)
   -------------------------------------------------------------------------- */
function initLandmarkCards() {
  const landmarkCards = document.querySelectorAll('.landmarks-grid .landmark-card');
  if (!landmarkCards.length) return;

  landmarkCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      landmarkCards.forEach(c => {
        c.classList.remove('active');
        const bar = c.querySelector('.landmark-active-bar');
        if (bar) bar.remove();
      });
      card.classList.add('active');
      const activeBar = document.createElement('div');
      activeBar.className = 'landmark-active-bar';
      card.appendChild(activeBar);
    });
  });
}

/* --------------------------------------------------------------------------
   Hero 3D Globe Interactive Parallax Tracking
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-exact');
  const globeWrapper = document.querySelector('.hero-globe-wrapper');
  const topBadge = document.querySelector('.callout-badge.top-talent');
  const rightBadge = document.querySelector('.callout-badge.right-business');

  if (!heroSection || !globeWrapper) return;

  let ticking = false;

  heroSection.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

        // Multi-depth 3D spatial parallax
        globeWrapper.style.transform = `perspective(1000px) rotateY(${xPercent * 6}deg) rotateX(${-yPercent * 6}deg) translateZ(0)`;
        
        if (topBadge) {
          topBadge.style.transform = `translate3d(${xPercent * -14}px, ${yPercent * -14}px, 20px)`;
        }
        if (rightBadge) {
          rightBadge.style.transform = `translate3d(${xPercent * -18}px, ${yPercent * -18}px, 25px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    globeWrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    globeWrapper.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    if (topBadge) {
      topBadge.style.transform = '';
      topBadge.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (rightBadge) {
      rightBadge.style.transform = '';
      rightBadge.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });

  heroSection.addEventListener('mouseenter', () => {
    globeWrapper.style.transition = 'none';
    if (topBadge) topBadge.style.transition = 'none';
    if (rightBadge) rightBadge.style.transition = 'none';
  });
}

/* --------------------------------------------------------------------------
   Animated Number Counters for Stats
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = prefix + target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --------------------------------------------------------------------------
   Global Consultation Modal Handler
   -------------------------------------------------------------------------- */
function initModalHandler() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, [data-modal-close]');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Global Form Submission simulation
  const inquiryForms = document.querySelectorAll('.inquiry-form, .contact-main-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting Request...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        // Show confirmation modal or alert
        const confirmModal = document.getElementById('modal-confirmation');
        if (confirmModal) {
          // Close active modal if open
          const activeModal = document.querySelector('.modal-overlay.active');
          if (activeModal) activeModal.classList.remove('active');

          confirmModal.classList.add('active');
        } else {
          alert('Thank you! Your inquiry has been received. A senior Acumen Global consultant will contact you within 24 hours.');
        }

        form.reset();
      }, 1200);
    });
  });
}

/* --------------------------------------------------------------------------
   Live Office Time Clocks
   -------------------------------------------------------------------------- */
function initLiveClocks() {
  const clockElements = document.querySelectorAll('[data-timezone]');
  if (!clockElements.length) return;

  function updateClocks() {
    clockElements.forEach(el => {
      const tz = el.getAttribute('data-timezone');
      try {
        const timeString = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        el.textContent = timeString;
      } catch (e) {
        // Fallback
      }
    });
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* --------------------------------------------------------------------------
   Newsletter Handler
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        alert(`Thank you for subscribing! Global migration & business alerts will be sent to ${input.value}.`);
        input.value = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ Accordion Handler
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.visas-faq-item, .contact-faq-item, .business-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.visas-faq-question, .contact-faq-question, .business-faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const parentContainer = item.closest('.visas-faq-accordion, .contact-faq-accordion, .business-faq-accordion');
      
      // Close other items in the same container
      if (parentContainer) {
        parentContainer.querySelectorAll('.visas-faq-item, .contact-faq-item, .business-faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const btn = otherItem.querySelector('.visas-faq-question, .contact-faq-question, .business-faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Handle Contact Enquiry Form
  const contactForm = document.getElementById('contactEnquiryForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-contact-submit');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending enquiry...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          alert('Thank you for reaching out to Acumen Global Ventures. Your inquiry has been received and our senior advisory team will contact you within one business day.');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 800);
      }
    });
  }
}



