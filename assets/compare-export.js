/* Side-by-side comparison, plus export and share tools. */
(function () {
  'use strict';
  var BigO = window.BigO, el = BigO.el;
  var D = window.BIGO_DATA;

  // ======================= Compare =======================
  var cMount = document.getElementById('compare-mount');
  var cmp = BigO.compare = {};
  if (cMount) (function () {
    var ids = Object.keys(D.COMPARE);
    var KIND = { sort: 'Sorting', graph: 'Graph algorithms', search: 'Searching', ds: 'Data structures' };
    var root = el('div', 'compare'); cMount.appendChild(root);
    var bar = el('div', 'pg-controls');
    function sel(label, id, value) {
      var d = el('div', 'pg-field'); var l = el('label', null, label); l.setAttribute('for', id);
      var s = el('select'); s.id = id;
      Object.keys(KIND).forEach(function (k) {
        var g = el('optgroup'); g.label = KIND[k];
        ids.filter(function (i) { return D.COMPARE[i].kind === k; }).forEach(function (i) { var o = el('option', null, D.COMPARE[i].name); o.value = i; g.appendChild(o); });
        s.appendChild(g);
      });
      s.value = value; d.appendChild(l); d.appendChild(s); bar.appendChild(d); return s;
    }
    var sa = sel('First', 'cmp-a', 'mergesort'), sb = sel('Second', 'cmp-b', 'quicksort');
    var swap = el('button', 'btn', 'Swap'); swap.type = 'button';
    var copyMd = el('button', 'btn', 'Copy as Markdown'); copyMd.type = 'button';
    var copyLink = el('button', 'btn', 'Copy link'); copyLink.type = 'button';
    var actions = el('div', 'viz-buttons'); [swap, copyMd, copyLink].forEach(function (b) { actions.appendChild(b); });
    var warn = el('p', 'callout'); warn.hidden = true;
    var out = el('div'); out.setAttribute('aria-live', 'polite');
    root.appendChild(bar); root.appendChild(actions); root.appendChild(warn); root.appendChild(out);

    var ROWS = [['Time complexity', 'time'], ['Auxiliary space', 'space'], ['Stable', 'stable'], ['In place', 'inPlace'], ['Best used for', 'useFor'], ['Trade-offs', 'tradeoffs']];
    function rowsFor(a, b) {
      return ROWS.filter(function (r) {
        // Hide rows that are not applicable to either side, such as stability for graph algorithms.
        return !(a[r[1]] === 'Not applicable' && b[r[1]] === 'Not applicable');
      });
    }
    function render(quiet) {
      var a = D.COMPARE[sa.value], b = D.COMPARE[sb.value];
      out.textContent = '';
      warn.hidden = a.kind === b.kind;
      warn.textContent = a.kind === b.kind ? '' : 'These two solve different kinds of problems. The table still lists their costs, but the choice between them is not a real trade-off.';
      var tw = el('div', 'table-wrap'); tw.setAttribute('role', 'region'); tw.setAttribute('aria-label', 'Comparison of ' + a.name + ' and ' + b.name); tw.tabIndex = 0;
      var t = el('table', 'table compare-table');
      var cap = el('caption', null, a.name + ' compared with ' + b.name); t.appendChild(cap);
      var th = el('thead'); var hr = el('tr'); hr.appendChild(el('th', null, 'Property'));
      hr.appendChild(el('th', null, a.name)); hr.appendChild(el('th', null, b.name)); th.appendChild(hr); t.appendChild(th);
      var tb = el('tbody');
      rowsFor(a, b).forEach(function (r) {
        var tr = el('tr'); var h = el('th', null, r[0]); h.scope = 'row'; tr.appendChild(h);
        tr.appendChild(el('td', 'notes', a[r[1]])); tr.appendChild(el('td', 'notes', b[r[1]])); tb.appendChild(tr);
      });
      t.appendChild(tb); tw.appendChild(t); out.appendChild(tw);
      if (quiet !== true) {
        try { history.replaceState(null, '', '#compare=' + sa.value + ',' + sb.value); } catch (e) {}
      }
    }
    function markdown() {
      var a = D.COMPARE[sa.value], b = D.COMPARE[sb.value];
      function c(s) { return String(s).replace(/\|/g, '\\|'); }
      var lines = ['| Property | ' + c(a.name) + ' | ' + c(b.name) + ' |', '| --- | --- | --- |'];
      rowsFor(a, b).forEach(function (r) { lines.push('| ' + r[0] + ' | ' + c(a[r[1]]) + ' | ' + c(b[r[1]]) + ' |'); });
      return lines.join('\n');
    }
    sa.addEventListener('change', function () { render(); }); sb.addEventListener('change', function () { render(); });
    swap.addEventListener('click', function () { var t = sa.value; sa.value = sb.value; sb.value = t; render(); });
    copyMd.addEventListener('click', function () { BigO.copyText(markdown(), copyMd); });
    copyLink.addEventListener('click', function () { BigO.copyText(BigO.shareUrl('compare=' + sa.value + ',' + sb.value), copyLink, 'Link copied'); });

    cmp.set = function (a, b) {
      if (!D.COMPARE[a] || !D.COMPARE[b]) return;
      sa.value = a; sb.value = b; render(true);
    };
    cmp.pick = function (id) {
      if (!D.COMPARE[id]) return;
      sa.value = id;
      // Choose a sensible partner from the same group.
      var same = ids.filter(function (i) { return i !== id && D.COMPARE[i].kind === D.COMPARE[id].kind; });
      if (sb.value === id || D.COMPARE[sb.value].kind !== D.COMPARE[id].kind) sb.value = same[0] || sb.value;
      render();
      var s = document.getElementById('compare'); if (s) s.scrollIntoView({ behavior: BigO.reducedMotion() ? 'auto' : 'smooth' });
      sb.focus();
    };
    render(true);   // first paint keeps a clean address
  })();

  // ======================= Export =======================
  var eMount = document.getElementById('export-mount');
  if (eMount) (function () {
    var root = el('div', 'export'); eMount.appendChild(root);
    var bar = el('div', 'pg-controls');
    var d = el('div', 'pg-field'); var l = el('label', null, 'What to export'); l.setAttribute('for', 'exp-scope');
    var scope = el('select'); scope.id = 'exp-scope';
    [['all', 'All topics'], ['filtered', 'Topics currently shown in the search'], ['saved', 'Saved topics'], ['learned', 'Learned topics']].forEach(function (p) { var o = el('option', null, p[1]); o.value = p[0]; scope.appendChild(o); });
    d.appendChild(l); d.appendChild(scope); bar.appendChild(d); root.appendChild(bar);

    var status = el('p', 'footnotes'); status.setAttribute('role', 'status');
    var btns = el('div', 'viz-buttons'); btns.setAttribute('role', 'group'); btns.setAttribute('aria-label', 'Export actions');
    function mk(t) { var b = el('button', 'btn', t); b.type = 'button'; btns.appendChild(b); return b; }
    var bMd = mk('Copy Markdown table'), bCsv = mk('Download CSV'), bLk = mk('Download lookup CSV'), bPrint = mk('Print topic cards');
    root.appendChild(btns); root.appendChild(status);

    function list() {
      var all = BigO.entries || [], s = scope.value;
      if (s === 'saved') return all.filter(function (e) { return BigO.store.isSaved(e.id); });
      if (s === 'learned') return all.filter(function (e) { return BigO.store.isLearned(e.id); });
      if (s === 'filtered') {
        var q = (document.getElementById('q') || {}).value || '';
        var tp = (document.getElementById('f-topic') || {}).value, cl = (document.getElementById('f-class') || {}).value, rl = (document.getElementById('f-rel') || {}).value;
        var toks = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
        return all.filter(function (e) {
          if (tp && e.topic !== tp) return false; if (cl && e.classes.indexOf(cl) < 0) return false; if (rl && e.rel !== rl) return false;
          if (!BigO.statusMatch(e)) return false;
          return toks.every(function (t) { return e.hay.indexOf(t) >= 0; });
        });
      }
      return all;
    }
    function nonEmpty() {
      var l = list();
      if (!l.length) { status.textContent = 'Nothing to export for that choice. Save or mark a topic first, or pick "All topics".'; return null; }
      return l;
    }
    function csvCell(v) { v = String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    function csv(headers, rows) { return '\ufeff' + [headers].concat(rows).map(function (r) { return r.map(csvCell).join(','); }).join('\r\n') + '\r\n'; }

    bMd.addEventListener('click', function () {
      var l = nonEmpty(); if (!l) return;
      function c(s) { return String(s).replace(/\|/g, '\\|'); }
      var lines = ['| Topic | Group | Time | Space | Interview relevance |', '| --- | --- | --- | --- | --- |'];
      l.forEach(function (e) { lines.push('| ' + c(e.name) + ' | ' + c(e.topic) + ' | ' + c(e.time) + ' | ' + c(e.space) + ' | ' + c(e.rel) + ' |'); });
      BigO.copyText(lines.join('\n'), bMd, 'Copied ' + l.length);
      status.textContent = 'Copied a Markdown table with ' + l.length + ' topics.';
    });
    bCsv.addEventListener('click', function () {
      var l = nonEmpty(); if (!l) return;
      var rows = l.map(function (e) { return [e.id, e.name, e.topic, e.time, e.space, e.rel, e.classes.join(' '), e.keywords, e.ref || '']; });
      BigO.download('big-o-cheat-sheet.csv', csv(['id', 'name', 'topic', 'time', 'space', 'interview_relevance', 'classes', 'keywords', 'reference'], rows), 'text/csv;charset=utf-8');
      status.textContent = 'Downloaded big-o-cheat-sheet.csv with ' + l.length + ' topics.';
    });
    bLk.addEventListener('click', function () {
      var rows = (BigO.LOOKUP || []).map(function (r) { return [r.name, r.group, r.best, r.avg, r.worst, r.space, r.assume, r.caveat]; });
      BigO.download('big-o-lookup.csv', csv(['operation', 'group', 'best', 'average', 'worst', 'auxiliary_space', 'assumptions', 'caveats'], rows), 'text/csv;charset=utf-8');
      status.textContent = 'Downloaded big-o-lookup.csv with ' + rows.length + ' rows.';
    });
    bPrint.addEventListener('click', function () {
      var l = nonEmpty(); if (!l) return;
      var host = document.getElementById('print-cards');
      if (!host) { host = el('div'); host.id = 'print-cards'; document.body.appendChild(host); }
      host.textContent = '';
      host.appendChild(el('h2', null, 'Big O topic cards'));
      var grid = el('div', 'pc-grid');
      l.forEach(function (e) {
        var c = el('article', 'pc'); c.appendChild(el('h3', null, e.name));
        c.appendChild(el('p', 'pc-meta', e.topic + '. ' + e.rel + ' interview relevance.'));
        var dl = el('dl'); dl.appendChild(el('dt', null, 'Time')); dl.appendChild(el('dd', null, e.time)); dl.appendChild(el('dt', null, 'Space')); dl.appendChild(el('dd', null, e.space)); c.appendChild(dl);
        var w = el('p'); w.appendChild(el('strong', null, 'When to use: ')); w.appendChild(document.createTextNode(e.when)); c.appendChild(w);
        var y = el('p'); y.appendChild(el('strong', null, 'Why: ')); y.appendChild(document.createTextNode(e.why)); c.appendChild(y);
        var p = el('p'); p.appendChild(el('strong', null, 'Pitfall: ')); p.appendChild(document.createTextNode(e.pitfall)); c.appendChild(p);
        var pre = el('pre'); pre.appendChild(el('code', null, e.code)); c.appendChild(pre);
        grid.appendChild(c);
      });
      host.appendChild(grid);
      document.body.classList.add('print-cards');
      function cleanup() { document.body.classList.remove('print-cards'); window.removeEventListener('afterprint', cleanup); }
      window.addEventListener('afterprint', cleanup);
      window.print();
    });

    var note = el('p', 'footnotes');
    note.textContent = 'To share a single topic, use Copy link on its card. Comparison links keep both choices. Opening a shared link works offline too.';
    root.appendChild(note);
    BigO.on('change', function () { status.textContent = ''; });
  })();
})();
