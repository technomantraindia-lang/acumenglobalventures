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
   Scroll Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
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
  const faqItems = document.querySelectorAll('.visas-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.visas-faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}


