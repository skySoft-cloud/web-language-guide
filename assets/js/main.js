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

window.addEventListener('scroll', () => {
  updateActiveNav();
  updateBackTop();
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  updateBackTop();
});