// Enhancement layer: reveal-on-scroll, staggered reveals, count-up,
// sticky header, smooth FAQ, magnetic buttons.
// Degrades gracefully; respects prefers-reduced-motion.
(function () {
  // Gate CSS reveal animations — without this class, all elements stay visible
  document.documentElement.classList.add('js-ready');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Sticky header shadow ──────────────────────────
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Reveal + stagger on scroll ────────────────────
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal], [data-stagger]'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  // ── Count-up for [data-count] ─────────────────────
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var runCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var start = null, dur = 1100;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduce) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io2.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  // ── Smooth FAQ open/close ─────────────────────────
  // Animates max-height since details/summary has no native animation.
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  faqs.forEach(function (det) {
    var summary = det.querySelector('summary');
    var body = det.querySelector('.faq-body');
    if (!summary || !body || reduce) return;
    body.style.overflow = 'hidden';
    body.style.maxHeight = '0';
    body.style.transition = 'max-height 0.32s cubic-bezier(0.16,1,0.3,1)';

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = det.hasAttribute('open');
      if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(function () {
          body.style.maxHeight = '0';
        });
        setTimeout(function () { det.removeAttribute('open'); }, 320);
      } else {
        det.setAttribute('open', '');
        body.style.maxHeight = body.scrollHeight + 'px';
        setTimeout(function () { body.style.maxHeight = 'none'; }, 320);
      }
    });
  });

  // ── Card tilt: a small 3D lean towards the pointer (mouse only) ──
  // Delegated on document, so it keeps working after view-transition page swaps.
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduce) {
    var MAX_Y = 5, MAX_X = 4; // degrees
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (px * 2 * MAX_Y).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-py * 2 * MAX_X).toFixed(2) + 'deg');
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      if (card && !card.contains(e.relatedTarget)) {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      }
    });
  }

  // ── Mobile hamburger nav ──────────────────────────
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('main-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Otvoriť menu' : 'Zavrieť menu');
      mobileNav.classList.toggle('is-open', !expanded);
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Otvoriť menu');
        mobileNav.classList.remove('is-open');
      }
    });
  }

})();
