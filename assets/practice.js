/* Big O quiz and code complexity challenge. */
(function () {
  'use strict';
  var BigO = window.BigO, el = BigO.el;
  var D = window.BIGO_DATA;

  // ======================= Quiz =======================
  var qMount = document.getElementById('quiz-mount');
  if (qMount) (function () {
    var LEN = 10;
    var root = el('div', 'quiz'); qMount.appendChild(root);
    var run = null;

    function start() {
      var picked = BigO.shuffle(D.QUIZ).slice(0, LEN).map(function (q) {
        var order = BigO.shuffle(q.options.map(function (o, i) { return i; }));
        return { q: q, order: order, picked: null };
      });
      run = { items: picked, i: 0, score: 0 };
      showQuestion();
    }

    function intro() {
      root.textContent = '';
      var p = el('p', null, 'Ten questions drawn at random from ' + D.QUIZ.length + '. Each answer comes with an explanation, and you get a score at the end.');
      root.appendChild(p);
      var best = BigO.store.state().quiz.best;
      var s = el('p', 'footnotes', best == null ? 'No score yet.' : 'Your best score: ' + best + '%.');
      root.appendChild(s);
      var b = el('button', 'btn', 'Start the quiz'); b.type = 'button'; b.addEventListener('click', start);
      root.appendChild(b);
    }

    function showQuestion() {
      root.textContent = '';
      var it = run.items[run.i], q = it.q;
      var head = el('p', 'quiz-count', 'Question ' + (run.i + 1) + ' of ' + run.items.length + '. Score so far: ' + run.score + '.');
      var fs = el('fieldset', 'quiz-q');
      var lg = el('legend', null, q.q); fs.appendChild(lg);
      if (q.code) { var pre = el('pre'); pre.appendChild(el('code', null, q.code)); pre.tabIndex = 0; pre.setAttribute('aria-label', 'Code for question ' + (run.i + 1)); fs.appendChild(pre); }
      var opts = el('div', 'quiz-opts');
      var feedback = el('div', 'quiz-feedback'); feedback.setAttribute('role', 'status');
      var next = el('button', 'btn', run.i === run.items.length - 1 ? 'See your score' : 'Next question'); next.type = 'button'; next.hidden = true;
      var buttons = [];
      it.order.forEach(function (orig, pos) {
        var b = el('button', 'quiz-opt'); b.type = 'button';
        b.appendChild(el('span', 'quiz-key', String(pos + 1))); b.appendChild(el('span', null, q.options[orig]));
        b.setAttribute('aria-label', 'Answer ' + (pos + 1) + ': ' + q.options[orig]);
        b.addEventListener('click', function () { answer(orig, pos); });
        buttons.push(b); opts.appendChild(b);
      });
      function answer(orig) {
        if (it.picked != null) return;
        it.picked = orig;
        var ok = orig === q.answer;
        if (ok) run.score++;
        buttons.forEach(function (b, pos) {
          var o = it.order[pos]; b.disabled = true;
          if (o === q.answer) { b.classList.add('is-correct'); b.appendChild(el('span', 'quiz-flag', 'Correct answer')); }
          else if (o === orig) { b.classList.add('is-wrong'); b.appendChild(el('span', 'quiz-flag', 'Your answer')); }
        });
        feedback.textContent = '';
        feedback.appendChild(el('strong', null, ok ? 'Correct. ' : 'Not quite. The answer is ' + q.options[q.answer] + '. '));
        feedback.appendChild(document.createTextNode(q.why));
        next.hidden = false; next.focus();
      }
      next.addEventListener('click', function () { run.i++; if (run.i < run.items.length) showQuestion(); else finish(); });
      fs.appendChild(opts);
      root.appendChild(head); root.appendChild(fs); root.appendChild(feedback); root.appendChild(next);
      root.__answerByPos = function (pos) { if (buttons[pos] && !buttons[pos].disabled) buttons[pos].click(); };
    }

    function finish() {
      BigO.store.recordQuiz(run.score, run.items.length);
      root.textContent = '';
      var pct = Math.round(run.score / run.items.length * 100);
      var h = el('h3', null, 'You scored ' + run.score + ' out of ' + run.items.length + ' (' + pct + '%)'); h.setAttribute('tabindex', '-1'); h.style.marginTop = '0';
      root.appendChild(h);
      var best = BigO.store.state().quiz.best;
      root.appendChild(el('p', null, (pct >= 80 ? 'Strong result. ' : pct >= 50 ? 'Solid start. ' : 'Worth another pass. ') + 'Your best score is ' + best + '%.'));
      var missed = run.items.filter(function (it) { return it.picked !== it.q.answer; });
      if (missed.length) {
        root.appendChild(el('h4', null, 'Questions to review'));
        var ul = el('ul', 'quiz-review');
        missed.forEach(function (it) {
          var li = el('li'); li.appendChild(el('strong', null, it.q.q + ' '));
          if (it.q.code) { var pre = el('pre'); pre.appendChild(el('code', null, it.q.code)); pre.tabIndex = 0; li.appendChild(pre); }
          li.appendChild(el('p', null, 'Answer: ' + it.q.options[it.q.answer] + '. ' + it.q.why));
          ul.appendChild(li);
        });
        root.appendChild(ul);
      }
      var again = el('button', 'btn', 'Try another set'); again.type = 'button'; again.addEventListener('click', start);
      root.appendChild(again);
      h.focus();
    }

    // 1 to 4 pick an answer, Enter moves on (only while focus is inside the quiz).
    qMount.addEventListener('keydown', function (ev) {
      if (!run || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (/^[1-4]$/.test(ev.key) && root.__answerByPos) { ev.preventDefault(); root.__answerByPos(parseInt(ev.key, 10) - 1); }
    });
    intro();
  })();

  // ======================= Challenge =======================
  var cMount = document.getElementById('challenge-mount');
  if (cMount) (function () {
    var LANG_LABEL = { python: 'Python', javascript: 'JavaScript', java: 'Java' };
    var order = BigO.shuffle(D.CHALLENGES), pos = 0, lang = 'python';
    var root = el('div', 'challenge'); cMount.appendChild(root);

    function render() {
      root.textContent = '';
      var ch = order[pos];
      var head = el('p', 'quiz-count', 'Challenge ' + (pos + 1) + ' of ' + order.length + ': ' + ch.title);
      root.appendChild(head);

      var tabs = el('div', 'lang-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Language');
      var keys = Object.keys(LANG_LABEL), btns = [];
      var code = el('pre'); var codeEl = el('code'); code.appendChild(codeEl); code.tabIndex = 0; code.setAttribute('aria-label', 'Code snippet');
      function pick(k, focus) {
        lang = k; codeEl.textContent = ch.langs[k];
        btns.forEach(function (b) { var on = b.getAttribute('data-key') === k; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      }
      keys.forEach(function (k, idx) {
        var b = el('button', 'lang-tab', LANG_LABEL[k]); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-key', k);
        b.addEventListener('click', function () { pick(k, false); });
        b.addEventListener('keydown', function (ev) {
          var n = null;
          if (ev.key === 'ArrowRight') n = (idx + 1) % keys.length; else if (ev.key === 'ArrowLeft') n = (idx - 1 + keys.length) % keys.length;
          if (n != null) { ev.preventDefault(); pick(keys[n], true); }
        });
        btns.push(b); tabs.appendChild(b);
      });
      root.appendChild(tabs); root.appendChild(code);
      pick(lang, false);

      var form = el('div', 'challenge-form');
      function select(labelText, options, id) {
        var d = el('div', 'pg-field'); var l = el('label', null, labelText); l.setAttribute('for', id);
        var s = el('select'); s.id = id;
        var ph = el('option', null, 'Choose one'); ph.value = ''; s.appendChild(ph);
        BigO.shuffle(options).forEach(function (o) { var op = el('option', null, o); op.value = o; s.appendChild(op); });
        d.appendChild(l); d.appendChild(s); form.appendChild(d); return s;
      }
      var tSel = select('Time complexity', ch.timeOptions, 'ch-time');
      var sSel = select('Auxiliary space complexity', ch.spaceOptions, 'ch-space');
      var reveal = el('button', 'btn', 'Check my answer'); reveal.type = 'button';
      form.appendChild(reveal);
      root.appendChild(form);

      var out = el('div', 'quiz-feedback'); out.setAttribute('role', 'status'); root.appendChild(out);
      var nav = el('div', 'viz-buttons');
      var showOnly = el('button', 'btn', 'Reveal without guessing'); showOnly.type = 'button';
      var nextB = el('button', 'btn', pos === order.length - 1 ? 'Start over' : 'Next challenge'); nextB.type = 'button';
      nav.appendChild(showOnly); nav.appendChild(nextB); root.appendChild(nav);

      function show(guessT, guessS) {
        out.textContent = '';
        var okT = guessT === ch.time, okS = guessS === ch.space;
        if (guessT != null) {
          out.appendChild(el('p', null, 'Time: you chose ' + guessT + (okT ? '. Correct.' : '. The answer is ' + ch.time + '.')));
          out.appendChild(el('p', null, 'Space: you chose ' + guessS + (okS ? '. Correct.' : '. The answer is ' + ch.space + '.')));
          BigO.store.recordChallenge(ch.id, okT && okS);
        } else {
          out.appendChild(el('p', null, 'Time: ' + ch.time + '. Auxiliary space: ' + ch.space + '.'));
        }
        out.appendChild(el('p', null, ch.why));
        reveal.disabled = true; tSel.disabled = true; sSel.disabled = true; showOnly.disabled = true;
        nextB.focus();
      }
      reveal.addEventListener('click', function () {
        if (!tSel.value || !sSel.value) { out.textContent = 'Pick both a time and a space answer first, or use "Reveal without guessing".'; return; }
        show(tSel.value, sSel.value);
      });
      showOnly.addEventListener('click', function () { show(null, null); });
      nextB.addEventListener('click', function () { pos = (pos + 1) % order.length; if (pos === 0) order = BigO.shuffle(D.CHALLENGES); render(); });
    }
    render();
  })();
})();
