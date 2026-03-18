// ===========================
// Publications Rendering
// ===========================

async function loadPublications() {
  try {
    const response = await fetch('data/publications.json');
    const pubs = await response.json();
    renderPublications(pubs, 'all');
    setupFilters(pubs);
  } catch (e) {
    console.error('Failed to load publications:', e);
  }
}

function renderPublications(pubs, filter) {
  const container = document.getElementById('pub-list');
  if (!container) return;

  let filtered = pubs;
  if (filter === 'published') {
    filtered = pubs.filter(p => p.status === 'published');
  } else if (filter === 'review') {
    filtered = pubs.filter(p => p.status === 'under review');
  }

  container.innerHTML = '';

  filtered.forEach(pub => {
    const item = document.createElement('div');
    item.className = 'pub-item' +
      (pub.highlighted ? ' highlighted' : '') +
      (pub.status === 'under review' ? ' under-review' : '');
    item.dataset.id = pub.id;

    // Venue badge
    let venueBadgeClass = 'conf';
    const vl = pub.venue.toLowerCase();
    if (vl.includes('pattern recognition') || vl.includes('expert systems') ||
        vl.includes('computers in biology') || vl.includes('biomedical and health') ||
        vl.includes('advanced engineering')) {
      venueBadgeClass = 'q1';
    }
    if (pub.status === 'under review') venueBadgeClass = 'review';

    const venueLabel = pub.status === 'under review'
      ? `<em class="venue-name">${pub.venue}</em> <span class="venue-badge review">Under Review</span>`
      : `<em class="venue-name">${pub.venue}</em> <span class="venue-badge ${venueBadgeClass}">${pub.venue_short} ${pub.year}</span>`;

    // Links
    const linkItems = [];
    if (pub.links.paper && pub.links.paper !== '#') {
      linkItems.push(`<a href="${pub.links.paper}" class="pub-link" target="_blank">Paper</a>`);
    } else if (pub.links.paper === '#') {
      linkItems.push(`<span class="pub-link" style="color:var(--color-text-light);cursor:default;">Paper</span>`);
    }
    if (pub.links.code) {
      linkItems.push(`<span class="pub-link-sep">/</span><a href="${pub.links.code}" class="pub-link" target="_blank">Code</a>`);
    }
    if (pub.links.project) {
      linkItems.push(`<span class="pub-link-sep">/</span><a href="${pub.links.project}" class="pub-link" target="_blank">Project</a>`);
    }
    linkItems.push(`<span class="pub-link-sep">·</span><button class="toggle-abstract" onclick="toggleAbstract('${pub.id}')">Abstract ▾</button>`);

    // Tags
    const tagsHtml = pub.tags
      ? pub.tags.map(t => `<span class="pub-tag">${t}</span>`).join('')
      : '';

    // Thumbnail
    const thumbHtml = pub.image
      ? `<img src="${pub.image}" alt="${pub.title}" onerror="this.parentElement.innerHTML='<div class=\\'pub-thumb-placeholder\\'>Image<br>Coming Soon</div>'">`
      : `<div class="pub-thumb-placeholder">Image<br>Coming Soon</div>`;

    item.innerHTML = `
      <div class="pub-thumb">${thumbHtml}</div>
      <div class="pub-content">
        <div class="pub-title">${pub.title}</div>
        <div class="pub-authors">${pub.authors}</div>
        <div class="pub-venue">${venueLabel}</div>
        <div class="pub-tags">${tagsHtml}</div>
        <div class="pub-abstract" id="abstract-${pub.id}">${pub.abstract}</div>
        <div class="pub-links">${linkItems.join('')}</div>
      </div>
    `;

    container.appendChild(item);
  });
}

function toggleAbstract(id) {
  const el = document.getElementById('abstract-' + id);
  if (!el) return;
  el.classList.toggle('expanded');
  const btn = el.parentElement.querySelector('.toggle-abstract');
  if (btn) {
    btn.textContent = el.classList.contains('expanded') ? 'Abstract ▴' : 'Abstract ▾';
  }
}

function setupFilters(pubs) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPublications(pubs, btn.dataset.filter);
    });
  });
}

// ===========================
// Mobile Navigation
// ===========================
function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ===========================
// Active Nav Highlight
// ===========================
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--color-accent)'
            : '';
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ===========================
// News Scroll Window
// ===========================
function setupNewsScroller() {
  const win = document.querySelector('.news-window');
  if (!win) return;

  const items = Array.from(win.querySelectorAll('.news-list li'));
  if (!items.length) return;

  function updateFocus() {
    const winCenter = win.scrollTop + win.clientHeight / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    items.forEach((item, i) => {
      const itemCenter = item.offsetTop + item.offsetHeight / 2;
      const dist = Math.abs(itemCenter - winCenter);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });

    items.forEach((item, i) => {
      item.classList.remove('news-active', 'news-near');
      const dist = Math.abs(i - closestIdx);
      if (dist === 0) item.classList.add('news-active');
      else if (dist === 1) item.classList.add('news-near');
    });
  }

  updateFocus();
  win.addEventListener('scroll', updateFocus, { passive: true });

  let direction = 1;
  let isPaused = false;

  function autoStep() {
    if (isPaused) return;
    const maxScroll = win.scrollHeight - win.clientHeight;
    const current = win.scrollTop;
    if (direction === 1 && current >= maxScroll - 1) direction = -1;
    else if (direction === -1 && current <= 1) direction = 1;
    const itemH = items[0] ? items[0].offsetHeight : 52;
    win.scrollBy({ top: direction * itemH, behavior: 'smooth' });
  }

  setInterval(autoStep, 2800);

  win.addEventListener('mouseenter', () => { isPaused = true; });
  win.addEventListener('mouseleave', () => { isPaused = false; });
  win.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
  win.addEventListener('touchend', () => { setTimeout(() => { isPaused = false; }, 1500); }, { passive: true });
}

// ===========================
// Init
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  loadPublications();
  setupNav();
  setupScrollSpy();
  setupNewsScroller();

  // Update footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
