/* ── Constants ───────────────────────────────────────────────── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* Higher values increase the parallax scroll effect intensity */
const PARALLAX_SPEED = 0.18;
/* Placeholder delay simulating a backend submission; replace with real fetch() call */
const SIMULATED_SUBMISSION_DELAY_MS = 1200;

/* global state */
const header = document.getElementById('site-header');
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const hero = document.querySelector('.hero');
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const yearEl = document.getElementById('year');

/* ── Year ──────────────────────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Sticky header ──────────────────────────────────────────── */
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Hero image load ─────────────────────────────────────────── */
if (hero) {
  const heroImg = hero.querySelector('.hero__img');
  function heroLoaded() { hero.classList.add('loaded'); }
  if (heroImg.complete) {
    heroLoaded();
  } else {
    heroImg.addEventListener('load', heroLoaded);
  }
}

/* ── Mobile nav ──────────────────────────────────────────────── */
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* close on link click */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Reveal on scroll ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ───────────────────────────────── */
const sections = document.querySelectorAll('main [id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle(
            'is-active',
            a.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── Contact form ────────────────────────────────────────────── */
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      formSuccess.style.color = 'var(--salmon)';
      formSuccess.textContent = 'Please fill in all required fields.';
      return;
    }

    /* Basic email format check */
    if (!EMAIL_REGEX.test(email)) {
      formSuccess.style.color = 'var(--salmon)';
      formSuccess.textContent = 'Please enter a valid email address.';
      return;
    }

    /* Simulate successful submission; replace setTimeout with real fetch() call */
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
      formSuccess.style.color = 'var(--sage)';
      formSuccess.textContent = 'Thank you! Michael will be in touch shortly.';
    }, SIMULATED_SUBMISSION_DELAY_MS);
  });
}

/* ── Parallax hero image (subtle) ───────────────────────────── */
const heroImg = document.querySelector('.hero__img');
if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${y * PARALLAX_SPEED}px)`;
    }
  }, { passive: true });
}
