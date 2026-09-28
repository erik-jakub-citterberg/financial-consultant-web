// Design switcher for the preview site (never part of the real website).
// Shows a small bar on every page: jump to the same page in another design.
(function () {
  var DESIGNS = [
    { id: 'povodny', name: 'Pôvodný' },
    { id: 'rozhovor', name: 'Rozhovor' },
    { id: 'identita', name: 'Identita' },
  ];
  var CSS =
    ':host{all:initial}' +
    '.bar{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;' +
    'display:flex;align-items:center;gap:4px;padding:5px;background:#101826;border-radius:999px;' +
    'box-shadow:0 6px 24px rgba(0,0,0,.28);font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;white-space:nowrap;max-width:calc(100vw - 24px)}' +
    'a{color:#dfe6ef;text-decoration:none;padding:9px 13px;border-radius:999px}' +
    'a:hover{background:#26344a;color:#fff}' +
    'a[aria-current]{background:#fff;color:#101826}' +
    '.all{color:#9aa8ba;font-weight:500;padding:9px 11px}' +
    '@media (max-width:400px){a{padding:9px 10px;font-size:13px}.all{display:none}}' +
    '@media print{.bar{display:none}}';

  function current() {
    var parts = location.pathname.split('/').filter(Boolean);
    var id = parts[0];
    return { id: id, rest: '/' + parts.slice(1).join('/') };
  }

  function mount() {
    if (document.getElementById('design-switcher')) return;
    var here = current();
    var host = document.createElement('div');
    host.id = 'design-switcher';
    var root = host.attachShadow({ mode: 'open' });
    var style = document.createElement('style');
    style.textContent = CSS;
    var bar = document.createElement('nav');
    bar.className = 'bar';
    bar.setAttribute('aria-label', 'Prepínač návrhov');
    DESIGNS.forEach(function (d) {
      var a = document.createElement('a');
      a.textContent = d.name;
      a.href = '/' + d.id + (here.rest === '/' ? '/' : here.rest);
      if (d.id === here.id) a.setAttribute('aria-current', 'page');
      // A page that does not exist in the other design (e.g. /kariera in the original) opens its home page instead
      a.addEventListener('click', function (e) {
        if (d.id === here.id) return;
        e.preventDefault();
        var target = a.href;
        fetch(target, { method: 'HEAD' })
          .then(function (r) { location.href = r.ok ? target : '/' + d.id + '/'; })
          .catch(function () { location.href = target; });
      });
      bar.appendChild(a);
    });
    var all = document.createElement('a');
    all.className = 'all';
    all.href = '/';
    all.textContent = 'Všetky návrhy';
    bar.appendChild(all);
    root.appendChild(style);
    root.appendChild(bar);
    document.body.appendChild(host);
    // keep the last lines of each page readable above the bar
    document.body.style.paddingBottom = '72px';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  // Astro view transitions swap the <body>; mount again after each navigation
  document.addEventListener('astro:page-load', mount);
  document.addEventListener('astro:after-swap', mount);
})();
