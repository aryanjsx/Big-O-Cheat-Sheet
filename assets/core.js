/* Core helpers for the interactive features: events, local storage, card hooks,
   share links, and keyboard shortcuts. Plain script, no build step. */
(function () {
  'use strict';
  var BigO = window.BigO = window.BigO || {};
  var KEY = 'bigo:v1';

  // ---------- Tiny helpers ----------
  BigO.el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  var el = BigO.el;

  BigO.svg = function (name, attrs, text) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  };

  BigO.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  BigO.announce = function (msg) {
    var live = document.getElementById('sr-live');
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 20);
  };

  BigO.copyText = function (text, btn, okLabel) {
    function done(msg) {
      if (!btn) { BigO.announce(msg); return; }
      var old = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', old);
      btn.textContent = msg;
      BigO.announce(msg);
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(okLabel || 'Copied'); }, function () { done('Copy failed'); });
    } else { done('Copy failed'); }
  };

  BigO.download = function (filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  BigO.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  // ---------- Event bus ----------
  var handlers = {};
  BigO.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  BigO.emit = function (name, arg) { (handlers[name] || []).forEach(function (fn) { fn(arg); }); };

  // ---------- Store (localStorage with an in-memory fallback) ----------
  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return typeof v === 'string'; }) : []; }
  function norm(s) {
    s = s || {};
    return {
      bookmarks: arr(s.bookmarks), learned: arr(s.learned), last: typeof s.last === 'string' ? s.last : null,
      quiz: { best: s.quiz && typeof s.quiz.best === 'number' ? s.quiz.best : null, runs: s.quiz && s.quiz.runs | 0 },
      challenge: { done: (s.challenge && s.challenge.done && typeof s.challenge.done === 'object') ? s.challenge.done : {} }
    };
  }
  var persistent = true;
  var state;
  try { state = norm(JSON.parse(localStorage.getItem(KEY))); } catch (e) { state = norm(null); try { localStorage.getItem(KEY); } catch (e2) { persistent = false; } }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); persistent = true; } catch (e) { persistent = false; }
    BigO.emit('change');
  }
  function toggle(list, id) {
    var i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    return i < 0;
  }
  BigO.store = {
    state: function () { return state; },
    persistent: function () { return persistent; },
    isSaved: function (id) { return state.bookmarks.indexOf(id) >= 0; },
    isLearned: function (id) { return state.learned.indexOf(id) >= 0; },
    toggleSaved: function (id) { var on = toggle(state.bookmarks, id); save(); return on; },
    toggleLearned: function (id) { var on = toggle(state.learned, id); save(); return on; },
    setLast: function (id) { if (state.last !== id) { state.last = id; save(); } },
    recordQuiz: function (score, total) {
      var pct = Math.round(score / total * 100);
      state.quiz.runs += 1;
      if (state.quiz.best == null || pct > state.quiz.best) state.quiz.best = pct;
      save();
    },
    recordChallenge: function (id, ok) { state.challenge.done[id] = !!ok; save(); },
    reset: function () { state = norm(null); save(); }
  };

  // ---------- Entries and filters ----------
  BigO.entryById = function (id) {
    var list = BigO.entries || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  BigO.statusMatch = function (e) {
    var s = document.getElementById('f-status');
    var v = s ? s.value : '';
    if (v === 'saved') return BigO.store.isSaved(e.id);
    if (v === 'learned') return BigO.store.isLearned(e.id);
    if (v === 'todo') return !BigO.store.isLearned(e.id);
    return true;
  };

  BigO.resetFilters = function () {
    ['q', 'f-topic', 'f-class', 'f-rel', 'f-status'].forEach(function (id) {
      var n = document.getElementById(id); if (n) n.value = '';
    });
    var q = document.getElementById('q');
    if (q) q.dispatchEvent(new Event('input', { bubbles: true }));
  };

  BigO.shareUrl = function (hash) {
    return location.href.split('#')[0] + '#' + hash;
  };

  BigO.openAlgo = function (id, quiet) {
    if (!BigO.entryById(id)) return false;
    BigO.resetFilters();
    var card = document.getElementById('card-' + id);
    if (!card) return false;
    var d = card.querySelector('details'); if (d) d.open = true;
    document.querySelectorAll('.card.is-target').forEach(function (c) { c.classList.remove('is-target'); });
    card.classList.add('is-target');
    card.setAttribute('tabindex', '-1');
    card.scrollIntoView({ block: 'center', behavior: BigO.reducedMotion() ? 'auto' : 'smooth' });
    card.focus({ preventScroll: true });
    if (!quiet) BigO.announce('Opened ' + BigO.entryById(id).name);
    return true;
  };

  // ---------- Card decoration (called by the card builder in index.html) ----------
  var LANGS = [
    { key: 'python', label: 'Python' }, { key: 'java', label: 'Java' },
    { key: 'cpp', label: 'C++' }, { key: 'javascript', label: 'JavaScript' }
  ];

  function pressBtn(label, pressed, aria) {
    var b = el('button', 'btn btn-sm', label);
    b.type = 'button';
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    if (aria) b.setAttribute('aria-label', aria);
    return b;
  }

  function addLanguageTabs(a, e) {
    var data = window.BIGO_DATA && window.BIGO_DATA.MULTILANG && window.BIGO_DATA.MULTILANG[e.id];
    if (!data) return;
    var wrap = a.querySelector('.code-wrap'); if (!wrap) return;
    var codeEl = wrap.querySelector('code');
    var oldCopy = wrap.querySelector('.copy-btn');
    var copy = oldCopy.cloneNode(true); oldCopy.parentNode.replaceChild(copy, oldCopy);

    var variants = { python: { code: e.code, cost: 'Baseline example used throughout this sheet.' } };
    LANGS.forEach(function (l) { if (data[l.key]) variants[l.key] = data[l.key]; });
    var avail = LANGS.filter(function (l) { return variants[l.key]; });

    var list = el('div', 'lang-tabs'); list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Language for ' + e.name);
    var note = el('p', 'lang-note');
    var current = 'python';
    var tabs = [];

    function select(key, focus) {
      current = key;
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-key') === key;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      codeEl.textContent = variants[key].code;
      var label = LANGS.filter(function (l) { return l.key === key; })[0].label;
      note.textContent = key === 'python' ? variants.python.cost : label + ': ' + variants[key].cost;
      copy.setAttribute('aria-label', 'Copy ' + label + ' code for ' + e.name);
    }
    avail.forEach(function (l, idx) {
      var t = el('button', 'lang-tab', l.label); t.type = 'button';
      t.setAttribute('role', 'tab'); t.setAttribute('data-key', l.key);
      t.addEventListener('click', function () { select(l.key, false); });
      t.addEventListener('keydown', function (ev) {
        var n = null;
        if (ev.key === 'ArrowRight') n = (idx + 1) % avail.length;
        else if (ev.key === 'ArrowLeft') n = (idx - 1 + avail.length) % avail.length;
        else if (ev.key === 'Home') n = 0;
        else if (ev.key === 'End') n = avail.length - 1;
        if (n != null) { ev.preventDefault(); select(avail[n].key, true); }
      });
      tabs.push(t); list.appendChild(t);
    });
    copy.addEventListener('click', function () { BigO.copyText(variants[current].code, copy); });
    wrap.parentNode.insertBefore(list, wrap);
    wrap.parentNode.insertBefore(note, wrap.nextSibling);
    codeEl.parentNode.setAttribute('tabindex', '0');
    select('python', false);
  }

  BigO.decorateCard = function (a, e) {
    var saved = BigO.store.isSaved(e.id), learned = BigO.store.isLearned(e.id);
    a.classList.toggle('is-learned', learned);

    var actions = el('div', 'card-actions'); actions.setAttribute('role', 'group');
    actions.setAttribute('aria-label', 'Actions for ' + e.name);
    var bSave = pressBtn('Save', saved, 'Save ' + e.name);
    var bLearn = pressBtn('Mark learned', learned, 'Mark ' + e.name + ' as learned');
    var bLink = el('button', 'btn btn-sm', 'Copy link'); bLink.type = 'button';
    bLink.setAttribute('aria-label', 'Copy link to ' + e.name);
    bSave.addEventListener('click', function () {
      var on = BigO.store.toggleSaved(e.id);
      bSave.setAttribute('aria-pressed', on ? 'true' : 'false');
      BigO.announce(e.name + (on ? ' saved' : ' removed from saved'));
    });
    bLearn.addEventListener('click', function () {
      var on = BigO.store.toggleLearned(e.id);
      bLearn.setAttribute('aria-pressed', on ? 'true' : 'false');
      a.classList.toggle('is-learned', on);
      BigO.announce(e.name + (on ? ' marked as learned' : ' marked as not learned'));
    });
    bLink.addEventListener('click', function () { BigO.copyText(BigO.shareUrl('algo=' + e.id), bLink, 'Link copied'); });
    actions.appendChild(bSave); actions.appendChild(bLearn); actions.appendChild(bLink);
    if (window.BIGO_DATA && window.BIGO_DATA.COMPARE && window.BIGO_DATA.COMPARE[e.id]) {
      var bCmp = el('button', 'btn btn-sm', 'Compare'); bCmp.type = 'button';
      bCmp.setAttribute('aria-label', 'Compare ' + e.name + ' with another topic');
      bCmp.addEventListener('click', function () { if (BigO.compare) BigO.compare.pick(e.id); });
      actions.appendChild(bCmp);
    }
    var facts = a.querySelector('.facts');
    a.insertBefore(actions, facts);

    var d = a.querySelector('details');
    if (d) d.addEventListener('toggle', function () { if (d.open) BigO.store.setLast(e.id); });
    addLanguageTabs(a, e);
  };

  // ---------- Resume banner and routing ----------
  function renderResume() {
    var box = document.getElementById('resume'); if (!box) return;
    box.textContent = '';
    var last = BigO.store.state().last;
    var e = last && BigO.entryById(last);
    if (!e) return;
    box.appendChild(document.createTextNode('Continue where you left off: '));
    var b = el('button', 'btn btn-sm', e.name); b.type = 'button';
    b.setAttribute('aria-label', 'Open ' + e.name + ', the last topic you viewed');
    b.addEventListener('click', function () { BigO.openAlgo(e.id); });
    box.appendChild(b);
  }

  BigO.route = function () {
    var h = location.hash.replace(/^#/, '');
    var m = /^algo=([a-z0-9-]+)$/.exec(h);
    if (m) { BigO.openAlgo(m[1], true); return; }
    m = /^compare=([a-z0-9-]+),([a-z0-9-]+)$/.exec(h);
    if (m && BigO.compare) { BigO.compare.set(m[1], m[2]); var s = document.getElementById('compare'); if (s) s.scrollIntoView(); }
  };

  BigO.onEntries = function (fn) {
    if (BigO.entries) fn(); else BigO.on('entries', fn);
  };
  BigO.setEntries = function (list, rerender) {
    BigO.entries = list; BigO.rerender = rerender;
    BigO.emit('entries');
    renderResume();
    BigO.route();
  };
  // Keep rendered cards in step when progress changes somewhere else, such as the roadmap.
  function syncCards() {
    document.querySelectorAll('.card').forEach(function (card) {
      var id = card.id.replace(/^card-/, '');
      var learned = BigO.store.isLearned(id);
      card.classList.toggle('is-learned', learned);
      var s = card.querySelector('.card-actions button[aria-label^="Save "]');
      var l = card.querySelector('.card-actions button[aria-label^="Mark "]');
      if (s) s.setAttribute('aria-pressed', BigO.store.isSaved(id) ? 'true' : 'false');
      if (l) l.setAttribute('aria-pressed', learned ? 'true' : 'false');
    });
  }
  BigO.on('change', renderResume);
  BigO.on('change', syncCards);
  window.addEventListener('hashchange', function () { if (BigO.entries) BigO.route(); });

  // ---------- Keyboard shortcuts ----------
  var SHORTCUTS = [
    ['/', 'Focus the search box'],
    ['?', 'Show this list of shortcuts'],
    ['r', 'Switch between the full sheet and the one-page revision view'],
    ['b', 'Save or unsave the card that has focus'],
    ['l', 'Mark the card that has focus as learned or not learned'],
    ['Space, Left arrow, Right arrow', 'In the visualizer: play or pause, step back, step forward'],
    ['1 to 4, Enter', 'In the quiz: pick an answer, then go to the next question'],
    ['Escape', 'Close this list']
  ];

  function ensureDialog() {
    var dlg = document.getElementById('shortcuts-dialog');
    if (dlg) return dlg;
    dlg = el('dialog', 'shortcuts'); dlg.id = 'shortcuts-dialog';
    dlg.setAttribute('aria-labelledby', 'shortcuts-title');
    var h = el('h2', null, 'Keyboard shortcuts'); h.id = 'shortcuts-title';
    h.style.cssText = 'margin-top:0;border-top:none;padding-top:0';
    dlg.appendChild(h);
    var dl = el('dl', 'shortcut-list');
    SHORTCUTS.forEach(function (s) {
      var dt = el('dt'); 
      s[0].split(', ').forEach(function (k, i) {
        if (i) dt.appendChild(document.createTextNode(' '));
        dt.appendChild(el('kbd', null, k));
      });
      dl.appendChild(dt); dl.appendChild(el('dd', null, s[1]));
    });
    dlg.appendChild(dl);
    var close = el('button', 'btn', 'Close'); close.type = 'button';
    close.addEventListener('click', function () { closeDialog(dlg); });
    dlg.appendChild(close);
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) closeDialog(dlg); });
    document.body.appendChild(dlg);
    return dlg;
  }
  var returnFocus = null;
  function openDialog(dlg) {
    returnFocus = document.activeElement;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var b = dlg.querySelector('button'); if (b) b.focus();
  }
  function closeDialog(dlg) {
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }
  BigO.showShortcuts = function () { openDialog(ensureDialog()); };

  document.addEventListener('keydown', function (ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var t = ev.target;
    var tag = t && t.tagName;
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable);
    if (typing) return;
    if (tag === 'BUTTON' && (ev.key === ' ' || ev.key === 'Enter')) return;
    var k = ev.key;
    if (k === '/') {
      var q = document.getElementById('q');
      if (q) { ev.preventDefault(); q.scrollIntoView({ block: 'center' }); q.focus(); }
    } else if (k === '?') {
      ev.preventDefault(); BigO.showShortcuts();
    } else if (k === 'r') {
      var rb = document.getElementById('btn-revision'); if (rb) rb.click();
    } else if (k === 'b' || k === 'l') {
      var card = t && t.closest && t.closest('.card');
      if (!card) return;
      var sel = k === 'b' ? 'button[aria-pressed][aria-label^="Save "]' : 'button[aria-pressed][aria-label^="Mark "]';
      var btn = card.querySelector(sel); if (btn) { ev.preventDefault(); btn.click(); }
    }
  });

  // ---------- Persistence note ----------
  BigO.persistenceNote = function () {
    return persistent ? 'Saved topics and progress stay in this browser. Nothing is sent anywhere.'
      : 'This browser is blocking local storage, so progress lasts only until you close the page.';
  };
})();
