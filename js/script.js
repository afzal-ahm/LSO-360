/* ══════════════════════════════════════
   LSO 360 – script.js
   ══════════════════════════════════════ */

/* ── Navbar scroll effect ── */
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── Mobile nav toggle ── */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}

/* ── Load Navbar ── */
function loadNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;
  fetch('/navbar.html')
    .then(r => r.text())
    .then(html => {
      placeholder.innerHTML = html;
      /* Highlight active link */
      const page = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
      /* Re-attach mobile toggle */
      const btn = document.querySelector('.nav-toggle');
      if (btn) btn.addEventListener('click', toggleMobileNav);
    })
    .catch(err => console.warn('Navbar load failed:', err));
}

/* ── Load Footer ── */
function loadFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  fetch('/footer.html')
    .then(r => r.text())
    .then(html => { placeholder.innerHTML = html; })
    .catch(err => console.warn('Footer load failed:', err));
}

/* ══════════════════════════════════════
   BEFORE / AFTER SLIDER
   Works by listening on the whole wrap
   so the user can click/drag anywhere
   ══════════════════════════════════════ */
function initSlider() {
  const wrap     = document.getElementById('bafWrap');
  const before   = document.getElementById('bafBefore');
  const divider  = document.getElementById('bafDivider');
  if (!wrap || !before || !divider) return;

  let active = false;

  /* Calculate % position from a clientX value */
  function getPct(clientX) {
    const r = wrap.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    return Math.max(3, Math.min(97, pct));
  }

  /* Move divider and clip the "before" panel */
  function move(pct) {
    divider.style.left = pct + '%';
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }

  /* Start at 50% */
  move(50);

  /* ── Mouse ── */
  wrap.addEventListener('mousedown', e => {
    active = true;
    move(getPct(e.clientX));
    e.preventDefault();         /* prevents text selection while dragging */
  });

  window.addEventListener('mousemove', e => {
    if (!active) return;
    move(getPct(e.clientX));
  });

  window.addEventListener('mouseup', () => { active = false; });

  /* ── Touch ── */
  wrap.addEventListener('touchstart', e => {
    active = true;
    move(getPct(e.touches[0].clientX));
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (!active) return;
    move(getPct(e.touches[0].clientX));
  }, { passive: true });

  window.addEventListener('touchend', () => { active = false; });
}

/* ── Run on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  initSlider();       /* safe – just returns early if elements not present */
});
