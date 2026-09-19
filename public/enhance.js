// Tasteful enhancement layer: reveal-on-scroll, sticky header shadow, one stat count-up.
// Everything degrades gracefully and respects reduced-motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky header shadow
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal on scroll
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  // Count-up for [data-count]
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var run = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var start = null, dur = 900;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = String(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduce) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io2.observe(el); });
  } else {
    counters.forEach(run);
  }
})();
