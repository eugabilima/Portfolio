const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  menuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) closeMenu();
  else openMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, dots = [];

function resizeCanvas() {
  const hero = document.getElementById('hero');
  W = canvas.width  = hero.offsetWidth;
  H = canvas.height = hero.offsetHeight;
}

function createDots() {
  dots = [];
  const count = Math.min(60, Math.floor((W * H) / 14000));
  for (let i = 0; i < count; i++) {
    dots.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + .4,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      a:  Math.random() * .45 + .1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0) d.x = W;
    if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H;
    if (d.y > H) d.y = 0;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168, 85, 247, ${d.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  resizeCanvas();
  createDots();
  drawParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createDots();
    }, 150);
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));