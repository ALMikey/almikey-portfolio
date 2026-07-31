document.documentElement.classList.add('has-js');

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = (restoreFocus = false) => {
  siteNav?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', '打开导航菜单');
  if (restoreFocus) menuToggle?.focus();
};

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

document.addEventListener('pointerdown', (event) => {
  if (!siteNav?.classList.contains('is-open')) return;
  if (siteNav?.contains(event.target) || menuToggle?.contains(event.target)) return;
  closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav?.classList.contains('is-open')) closeMenu(true);
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);

const revealTargets = document.querySelectorAll(
  '.intro-layout > *, .section-heading, .skill-row, .mechanics-intro, .mechanics-group, .project-card, .contact-layout > *'
);
const moduleTargets = document.querySelectorAll('main > section');
const hero = document.querySelector('.hero');
const moduleSwitcherLinks = document.querySelectorAll('.module-switcher a');
const switcherSections = document.querySelectorAll('main > section[id]');
const switcherVisibility = new Map();
const hudIndex = document.querySelector('[data-hud-index]');
const hudLabel = document.querySelector('[data-hud-label]');
const projectToggles = document.querySelectorAll('[data-project-toggle]');
const copyButtons = document.querySelectorAll('[data-copy]');
const copyStatus = document.querySelector('[data-copy-status]');
const deferredBackgroundSections = document.querySelectorAll('[data-background-src]');

const setCurrentModule = (id) => {
  moduleSwitcherLinks.forEach((link) => {
    link.classList.toggle('is-current', link.hash === `#${id}`);
  });

  const section = document.getElementById(id);
  if (section) {
    hudIndex.textContent = section.dataset.chapter;
    hudLabel.textContent = section.dataset.label;
  }
};

projectToggles.forEach((toggle) => {
  const record = document.getElementById(toggle.getAttribute('aria-controls'));
  const projectCard = toggle.closest('.project-card');
  if (!record) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'false';
    toggle.setAttribute('aria-expanded', String(isExpanded));
    toggle.textContent = isExpanded ? '收起档案' : '查看档案';
    record.hidden = !isExpanded;
    projectCard?.classList.toggle('is-selected', isExpanded);
  });
});

const copyContact = async (value) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the legacy copy method for contexts without clipboard permission.
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
};

copyButtons.forEach((copyButton) => {
  const valueLabel = copyButton.querySelector('b');
  const originalValue = valueLabel?.textContent;
  let resetTimer;

  copyButton.addEventListener('click', async () => {
    const copied = await copyContact(copyButton.dataset.copy);
    copyStatus.textContent = copied ? '联系方式已复制到剪贴板。' : '复制失败，请手动选择并复制。';
    if (!copied) return;

    copyButton.classList.add('is-copied');
    copyButton.setAttribute('aria-label', `已复制：${copyButton.dataset.copy}`);
    if (valueLabel) valueLabel.textContent = '已复制';

    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      copyButton.classList.remove('is-copied');
      copyButton.setAttribute('aria-label', `复制 ${copyButton.querySelector('span')?.textContent}：${copyButton.dataset.copy}`);
      if (valueLabel && originalValue) valueLabel.textContent = originalValue;
    }, 1500);
  });
});

const loadSectionBackground = (section) => {
  const source = section.dataset.backgroundSrc;
  if (!source || section.dataset.backgroundLoaded === 'true') return;

  section.style.setProperty('--section-image', `url("${source}")`);
  section.dataset.backgroundLoaded = 'true';
};

if ('IntersectionObserver' in window) {
  const backgroundObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadSectionBackground(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '250px 0px' });
  deferredBackgroundSections.forEach((section) => backgroundObserver.observe(section));
} else {
  deferredBackgroundSections.forEach(loadSectionBackground);
}

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

if ('IntersectionObserver' in window) {
  const switcherObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => switcherVisibility.set(entry.target.id, entry));
    const current = [...switcherVisibility.values()]
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
    if (current) setCurrentModule(current.target.id);
  }, { rootMargin: '-30% 0px -30% 0px', threshold: [0, .25, .5, .75] });
  switcherSections.forEach((section) => switcherObserver.observe(section));
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
