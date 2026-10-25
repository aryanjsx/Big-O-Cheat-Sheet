/* Algorithm visualizer. Every run is precomputed into frames, so the player can
   step forward, step back, play, and reset. No animation libraries. */
(function () {
  'use strict';
  var BigO = window.BigO, el = BigO.el, svgEl = BigO.svg;
  var mount = document.getElementById('visualizer-mount'); if (!mount) return;

  // ---------- Data ----------
  function randomArray(n) {                          // distinct values 5..99
    var pool = []; for (var v = 5; v < 100; v += 1) pool.push(v);
    return BigO.shuffle(pool).slice(0, n);
  }

  // ---------- Frame builders ----------
  // A frame is { kind, arr, marks, msg, stats, ... }. marks maps index -> role.
  function bubbleFrames(input) {
    var a = input.slice(), n = a.length, f = [], c = 0, sw = 0, sorted = {};
    function snap(marks, msg) { f.push({ kind: 'bars', arr: a.slice(), marks: Object.assign({}, sorted, marks), msg: msg, stats: { Comparisons: c, Swaps: sw } }); }
    snap({}, 'Start. Bubble sort compares neighbors and swaps them if they are out of order.');
    for (var pass = 0; pass < n - 1; pass++) {
      var swapped = false;
      for (var i = 0; i < n - 1 - pass; i++) {
        c++;
        var m = {}; m[i] = 'compare'; m[i + 1] = 'compare';
        snap(m, 'Compare ' + a[i] + ' and ' + a[i + 1] + '.' + (a[i] > a[i + 1] ? ' Out of order, so swap.' : ' Already in order.'));
        if (a[i] > a[i + 1]) {
          var t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; sw++; swapped = true;
          var m2 = {}; m2[i] = 'swap'; m2[i + 1] = 'swap';
          snap(m2, 'Swapped. ' + a[i] + ' is now before ' + a[i + 1] + '.');
        }
      }
      sorted[n - 1 - pass] = 'sorted';
      if (!swapped) {
        for (var k = 0; k < n; k++) sorted[k] = 'sorted';
        snap({}, 'No swaps in that pass, so the array is sorted. This early exit is why the best case is O(n).');
        return f;
      }
      snap({}, 'Pass ' + (pass + 1) + ' done. ' + a[n - 1 - pass] + ' is in its final place.');
    }
    for (var j = 0; j < n; j++) sorted[j] = 'sorted';
    snap({}, 'Sorted after ' + c + ' comparisons and ' + sw + ' swaps.');
    return f;
  }

  function mergeFrames(input) {
    var a = input.slice(), n = a.length, f = [], c = 0, w = 0;
    function snap(marks, msg) { f.push({ kind: 'bars', arr: a.slice(), marks: marks, msg: msg, stats: { Comparisons: c, Writes: w } }); }
    snap({}, 'Start. Merge sort splits the array in half, sorts each half, then merges them.');
    function range(lo, hi, role) { var m = {}; for (var i = lo; i < hi; i++) m[i] = role || 'range'; return m; }
    function sort(lo, hi) {
      if (hi - lo < 2) return;
      var mid = (lo + hi) >> 1;
      snap(range(lo, hi), 'Split positions ' + lo + ' to ' + (hi - 1) + ' into two halves.');
      sort(lo, mid); sort(mid, hi);
      var left = a.slice(lo, mid), right = a.slice(mid, hi), i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        c++;
        var takeLeft = left[i] <= right[j];
        var v = takeLeft ? left[i++] : right[j++];
        a[k] = v; w++;
        var m = range(lo, hi); m[k] = 'swap';
        snap(m, 'Merge: the smaller front item is ' + v + '. Write it to position ' + k + '.');
        k++;
      }
      while (i < left.length) { a[k] = left[i++]; w++; var m1 = range(lo, hi); m1[k] = 'swap'; snap(m1, 'Copy the leftover ' + a[k] + ' to position ' + k + '.'); k++; }
      while (j < right.length) { a[k] = right[j++]; w++; var m2 = range(lo, hi); m2[k] = 'swap'; snap(m2, 'Copy the leftover ' + a[k] + ' to position ' + k + '.'); k++; }
    }
    sort(0, n);
    var done = {}; for (var x = 0; x < n; x++) done[x] = 'sorted';
    snap(done, 'Sorted after ' + c + ' comparisons and ' + w + ' writes. Merging needs a temporary buffer, so space is O(n).');
    return f;
  }

  function linearFrames(input, target) {
    var a = input, f = [], c = 0, n = a.length;
    function snap(marks, msg) { f.push({ kind: 'cells', arr: a, marks: marks, msg: msg, stats: { Comparisons: c }, target: target }); }
    snap({}, 'Start. Look for ' + target + ' by checking each item from the left.');
    for (var i = 0; i < n; i++) {
      c++;
      var m = {}; for (var k = 0; k < i; k++) m[k] = 'out'; m[i] = 'compare';
      if (a[i] === target) { m[i] = 'found'; snap(m, 'Position ' + i + ' holds ' + target + '. Found after ' + c + ' comparisons.'); return f; }
      snap(m, 'Position ' + i + ' holds ' + a[i] + ', not ' + target + '. Move on.');
    }
    var all = {}; for (var j = 0; j < n; j++) all[j] = 'out';
    snap(all, target + ' is not in the array. That took all ' + c + ' comparisons.');
    return f;
  }

  function binaryFrames(input, target) {
    var a = input.slice().sort(function (x, y) { return x - y; }), f = [], c = 0;
    function snap(lo, hi, mid, role, msg) {
      var m = {};
      for (var i = 0; i < a.length; i++) if (i < lo || i > hi) m[i] = 'out'; else m[i] = 'range';
      if (mid != null) m[mid] = role || 'mid';
      f.push({ kind: 'cells', arr: a, marks: m, msg: msg, stats: { Comparisons: c }, target: target });
    }
    var lo = 0, hi = a.length - 1;
    snap(lo, hi, null, null, 'Start. The array is sorted. Look for ' + target + ' in positions ' + lo + ' to ' + hi + '.');
    while (lo <= hi) {
      var mid = (lo + hi) >> 1; c++;
      if (a[mid] === target) { snap(lo, hi, mid, 'found', 'Middle is position ' + mid + ', which holds ' + target + '. Found after ' + c + ' comparisons.'); return f; }
      if (a[mid] < target) {
        snap(lo, hi, mid, 'mid', 'Middle holds ' + a[mid] + ', which is less than ' + target + '. Discard the left half.');
        lo = mid + 1;
      } else {
        snap(lo, hi, mid, 'mid', 'Middle holds ' + a[mid] + ', which is greater than ' + target + '. Discard the right half.');
        hi = mid - 1;
      }
      if (lo <= hi) snap(lo, hi, null, null, 'Now search positions ' + lo + ' to ' + hi + '.');
    }
    var m = {}; for (var i = 0; i < a.length; i++) m[i] = 'out';
    f.push({ kind: 'cells', arr: a, marks: m, msg: target + ' is not in the array. The range is empty after ' + c + ' comparisons.', stats: { Comparisons: c }, target: target });
    return f;
  }

  // Fixed graph so the layout is predictable and readable.
  var G = {
    nodes: [
      { id: 'A', x: 70, y: 150 }, { id: 'B', x: 190, y: 70 }, { id: 'C', x: 190, y: 230 },
      { id: 'D', x: 320, y: 40 }, { id: 'E', x: 320, y: 140 }, { id: 'F', x: 320, y: 250 },
      { id: 'G', x: 450, y: 190 }, { id: 'H', x: 570, y: 130 }
    ],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['E', 'G'], ['F', 'G'], ['G', 'H'], ['E', 'D']]
  };
  var ADJ = {};
  G.nodes.forEach(function (n) { ADJ[n.id] = []; });
  G.edges.forEach(function (e) { ADJ[e[0]].push(e[1]); ADJ[e[1]].push(e[0]); });
  Object.keys(ADJ).forEach(function (k) { ADJ[k].sort(); });

  function graphFrames(kind) {
    var f = [], state = {}, order = [], edges = 0, depth = { A: 0 };
    G.nodes.forEach(function (n) { state[n.id] = 'unseen'; });
    function snap(msg, cur, list, listLabel) {
      f.push({ kind: 'graph', state: Object.assign({}, state), cur: cur, list: list.slice(), listLabel: listLabel,
        order: order.slice(), depth: Object.assign({}, depth), msg: msg, stats: { Visited: order.length, 'Edges checked': edges } });
    }
    if (kind === 'bfs') {
      var q = ['A']; state.A = 'frontier';
      snap('Start at A. BFS uses a queue: the oldest discovered node is processed first.', null, q, 'Queue');
      while (q.length) {
        var u = q.shift(); state[u] = 'current'; order.push(u);
        snap('Dequeue ' + u + ' and look at its neighbors.', u, q, 'Queue');
        ADJ[u].forEach(function (v) {
          edges++;
          if (state[v] === 'unseen') { state[v] = 'frontier'; depth[v] = depth[u] + 1; q.push(v); snap('Neighbor ' + v + ' is new. Add it to the queue at distance ' + depth[v] + '.', u, q, 'Queue'); }
        });
        state[u] = 'done';
        snap('Finished ' + u + '.', null, q, 'Queue');
      }
      snap('Done. BFS visited nodes in order of distance from A: ' + order.join(', ') + '. Each node and edge was handled once, so the cost is O(V + E).', null, q, 'Queue');
    } else {
      var stack = [];
      var dfs = function (u) {
        state[u] = 'current'; order.push(u); stack.push(u);
        snap('Visit ' + u + ' and go deeper into its first unvisited neighbor.', u, stack, 'Call stack');
        ADJ[u].forEach(function (v) {
          edges++;
          if (state[v] === 'unseen') { dfs(v); state[u] = 'current'; snap('Back at ' + u + '. Try its next neighbor.', u, stack, 'Call stack'); }
        });
        state[u] = 'done'; stack.pop();
        snap('Finished ' + u + '. Backtrack.', stack.length ? stack[stack.length - 1] : null, stack, 'Call stack');
      };
      snap('Start at A. DFS follows one path as far as it can, then backtracks.', null, [], 'Call stack');
      dfs('A');
      snap('Done. DFS visited nodes in this order: ' + order.join(', ') + '. Each node and edge was handled once, so the cost is O(V + E).', null, [], 'Call stack');
    }
    return f;
  }

  var ALGOS = [
    { id: 'linear-search', label: 'Linear search', kind: 'search', entry: 'linear-search', time: 'O(n)', space: 'O(1)', build: linearFrames },
    { id: 'binary-search', label: 'Binary search', kind: 'search', entry: 'binary-search', time: 'O(log n)', space: 'O(1) iterative', build: binaryFrames },
    { id: 'bubble-sort', label: 'Bubble sort', kind: 'sort', entry: null, time: 'O(n²), O(n) best with early exit', space: 'O(1)', build: bubbleFrames },
    { id: 'merge-sort', label: 'Merge sort', kind: 'sort', entry: 'mergesort', time: 'O(n log n)', space: 'O(n)', build: mergeFrames },
    { id: 'bfs', label: 'Breadth-first search', kind: 'graph', entry: 'bfs', time: 'O(V + E)', space: 'O(V)', build: function () { return graphFrames('bfs'); } },
    { id: 'dfs', label: 'Depth-first search', kind: 'graph', entry: 'dfs', time: 'O(V + E)', space: 'O(V)', build: function () { return graphFrames('dfs'); } }
  ];

  // ---------- UI ----------
  var root = el('div', 'viz'); root.setAttribute('role', 'region'); root.setAttribute('aria-label', 'Algorithm visualizer'); root.tabIndex = -1;
  var bar = el('div', 'pg-controls');
  function fld(label, node, id) { var d = el('div', 'pg-field'); var l = el('label', null, label); l.setAttribute('for', id); node.id = id; d.appendChild(l); d.appendChild(node); return d; }
  var algoSel = el('select'); ALGOS.forEach(function (a) { var o = el('option', null, a.label); o.value = a.id; algoSel.appendChild(o); });
  var sizeSel = el('select'); [6, 10, 14].forEach(function (n) { var o = el('option', null, n + ' items'); o.value = String(n); if (n === 10) o.selected = true; sizeSel.appendChild(o); });
  var tgtSel = el('select'); [['in', 'In the array'], ['out', 'Not in the array']].forEach(function (p) { var o = el('option', null, p[1]); o.value = p[0]; tgtSel.appendChild(o); });
  var speedSel = el('select'); [['1100', 'Slow'], ['600', 'Medium'], ['250', 'Fast']].forEach(function (p) { var o = el('option', null, p[1]); o.value = p[0]; if (p[0] === '600') o.selected = true; speedSel.appendChild(o); });
  var fAlgo = fld('Algorithm', algoSel, 'viz-algo'), fSize = fld('Size', sizeSel, 'viz-size'), fTgt = fld('Search target', tgtSel, 'viz-target'), fSpeed = fld('Speed', speedSel, 'viz-speed');
  [fAlgo, fSize, fTgt, fSpeed].forEach(function (x) { bar.appendChild(x); });

  var btns = el('div', 'viz-buttons'); btns.setAttribute('role', 'group'); btns.setAttribute('aria-label', 'Playback');
  function mk(label, aria) { var b = el('button', 'btn', label); b.type = 'button'; if (aria) b.setAttribute('aria-label', aria); return b; }
  var bBack = mk('Back'), bPlay = mk('Play'), bStep = mk('Step'), bReset = mk('Restart'), bNew = mk('New data');
  [bBack, bPlay, bStep, bReset, bNew].forEach(function (b) { btns.appendChild(b); });

  var reducedNote = el('p', 'footnotes');
  var meta = el('p', 'viz-meta');
  var stage = el('div', 'chart viz-stage');
  var svg = svgEl('svg', { viewBox: '0 0 640 320', role: 'img' });
  stage.appendChild(svg);
  var list = el('p', 'viz-list');
  var msg = el('p', 'viz-msg'); msg.setAttribute('role', 'status');
  var stats = el('p', 'viz-stats');
  var prog = el('p', 'viz-progress');
  var legend = el('ul', 'viz-legend'); legend.setAttribute('aria-label', 'What the colors and outlines mean');

  [bar, btns, reducedNote, meta, stage, list, msg, stats, prog, legend].forEach(function (n) { root.appendChild(n); });
  mount.appendChild(root);

  var frames = [], idx = 0, timer = null, data = [], algo = ALGOS[0], target = 0;
  var reduced = BigO.reducedMotion();
  if (reduced) { reducedNote.textContent = 'Reduced motion is on in your system settings. Playback is slower and the visualizer never moves on its own until you press Play. Use Step and Back to go one move at a time.'; }

  var LEGEND = {
    sort: [['compare', 'Being compared'], ['swap', 'Just swapped or written'], ['range', 'Part being merged'], ['sorted', 'In final position']],
    search: [['compare', 'Being checked'], ['mid', 'Middle of the range'], ['range', 'Still in play'], ['out', 'Ruled out'], ['found', 'Found']],
    graph: [['frontier', 'Discovered, not yet processed'], ['current', 'Being processed'], ['done', 'Finished']]
  };
  function paintLegend() {
    legend.textContent = '';
    LEGEND[algo.kind].forEach(function (p) {
      var li = el('li'); var sw = el('span', 'viz-sw viz-' + p[0]); sw.setAttribute('aria-hidden', 'true'); li.appendChild(sw); li.appendChild(document.createTextNode(p[1])); legend.appendChild(li);
    });
  }

  function newData() {
    var n = parseInt(sizeSel.value, 10);
    data = randomArray(n);
    if (algo.kind === 'search') {
      var pick = data[Math.floor(Math.random() * n)];
      if (tgtSel.value === 'out') { do { pick = 5 + Math.floor(Math.random() * 95); } while (data.indexOf(pick) >= 0); }
      target = pick;
    }
  }
  function build() {
    stop();
    frames = algo.kind === 'search' ? algo.build(data, target) : algo.kind === 'sort' ? algo.build(data) : algo.build();
    idx = 0;
    draw();
  }
  function configure() {
    algo = ALGOS.filter(function (a) { return a.id === algoSel.value; })[0];
    fSize.style.display = algo.kind === 'graph' ? 'none' : '';
    fTgt.style.display = algo.kind === 'search' ? '' : 'none';
    bNew.style.display = algo.kind === 'graph' ? 'none' : '';
    meta.textContent = '';
    meta.appendChild(el('strong', null, 'Time: ')); meta.appendChild(document.createTextNode(algo.time + '. '));
    meta.appendChild(el('strong', null, 'Auxiliary space: ')); meta.appendChild(document.createTextNode(algo.space + '. '));
    if (algo.entry && BigO.entryById(algo.entry)) { var a = el('a', null, 'Open the card'); a.href = '#algo=' + algo.entry; meta.appendChild(a); }
    paintLegend();
  }

  // ---------- Drawing ----------
  function drawBars(fr) {
    var n = fr.arr.length, W = 640, H = 320, pad = 24, bw = (W - pad * 2) / n, max = 100;
    fr.arr.forEach(function (v, i) {
      var h = v / max * (H - 70), x = pad + i * bw, role = fr.marks[i] || '';
      var g = svgEl('g', { 'class': 'viz-item ' + (role ? 'viz-' + role : '') });
      g.appendChild(svgEl('rect', { x: x + 3, y: H - 30 - h, width: bw - 6, height: h, rx: 2 }));
      g.appendChild(svgEl('text', { x: x + bw / 2, y: H - 34 - h, 'text-anchor': 'middle', 'class': 'viz-num' }, String(v)));
      g.appendChild(svgEl('text', { x: x + bw / 2, y: H - 12, 'text-anchor': 'middle', 'class': 'viz-idx' }, String(i)));
      svg.appendChild(g);
    });
  }
  function drawCells(fr) {
    var n = fr.arr.length, W = 640, pad = 16, cw = (W - pad * 2) / n, y = 120;
    svg.appendChild(svgEl('text', { x: W / 2, y: 50, 'text-anchor': 'middle', 'class': 'viz-target' }, 'Target: ' + fr.target));
    fr.arr.forEach(function (v, i) {
      var x = pad + i * cw, role = fr.marks[i] || '';
      var g = svgEl('g', { 'class': 'viz-item ' + (role ? 'viz-' + role : '') });
      g.appendChild(svgEl('rect', { x: x + 2, y: y, width: cw - 4, height: 64, rx: 4 }));
      g.appendChild(svgEl('text', { x: x + cw / 2, y: y + 40, 'text-anchor': 'middle', 'class': 'viz-num viz-num-in' }, String(v)));
      g.appendChild(svgEl('text', { x: x + cw / 2, y: y + 88, 'text-anchor': 'middle', 'class': 'viz-idx' }, String(i)));
      svg.appendChild(g);
    });
  }
  function drawGraph(fr) {
    G.edges.forEach(function (e) {
      var a = G.nodes.filter(function (n) { return n.id === e[0]; })[0], b = G.nodes.filter(function (n) { return n.id === e[1]; })[0];
      svg.appendChild(svgEl('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'class': 'viz-edge' }));
    });
    G.nodes.forEach(function (n) {
      var st = fr.state[n.id];
      var g = svgEl('g', { 'class': 'viz-item viz-' + (st === 'unseen' ? '' : st) });
      g.appendChild(svgEl('circle', { cx: n.x, cy: n.y, r: 22 }));
      g.appendChild(svgEl('text', { x: n.x, y: n.y + 5, 'text-anchor': 'middle', 'class': 'viz-num viz-num-in' }, n.id));
      if (algo.id === 'bfs' && fr.depth[n.id] != null && st !== 'unseen') g.appendChild(svgEl('text', { x: n.x, y: n.y + 40, 'text-anchor': 'middle', 'class': 'viz-idx' }, 'dist ' + fr.depth[n.id]));
      svg.appendChild(g);
    });
  }

  function label(fr) {
    if (fr.kind === 'graph') {
      return fr.msg + ' Visited so far: ' + (fr.order.join(', ') || 'none') + '. ' + fr.listLabel + ': ' + (fr.list.join(', ') || 'empty') + '.';
    }
    var roles = [];
    Object.keys(fr.marks).forEach(function (k) { if (fr.marks[k] && fr.marks[k] !== 'out' && fr.marks[k] !== 'range' && fr.marks[k] !== 'sorted') roles.push(fr.marks[k] + ' at position ' + k); });
    return fr.msg + ' Array: ' + fr.arr.join(', ') + '.' + (roles.length ? ' Highlighted: ' + roles.join('; ') + '.' : '');
  }

  function draw() {
    var fr = frames[idx];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('class', 'viz-svg viz-kind-' + fr.kind);
    svg.setAttribute('viewBox', '0 0 640 ' + (fr.kind === 'cells' ? 230 : fr.kind === 'graph' ? 290 : 320));
    if (fr.kind === 'bars') drawBars(fr); else if (fr.kind === 'cells') drawCells(fr); else drawGraph(fr);
    svg.setAttribute('aria-label', label(fr));
    msg.textContent = fr.msg;
    stats.textContent = Object.keys(fr.stats).map(function (k) { return k + ': ' + fr.stats[k]; }).join('   ');
    list.textContent = fr.kind === 'graph' ? fr.listLabel + ': ' + (fr.list.length ? fr.list.join(', ') : 'empty') + '   Visit order: ' + (fr.order.join(', ') || 'none yet') : '';
    prog.textContent = 'Step ' + (idx + 1) + ' of ' + frames.length;
    bBack.disabled = idx === 0;
    bStep.disabled = idx === frames.length - 1;
    bPlay.textContent = timer ? 'Pause' : (idx === frames.length - 1 ? 'Replay' : 'Play');
    msg.setAttribute('aria-live', timer ? 'off' : 'polite');
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function play() {
    if (timer) { stop(); draw(); return; }
    if (idx === frames.length - 1) idx = 0;
    var delay = parseInt(speedSel.value, 10); if (reduced) delay = Math.max(delay, 900);
    timer = setInterval(function () {
      if (idx < frames.length - 1) { idx++; draw(); } else { stop(); draw(); BigO.announce(frames[idx].msg); }
    }, delay);
    draw();
  }
  function step(d) { stop(); idx = Math.max(0, Math.min(frames.length - 1, idx + d)); draw(); }

  bPlay.addEventListener('click', play);
  bStep.addEventListener('click', function () { step(1); });
  bBack.addEventListener('click', function () { step(-1); });
  bReset.addEventListener('click', function () { stop(); idx = 0; draw(); });
  bNew.addEventListener('click', function () { newData(); build(); });
  algoSel.addEventListener('change', function () { configure(); newData(); build(); });
  sizeSel.addEventListener('change', function () { newData(); build(); });
  tgtSel.addEventListener('change', function () { newData(); build(); });
  speedSel.addEventListener('change', function () { if (timer) { stop(); play(); } });

  root.addEventListener('keydown', function (ev) {
    var t = ev.target.tagName;
    if (t === 'SELECT' || t === 'INPUT' || t === 'TEXTAREA') return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
    else if (ev.key === ' ' && t !== 'BUTTON') { ev.preventDefault(); play(); }
  });

  // Expose a small hook for the tests and for other features.
  BigO.visualizer = { frames: function () { return frames; }, select: function (id) { algoSel.value = id; algoSel.dispatchEvent(new Event('change')); } };

  configure(); newData(); build();
  BigO.onEntries(configure);   // adds the card link once entries exist
})();
