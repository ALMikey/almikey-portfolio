const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);

const revealTargets = document.querySelectorAll(
  '.intro-layout > *, .section-heading, .skill-row, .mechanics-intro, .mechanics-group, .project-card, .contact-layout > *'
);
const moduleTargets = document.querySelectorAll('main > section');
const hero = document.querySelector('.hero');

revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
});

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

if (!reduceMotion && hero && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      hero.classList.toggle('hero-active', entry.isIntersecting);
    });
  }, { threshold: 0.45 });
  heroObserver.observe(hero);
} else {
  hero?.classList.add('hero-active');
}

if (!reduceMotion && 'IntersectionObserver' in window) {
  const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('module-active', entry.isIntersecting);
    });
  }, { rootMargin: '-18% 0px -18% 0px' });
  moduleTargets.forEach((section) => moduleObserver.observe(section));
} else {
  moduleTargets.forEach((section) => section.classList.add('module-active'));
}

const updateParallax = () => {
  document.querySelectorAll('.visual-section').forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * 0.055;
    section.style.setProperty('--background-y', `${offset}px`);
  });
};

let parallaxFrame = 0;
const scheduleParallax = () => {
  if (parallaxFrame) return;
  parallaxFrame = window.requestAnimationFrame(() => {
    updateParallax();
    parallaxFrame = 0;
  });
};

if (!reduceMotion) {
  window.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
  updateParallax();
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

window.addEventListener('load', () => {
  window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });
});
