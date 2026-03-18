'use strict';

/* ── DOM References ── */
const inputEl    = document.getElementById('main-input');
const runBtn     = document.getElementById('run-btn');
const verdictEl  = document.getElementById('verdict');
const badgeEl    = document.getElementById('result-badge');
const subEl      = document.getElementById('result-sub');
const inputRow   = document.getElementById('input-row');
const mainCard   = document.getElementById('main-card');
const siteHeader = document.getElementById('site-header');
const siteFooter = document.getElementById('site-footer');
const logoBrand  = document.getElementById('logo-brand');
const aboutModal = document.getElementById('about-modal');

/* ── Page Load Animations ── */
function initPageAnimations() {
  [
    { el: siteHeader, delay: 80  },
    { el: mainCard,   delay: 210 },
    { el: siteFooter, delay: 350 },
  ].forEach(({ el, delay }) => {
    setTimeout(() => {
      el.style.animation = 'fadeUp .55s cubic-bezier(.22,1,.36,1) forwards';
    }, delay);
  });

  setTimeout(() => {
    document.querySelectorAll('.chip').forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(8px)';
      setTimeout(() => {
        chip.style.transition = 'opacity .3s ease, transform .3s ease';
        chip.style.opacity = '1';
        chip.style.transform = 'translateY(0)';
      }, 420 + i * 50);
    });
  }, 300);
}

/* ── Core Logic ── */
function isScientificNotation(str) {
  const s = str.trim().replace(/\s/g, '');
  if (/^-?[1-9](\.\d+)?[xX]10\^[+-]?\d+$/.test(s)) return true;
  return /^-?[1-9](\.\d+)?[eE][+-]?\d+$/.test(s);
}

function formatDecimal(str) {
  const s = str.trim().replace(/\s/g, '').replace(/[xX]10\^/, 'e');
  const num = parseFloat(s);
  return isNaN(num) ? null : num.toLocaleString('id-ID');
}

function getSuggestion(str) {
  const num = parseFloat(str.trim());
  return isNaN(num) ? 'Input tidak dikenali' : 'Saran: ' + num.toExponential().replace('e+', 'e');
}

/* ── Animation Helper ── */
function triggerAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

/* ── Result Renderer ── */
function renderResult(raw) {
  if (!raw) {
    verdictEl.textContent = '?';
    verdictEl.className   = 'verdict';
    badgeEl.textContent   = 'Menunggu input...';
    badgeEl.className     = 'result-badge';
    subEl.textContent     = '';
    return;
  }
  const ok = isScientificNotation(raw);
  verdictEl.textContent = ok ? 'YES' : 'NO';
  verdictEl.className   = 'verdict ' + (ok ? 'is-yes' : 'is-no');
  triggerAnim(verdictEl, 'anim-pop');
  badgeEl.textContent = ok ? '✓  Scientific Notation' : '✗  Bukan Notasi Ilmiah';
  badgeEl.className   = 'result-badge ' + (ok ? 'is-yes' : 'is-no');
  if (ok) {
    const dec = formatDecimal(raw);
    subEl.textContent = dec ? '= ' + dec : '';
  } else {
    subEl.textContent = getSuggestion(raw);
    triggerAnim(inputRow, 'anim-shake');
  }
  triggerAnim(runBtn, 'anim-pulse');

  // Tampilkan modal setelah hasil keluar
  setTimeout(() => {
    openAbout();
  }, 500);
}

/* ── Public Functions ── */
function runScanner() {
  renderResult(inputEl.value.trim());
}

function tryExample(value) {
  inputEl.value = value;
  inputEl.style.transition = 'background .15s';
  inputEl.style.background = 'rgba(200,146,42,.09)';
  setTimeout(() => { inputEl.style.background = 'transparent'; }, 280);
  runScanner();
  inputEl.focus();
}

/* ── Modal Functions ── */
function openAbout() {
  aboutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAbout() {
  aboutModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

/* ── Keyboard Support ── */
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runScanner();
  } else if (e.key.length === 1 || e.key === 'Backspace') {
    verdictEl.className   = 'verdict';
    verdictEl.textContent = '?';
    badgeEl.textContent   = 'Menunggu input...';
    badgeEl.className     = 'result-badge';
    subEl.textContent     = '';
  }
});

// Logo brand click
logoBrand.addEventListener('click', openAbout);

// Modal overlay click
aboutModal.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    closeAbout();
  }
});

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aboutModal.classList.contains('show')) {
    closeAbout();
  }
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', initPageAnimations);