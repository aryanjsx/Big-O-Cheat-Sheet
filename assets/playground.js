/* Big O playground: growth chart, operation counts, and time estimates. */
(function () {
  'use strict';
  var BigO = window.BigO, el = BigO.el, svgEl = BigO.svg;
  var mount = document.getElementById('playground-mount'); if (!mount) return;

  var W = 640, H = 360, L = 56, R = 16, T = 16, B = 44;
  var LOG2_10 = Math.log10(2);
  var OPS_PER_SEC = 1e8;
  var N_CAP = 1000000;

  // lg returns log10 of the operation count, so huge values never overflow.
  function lg(x) { return x > 0 ? Math.log10(x) : -Infinity; }
  var CURVES = [
    { key: 'c1',   label: 'O(1)',       name: 'Constant',    color: 'var(--c-green)',  cls: 'green',        f: function () { return 1; },                      l: function () { return 0; } },
    { key: 'log',  label: 'O(log n)',   name: 'Logarithmic', color: 'var(--c-yg)',     cls: 'yellow-green', f: function (n) { return Math.log2(n); },          l: function (n) { return lg(Math.log2(n)); } },
    { key: 'lin',  label: 'O(n)',       name: 'Linear',      color: 'var(--c-yellow)', cls: 'yellow',       f: function (n) { return n; },                     l: function (n) { return lg(n); } },
    { key: 'nlog', label: 'O(n log n)', name: 'Linearithmic',color: 'var(--c-orange)', cls: 'orange',       f: function (n) { return n * Math.log2(n); },      l: function (n) { return lg(n * Math.log2(n)); } },
    { key: 'quad', label: 'O(n²)',      name: 'Quadratic',   color: 'var(--c-red)',    cls: 'red',          f: function (n) { return n * n; },                 l: function (n) { return 2 * lg(n); } },
    { key: 'exp',  label: 'O(2ⁿ)',      name: 'Exponential', color: 'var(--c-dred)',   cls: 'dark-red',     f: function (n) { return Math.pow(2, n); },        l: function (n) { return n * LOG2_10; } }
  ];
  var visible = {}; CURVES.forEach(function (c) { visible[c.key] = true; });

  var state = { n: 20, xMax: 30, log: false };

  // ---------- Formatting ----------
  function sup(e) { return '<sup>' + e + '</sup>'; }
  function fmtLog(l) {                       // l = log10(count)
    if (l === -Infinity) return '0';
    var v = Math.pow(10, l);
    if (l < 3) return (Math.round(v * 10) / 10).toLocaleString('en-US');
    if (l < 9) return Math.round(v).toLocaleString('en-US');
    var e = Math.floor(l);
    return Math.pow(10, l - e).toFixed(2) + ' × 10' + sup(e);
  }
  function fmtDuration(lOps) {
    if (lOps === -Infinity) return 'instant';
    var ls = lOps - Math.log10(OPS_PER_SEC);       // log10(seconds)
    var s = Math.pow(10, ls);
    if (ls < -6) return Math.max(1, Math.round(s * 1e9)) + ' ns';
    if (ls < -3) return (s * 1e6 < 10 ? (s * 1e6).toFixed(1) : Math.round(s * 1e6)) + ' µs';
    if (ls < 0) return (s * 1e3 < 10 ? (s * 1e3).toFixed(1) : Math.round(s * 1e3)) + ' ms';
    if (ls < Math.log10(60)) return (s < 10 ? s.toFixed(1) : Math.round(s)) + ' s';
    if (ls < Math.log10(3600)) return Math.round(s / 60) + ' min';
    if (ls < Math.log10(86400)) return (s / 3600).toFixed(1) + ' hours';
    var lyears = ls - Math.log10(31557600);
    if (lyears < Math.log10(1)) return Math.round(s / 86400) + ' days';
    if (lyears > Math.log10(1.38e10)) return 'longer than the age of the universe';
    var y = Math.pow(10, lyears);
    if (y < 1000) return Math.round(y).toLocaleString('en-US') + ' years';
    if (lyears < 6) return Math.round(y).toLocaleString('en-US') + ' years';
    return (y / 1e6).toFixed(1) + ' million years';
  }

  // ---------- Markup ----------
  var wrap = el('div', 'pg');
  var controls = el('div', 'pg-controls');

  function field(labelText, node, id) {
    var d = el('div', 'pg-field'); var l = el('label', null, labelText); l.setAttribute('for', id);
    node.id = id; d.appendChild(l); d.appendChild(node); return d;
  }
  var nNum = el('input'); nNum.type = 'number'; nNum.min = '1'; nNum.max = String(N_CAP); nNum.step = '1'; nNum.value = '20';
  nNum.setAttribute('inputmode', 'numeric');
  var nRange = el('input'); nRange.type = 'range'; nRange.min = '1'; nRange.max = '30'; nRange.step = '1'; nRange.value = '20';
  var xSel = el('select');
  [[10, 'n up to 10'], [30, 'n up to 30'], [100, 'n up to 100'], [1000, 'n up to 1,000']].forEach(function (o) {
    var op = el('option', null, o[1]); op.value = String(o[0]); if (o[0] === 30) op.selected = true; xSel.appendChild(op);
  });
  var ySel = el('select');
  [['linear', 'Linear, clipped'], ['log', 'Logarithmic']].forEach(function (o) {
    var op = el('option', null, o[1]); op.value = o[0]; ySel.appendChild(op);
  });
  controls.appendChild(field('Input size n', nNum, 'pg-n'));
  var rf = field('Slide to change n', nRange, 'pg-range'); controls.appendChild(rf);
  controls.appendChild(field('Chart range', xSel, 'pg-x'));
  controls.appendChild(field('Operations axis', ySel, 'pg-y'));

  var toggles = el('fieldset', 'pg-toggles'); var lg0 = el('legend', null, 'Curves to show'); toggles.appendChild(lg0);
  CURVES.forEach(function (c) {
    var lab = el('label', 'pg-toggle'); var cb = el('input'); cb.type = 'checkbox'; cb.checked = true; cb.setAttribute('data-k', c.key);
    var sw = el('code', c.cls, c.label); lab.appendChild(cb); lab.appendChild(sw);
    cb.addEventListener('change', function () { visible[c.key] = cb.checked; draw(); table(); });
    toggles.appendChild(lab);
  });

  var note = el('p', 'pg-note'); note.setAttribute('aria-live', 'polite');
  var layout = el('div', 'explorer');
  var left = el('div');
  var chartBox = el('div', 'chart');
  var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-describedby': 'pg-desc' });
  var desc = el('p', 'sr-only'); desc.id = 'pg-desc';
  chartBox.appendChild(svg); left.appendChild(chartBox); left.appendChild(desc);

  var tw = el('div', 'table-wrap'); tw.setAttribute('role', 'region'); tw.setAttribute('aria-label', 'Operation counts and estimated time by complexity class'); tw.tabIndex = 0;
  var tbl = el('table', 'table'); var cap = el('caption'); tbl.appendChild(cap);
  var thead = el('thead'); var hr = el('tr');
  ['Complexity', 'Operations', 'At 10⁸ operations per second'].forEach(function (h) { hr.appendChild(el('th', null, h)); });
  thead.appendChild(hr); tbl.appendChild(thead);
  var tbody = el('tbody'); tbl.appendChild(tbody); tw.appendChild(tbl);

  layout.appendChild(left); layout.appendChild(tw);
  wrap.appendChild(controls); wrap.appendChild(toggles); wrap.appendChild(note); wrap.appendChild(layout);
  mount.appendChild(wrap);

  // ---------- Scales ----------
  function niceMax(v) {
    var steps = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    for (var i = 0; i < steps.length; i++) if (steps[i] * p >= v) return steps[i] * p;
    return 10 * p;
  }
  function plot() {
    if (state.log) return { lo: -0.4, hi: 12 };
    return { lo: 0, hi: niceMax(state.xMax * 6) };
  }
  function px(n) { return L + (n - 1) / (state.xMax - 1) * (W - L - R); }
  function py(v, p) {                         // v = operation count
    var y = state.log ? Math.max(lg(Math.max(v, 1)), p.lo) : v;
    return T + (1 - (y - p.lo) / (p.hi - p.lo)) * (H - T - B);
  }
  function fmtTick(v) {
    if (v >= 1e6) return (v / 1e6) + 'M';
    if (v >= 1e3) return (v / 1e3) + 'k';
    return String(v);
  }

  // ---------- Chart ----------
  var cleanId = 0;
  function draw() {
    var p = plot();
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    cleanId++;
    var clipId = 'pg-clip-' + cleanId;
    var defs = svgEl('defs', {}); var clip = svgEl('clipPath', { id: clipId });
    clip.appendChild(svgEl('rect', { x: L, y: T, width: W - L - R, height: H - T - B }));
    defs.appendChild(clip); svg.appendChild(defs);

    var yTicks = [];
    if (state.log) { for (var e = 0; e <= 12; e += 2) yTicks.push({ v: Math.pow(10, e), y: e }); }
    else { for (var i = 0; i <= 4; i++) { var v = p.hi / 4 * i; yTicks.push({ v: v, y: v, label: fmtTick(Math.round(v)) }); } }
    yTicks.forEach(function (t) {
      var y = T + (1 - (t.y - p.lo) / (p.hi - p.lo)) * (H - T - B);
      svg.appendChild(svgEl('line', { 'class': 'grid', x1: L, x2: W - R, y1: y, y2: y }));
      var tx = svgEl('text', { 'class': 'axis-label', x: L - 8, y: y + 4, 'text-anchor': 'end' });
      if (state.log) {
        var exp = Math.round(t.y);
        if (exp === 0) tx.textContent = '1';
        else { tx.textContent = '10'; var s = svgEl('tspan', { dy: '-4', 'font-size': '9' }, String(exp)); tx.appendChild(s); }
      } else tx.textContent = t.label;
      svg.appendChild(tx);
    });
    var xt = state.xMax <= 10 ? [1, 2, 4, 6, 8, 10] : state.xMax === 30 ? [1, 5, 10, 15, 20, 25, 30] : state.xMax === 100 ? [1, 25, 50, 75, 100] : [1, 250, 500, 750, 1000];
    xt.forEach(function (n) {
      svg.appendChild(svgEl('line', { 'class': 'grid', x1: px(n), x2: px(n), y1: T, y2: H - B }));
      svg.appendChild(svgEl('text', { 'class': 'axis-label', x: px(n), y: H - B + 18, 'text-anchor': 'middle' }, String(n)));
    });
    svg.appendChild(svgEl('text', { 'class': 'axis-label', x: (L + W - R) / 2, y: H - 6, 'text-anchor': 'middle' }, 'Input size n'));
    var cy = (T + H - B) / 2;
    svg.appendChild(svgEl('text', { 'class': 'axis-label', x: 14, y: cy, 'text-anchor': 'middle', transform: 'rotate(-90 14 ' + cy + ')' }, state.log ? 'Operations (log scale)' : 'Operations'));

    var g = svgEl('g', { 'clip-path': 'url(#' + clipId + ')' });
    var dashes = ['', '6 3', '2 3', '10 3 2 3', '', '1 4'];
    CURVES.forEach(function (c, ci) {
      if (!visible[c.key]) return;
      var d = '';
      var step = state.xMax <= 30 ? 0.25 : state.xMax / 160;
      for (var n = 1; n <= state.xMax + 0.001; n += step) {
        var val = state.log ? c.f(n) : Math.min(c.f(n), p.hi * 1.2);
        d += (d ? 'L' : 'M') + px(n).toFixed(1) + ' ' + py(val, p).toFixed(1);
      }
      var attrs = { 'class': 'curve', d: d, style: 'stroke:' + c.color };
      if (dashes[ci]) attrs['stroke-dasharray'] = dashes[ci];
      g.appendChild(svgEl('path', attrs));
    });
    svg.appendChild(g);

    // Marker for the chosen n
    if (state.n <= state.xMax) {
      var x = px(state.n);
      svg.appendChild(svgEl('line', { 'class': 'marker', x1: x, x2: x, y1: T, y2: H - B }));
      CURVES.forEach(function (c) {
        if (!visible[c.key]) return;
        var v = c.f(state.n);
        if (state.log ? lg(v) <= p.hi : v <= p.hi) svg.appendChild(svgEl('circle', { cx: x, cy: py(v, p), r: 4, style: 'fill:' + c.color }));
      });
      var anchor = state.n > state.xMax * 0.8 ? 'end' : 'start';
      svg.appendChild(svgEl('text', { 'class': 'marker-label', x: x + (anchor === 'end' ? -6 : 6), y: T + 12, 'text-anchor': anchor }, 'n = ' + state.n));
    }
    svg.setAttribute('aria-label', 'Growth curves for ' + CURVES.filter(function (c) { return visible[c.key]; }).map(function (c) { return c.label; }).join(', ') +
      ' for input sizes 1 to ' + state.xMax + ', on a ' + (state.log ? 'logarithmic' : 'linear') + ' operations axis. The table beside the chart lists the exact values.');
    describe(p);
  }

  function describe(p) {
    var parts = [];
    CURVES.forEach(function (c) {
      if (!visible[c.key]) return;
      var at = 'At n = ' + state.n.toLocaleString('en-US') + ', ' + c.label + ' does about ' + fmtLog(c.l(state.n)).replace(/<sup>(\d+)<\/sup>/, '^$1') + ' operations';
      if (!state.log) {
        var exits = null;
        for (var n = 1; n <= state.xMax; n++) if (c.f(n) > p.hi) { exits = n; break; }
        if (exits) at += ' and leaves the top of the chart at n = ' + exits;
      }
      parts.push(at + '.');
    });
    desc.textContent = parts.join(' ');
  }

  // ---------- Table ----------
  function table() {
    var n = state.n;
    tbody.textContent = '';
    var shown = CURVES.filter(function (c) { return visible[c.key]; });
    var maxL = Math.max.apply(null, shown.map(function (c) { return c.l(n); }).concat([1]));
    shown.forEach(function (c) {
      var l = c.l(n);
      var tr = el('tr');
      var td0 = el('td'); td0.appendChild(el('code', c.cls, c.label)); td0.appendChild(el('span', 'pg-name', c.name));
      var td1 = el('td'); td1.innerHTML = fmtLog(l);
      var bar = el('span', 'pg-bar'); bar.setAttribute('aria-hidden', 'true');
      var fill = el('span', 'pg-bar-fill'); fill.style.width = Math.max(l === -Infinity ? 0 : l / maxL * 100, 2) + '%'; fill.style.background = c.color;
      bar.appendChild(fill); td1.appendChild(bar);
      var td2 = el('td'); td2.textContent = fmtDuration(l);
      tr.appendChild(td0); tr.appendChild(td1); tr.appendChild(td2);
      tbody.appendChild(tr);
    });
    cap.textContent = 'Approximate operations for n = ' + n.toLocaleString('en-US') + '. Logarithms are base 2.';
    note.textContent = n > state.xMax ? 'The chart covers n up to ' + state.xMax.toLocaleString('en-US') + '. The table still reflects n = ' + n.toLocaleString('en-US') + '.' : '';
  }

  function setRangeLimits() {
    nRange.max = String(state.xMax);
    nRange.value = String(Math.min(state.n, state.xMax));
    nRange.setAttribute('aria-label', 'Input size n, chart range 1 to ' + state.xMax);
  }
  function setN(n, fromNum) {
    n = Math.max(1, Math.min(N_CAP, Math.round(n)));
    state.n = n;
    if (!fromNum) nNum.value = String(n);
    nRange.value = String(Math.min(n, state.xMax));
    draw(); table();
  }

  nNum.addEventListener('input', function () {
    var v = parseInt(nNum.value, 10); if (isNaN(v)) return; setN(v, true);
  });
  nNum.addEventListener('change', function () {
    var v = nNum.value === '' ? NaN : Number(nNum.value);
    setN(isFinite(v) ? v : 20, false);
  });
  nRange.addEventListener('input', function () { setN(parseInt(nRange.value, 10), false); });
  xSel.addEventListener('change', function () { state.xMax = parseInt(xSel.value, 10); setRangeLimits(); draw(); table(); });
  ySel.addEventListener('change', function () { state.log = ySel.value === 'log'; draw(); table(); });

  setRangeLimits(); draw(); table();
})();
