function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('open');
}

function updateActiveNav() {
  const sections = document.querySelectorAll('[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  let current = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= 120) {
      current = s.id;
    }
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

function updateBackTop() {
  const btn = document.getElementById('backTop');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
}

// 滚动揭示动画（rAF 节流）
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveNav();
      updateBackTop();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// IntersectionObserver 滚动揭示
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  updateBackTop();
  initReveal();
});