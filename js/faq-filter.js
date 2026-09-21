/**
 * ACUMEN GLOBAL - FAQ Accordion, Category Filter & Live Search
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqSystem();
  initResourceFilter();
});

function initFaqSystem() {
  const faqContainer = document.querySelector('.faq-section');
  if (!faqContainer) return;

  const faqItems = faqContainer.querySelectorAll('.faq-item');
  const tabBtns = faqContainer.querySelectorAll('.faq-tab-btn');
  const searchInput = faqContainer.querySelector('#faq-search-input');

  // Accordion toggle
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other accordions
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Category filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      filterFaqs(category, searchInput ? searchInput.value.toLowerCase() : '');
    });
  });

  // Live search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const activeTab = faqContainer.querySelector('.faq-tab-btn.active');
      const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
      filterFaqs(category, query);
    });
  }

  function filterFaqs(category, query) {
    let matchCount = 0;
    faqItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      const question = item.querySelector('.faq-header h4').textContent.toLowerCase();
      const answer = item.querySelector('.faq-body p').textContent.toLowerCase();

      const matchesCat = (category === 'all' || itemCat === category);
      const matchesQuery = (query === '' || question.includes(query) || answer.includes(query));

      if (matchesCat && matchesQuery) {
        item.style.display = 'block';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const noResultsMsg = document.getElementById('faq-no-results');
    if (noResultsMsg) {
      noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
    }
  }
}

/* --------------------------------------------------------------------------
   Resource / Blog Category Filter & Search
   -------------------------------------------------------------------------- */
function initResourceFilter() {
  const resourceGrid = document.getElementById('resources-posts-grid');
  if (!resourceGrid) return;

  const resourceCards = resourceGrid.querySelectorAll('.post-card');
  const catButtons = document.querySelectorAll('.resource-tab-btn');
  const searchInput = document.getElementById('resource-search-input');

  function filterResources(category, query) {
    resourceCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const title = card.querySelector('h4').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();

      const matchesCat = (category === 'all' || cardCat === category);
      const matchesQuery = (query === '' || title.includes(query) || desc.includes(query));

      if (matchesCat && matchesQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      filterResources(cat, searchInput ? searchInput.value.toLowerCase() : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const activeBtn = document.querySelector('.resource-tab-btn.active');
      const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
      filterResources(cat, query);
    });
  }
}
