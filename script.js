(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Theme toggle ── */
  $('#theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var isDark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  /* ── Mobile menu ── */
  var menuBtn = $('#menu-btn'), links = $('#nav-links');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  /* ── Scroll: nav border, top button, active link ── */
  var nav = $('#nav'), topBtn = $('#top-btn');
  var sections = $$('main section[id]').filter(function (s) { return $('#nav-links a[href="#' + s.id + '"]'); });
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 8);
    topBtn.classList.toggle('visible', y > 500);
    var current = null;
    sections.forEach(function (s) { if (y + 120 >= s.offsetTop) current = s.id; });
    $$('#nav-links a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ── Reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Project filters ── */
  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      $$('.project').forEach(function (p) { p.hidden = !(f === 'all' || p.dataset.cat.split(' ').indexOf(f) > -1); });
    });
  });

  /* ── Support Ticket Tracker: in-browser preview ──
     Mirrors the real app's behaviour (search, status filter, validation, create, delete)
     using local sample data. The real app talks to a Spring Boot + MySQL API. */
  var LABELS = { OPEN: 'Open', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved', CLOSED: 'Closed', LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
  var tickets = [
    { id: 7, title: 'Cannot connect to VPN from home', status: 'OPEN', priority: 'HIGH' },
    { id: 6, title: 'Printer on 2nd floor offline', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: 5, title: 'Request: install Python on lab PCs', status: 'RESOLVED', priority: 'LOW' },
    { id: 4, title: 'Email signature not updating', status: 'CLOSED', priority: 'LOW' },
    { id: 3, title: 'Wi-Fi drops in meeting room B', status: 'IN_PROGRESS', priority: 'HIGH' }
  ];
  var nextId = 8, confirming = null;
  var rows = $('#d-rows'), count = $('#d-count'), search = $('#d-search'), statusSel = $('#d-status');
  var form = $('#d-form'), toast = $('#d-toast'), toastTimer;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function badge(kind, v) { return '<span class="d-badge ' + kind + '-' + v + '">' + LABELS[v] + '</span>'; }
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function render() {
    var q = search.value.trim().toLowerCase(), st = statusSel.value;
    var list = tickets.filter(function (t) {
      return (!st || t.status === st) && (!q || t.title.toLowerCase().indexOf(q) > -1 || String(t.id) === q.replace('#', ''));
    });
    count.textContent = 'Showing ' + list.length + ' of ' + tickets.length + (tickets.length === 1 ? ' ticket' : ' tickets');
    if (!list.length) { rows.innerHTML = '<tr><td colspan="5" class="d-empty">No tickets match the current filters.</td></tr>'; return; }
    rows.innerHTML = list.map(function (t) {
      var actions = confirming === t.id
        ? 'Delete this ticket? <button class="d-btn d-danger d-sm" data-act="del" data-id="' + t.id + '">Delete</button> <button class="d-btn d-sm" data-act="cancel">Cancel</button>'
        : '<button class="d-btn d-sm" data-act="ask" data-id="' + t.id + '">Delete</button>';
      return '<tr><td>' + t.id + '</td><td>' + esc(t.title) + '</td><td>' + badge('s', t.status) + '</td><td>' + badge('p', t.priority) + '</td><td class="act">' + actions + '</td></tr>';
    }).join('');
  }

  search.addEventListener('input', render);
  statusSel.addEventListener('change', render);
  rows.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var id = +b.dataset.id;
    if (b.dataset.act === 'ask') confirming = id;
    else if (b.dataset.act === 'cancel') confirming = null;
    else if (b.dataset.act === 'del') {
      tickets = tickets.filter(function (t) { return t.id !== id; }); confirming = null; say('Ticket #' + id + ' deleted');
    }
    render();
  });

  $('#d-new').addEventListener('click', function () { form.hidden = false; $('#d-title').focus(); });
  $('#d-cancel').addEventListener('click', function () { form.hidden = true; form.reset(); $('#d-title-err').textContent = $('#d-desc-err').textContent = ''; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = $('#d-title').value.trim(), desc = $('#d-desc').value.trim();
    $('#d-title-err').textContent = title ? '' : 'Title is required';
    $('#d-desc-err').textContent = desc ? '' : 'Description is required';
    if (!title || !desc) return;
    tickets.unshift({ id: nextId, title: title, status: 'OPEN', priority: $('#d-priority').value });
    say('Ticket #' + nextId + ' created'); nextId++;
    form.reset(); form.hidden = true; render();
  });
  render();


  /* ── GA5 TE Manager: path-comparison model (same maths as ga5app/te.py) ── */
  (function () {
    var CAP = 10, THR = 70, BG = { L12: 0.5, L23: 0.5, L13: 2.0 };
    var slider = $('#te-demand'); if (!slider) return;
    function util(links, d) { return Math.max.apply(null, links.map(function (l) { return (BG[l] + d) / CAP * 100; })); }
    function setPath(id, u) {
      var el = $('#' + id); el.className = 'te-path' + (u > THR ? ' bad' : u > THR * 0.85 ? ' warn' : '');
      el.querySelector('b').textContent = u.toFixed(1) + ' %';
      el.querySelector('i').style.width = Math.min(u, 100) + '%';
      return el;
    }
    function update() {
      var d = +slider.value; $('#te-val').textContent = d.toFixed(3);
      var ud = util(['L13'], d), ut = util(['L12', 'L23'], d);
      var a = setPath('te-direct', ud), b = setPath('te-transit', ut), msg;
      if (ud <= THR) { a.classList.add('chosen'); msg = 'Keep the shortest path (R1–R3): ' + ud.toFixed(1) + ' % is within the ' + THR + ' % threshold.'; }
      else if (ut <= THR) { b.classList.add('chosen'); msg = 'Direct link congested (' + ud.toFixed(1) + ' %). Re-route via R2: max utilisation ' + ud.toFixed(1) + ' % → ' + ut.toFixed(1) + ' %.'; }
      else {
        var best = null;
        for (var x = 0; x <= 100; x++) {
          var f = x / 100, m = Math.max((BG.L13 + d * f) / CAP * 100, (BG.L12 + d * (1 - f)) / CAP * 100, (BG.L23 + d * (1 - f)) / CAP * 100);
          if (!best || m < best.m) best = { x: x, m: m };
        }
        msg = 'No single path fits. Split traffic ' + best.x + '/' + (100 - best.x) + ' (direct/transit): max utilisation ' + best.m.toFixed(1) + ' %' + (best.m > THR ? ' — still above threshold.' : '.');
      }
      $('#te-decision').textContent = msg;
    }
    slider.addEventListener('input', update);
    $$('.te-presets button').forEach(function (btn) { btn.addEventListener('click', function () { slider.value = btn.dataset.d; update(); }); });
    update();
  })();

  /* ── Count-up for stats ── */
  $$('[data-count]').forEach(function (el) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; o.disconnect();
      var start = null;
      (function step(ts) {
        start = start || ts;
        var p = Math.min((ts - start) / 900, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }, { threshold: 0.6 });
    o.observe(el);
  });

  /* ── Contact form ──
     Posts to the Node/Express backend in /backend (Nodemailer → Gmail).
     Set API_URL to your deployed backend, e.g. 'https://your-api.onrender.com/api/contact'.
     If the request fails (or API_URL is empty) it falls back to opening the visitor's email app. */
  var API_URL = '';
  var cform = $('#contact-form'), status = $('#form-status');
  function setStatus(msg, ok) { status.textContent = msg; status.style.color = ok ? 'var(--ok)' : '#d6453b'; }
  cform.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = { name: $('#f-name').value.trim(), email: $('#f-email').value.trim(), subject: $('#f-subject').value.trim(), message: $('#f-message').value.trim() };
    if (!data.name || !data.email || !data.message) return setStatus('Please fill in your name, email and message.', false);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return setStatus('Please enter a valid email address.', false);

    function fallback() {
      var body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
      window.location.href = 'mailto:martinmamadise80@gmail.com?subject=' + encodeURIComponent(data.subject || 'Portfolio message from ' + data.name) + '&body=' + body;
      setStatus('Opening your email app…', true);
    }
    if (!API_URL) return fallback();

    setStatus('Sending…', true);
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(); setStatus("Thanks — I'll be in touch soon.", true); cform.reset(); })
      .catch(fallback);
  });
})();
