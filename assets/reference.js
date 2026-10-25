/* Complexity lookup and DSA roadmap. Plain script, no build step. */
(function () {
  'use strict';
  var BigO = window.BigO, el = BigO.el;

  // ---------- Lookup data ----------
  // Each row states best, average, and worst time, auxiliary space, the assumption
  // behind the average case, and the implementation caveat people trip over.
  // "entry" is the id of the matching card, if there is one.
  var LOOKUP = [
    { name: 'Array index (read or write)', group: 'Arrays', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)', assume: 'Random access into contiguous memory.', caveat: 'Linked lists have no O(1) index. Reaching position k takes O(k).', entry: 'dynamic-array', alias: 'access get list' },
    { name: 'Dynamic array append', group: 'Arrays', best: 'O(1)', avg: 'O(1) amortized', worst: 'O(n) on a resize', space: 'O(1) amortized extra', assume: 'Capacity grows by a constant factor, such as 1.5× or 2×.', caveat: 'A single append can copy the whole array. Growing by a fixed amount instead of a factor makes appends O(n) amortized.', entry: 'dynamic-array', alias: 'push add list arraylist vector' },
    { name: 'Dynamic array insert or delete in the middle', group: 'Arrays', best: 'O(1) at the end', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', assume: 'Elements after the position shift by one.', caveat: 'Inserting at the front is the worst position. A deque or linked list is better for front operations.', entry: 'dynamic-array', alias: 'insert remove pop shift unshift' },
    { name: 'Linear search', group: 'Searching', best: 'O(1) if first', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', assume: 'Target equally likely to be anywhere, or absent.', caveat: 'Works on unsorted data and any sequence, including linked lists.', entry: 'linear-search', alias: 'find scan contains in' },
    { name: 'Binary search', group: 'Searching', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1) iterative; O(log n) recursive', assume: 'Input is sorted and supports O(1) random access.', caveat: 'Sorting first costs O(n log n). On a linked list the middle element costs O(n) to reach, so there is no speedup.', entry: 'binary-search', alias: 'bisect lower_bound sorted' },
    { name: 'Hash table lookup, insert, delete', group: 'Hash tables', best: 'O(1)', avg: 'O(1) expected', worst: 'O(n)', space: 'O(n)', assume: 'A hash function that spreads keys evenly, and a bounded load factor.', caveat: 'Resizing makes one insert O(n), amortized O(1). Adversarial keys can force collisions. Iteration order is not sorted.', entry: 'hash-table', alias: 'dict set map unordered_map hashmap' },
    { name: 'Linked list insert or delete at a known node', group: 'Linked lists', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)', assume: 'You already hold a pointer to the node (or its predecessor for a singly linked list).', caveat: 'Finding the node first is O(n).', entry: 'linked-list', alias: 'node pointer' },
    { name: 'Linked list search', group: 'Linked lists', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', assume: 'Target equally likely to be anywhere.', caveat: 'Poor cache locality makes it slower than an array scan of the same size.', entry: 'linked-list', alias: 'find traverse' },
    { name: 'Stack push, pop, peek', group: 'Stacks and queues', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)', assume: 'Backed by a dynamic array or linked list. Push is amortized O(1) with an array.', caveat: 'Only the top is accessible.', entry: 'stack', alias: 'lifo' },
    { name: 'Queue enqueue and dequeue', group: 'Stacks and queues', best: 'O(1)', avg: 'O(1)', worst: 'O(1) with a deque; O(n) per dequeue with a shifting array', space: 'O(1)', assume: 'Backed by a deque, circular buffer, or linked list.', caveat: 'Python list.pop(0) and JavaScript Array.shift can be O(n). Use collections.deque in Python.', entry: 'queue-deque', alias: 'fifo deque' },
    { name: 'Binary search tree search, insert, delete', group: 'Trees', best: 'O(1)', avg: 'O(log n)', worst: 'O(n)', space: 'O(1) iterative; O(h) recursive', assume: 'Average assumes keys inserted in random order. Cost is O(h) for tree height h.', caveat: 'Inserting sorted keys makes the tree a chain, and every operation O(n).', entry: 'bst', alias: 'bst tree' },
    { name: 'Balanced BST search, insert, delete', group: 'Trees', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1) extra per operation', assume: 'Height is kept at O(log n) by rotations, as in AVL and red-black trees.', caveat: 'Python has no built-in balanced tree. Java TreeMap and C++ std::map are red-black trees.', entry: 'balanced-bst', alias: 'avl red-black treemap std::map' },
    { name: 'Binary heap peek', group: 'Heaps', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)', assume: 'Reads the root only.', caveat: 'Finding any other element is O(n).', entry: 'binary-heap', alias: 'priority queue top min max' },
    { name: 'Binary heap push', group: 'Heaps', best: 'O(1)', avg: 'O(1) for random keys', worst: 'O(log n)', space: 'O(1) extra', assume: 'Average assumes random keys. The new item usually stays near the bottom.', caveat: 'Plan for O(log n) in interviews unless you can justify the average case.', entry: 'binary-heap', alias: 'insert offer heappush' },
    { name: 'Binary heap pop', group: 'Heaps', best: 'O(1) if all keys are equal', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1) extra', assume: 'The last item moves to the root and sifts down.', caveat: 'Removing an arbitrary item is O(n) to find, then O(log n) to fix.', entry: 'binary-heap', alias: 'poll extract heappop remove' },
    { name: 'Build a heap from n items (heapify)', group: 'Heaps', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1) in place', assume: 'Bottom-up sift down, not n separate pushes.', caveat: 'Pushing n items one at a time is O(n log n).', entry: 'binary-heap', alias: 'heapify build' },
    { name: 'Bubble sort', group: 'Sorting', best: 'O(n) with an early exit', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', assume: 'Compares and swaps adjacent items. Stable.', caveat: 'The O(n) best case needs a "no swaps in this pass" check. Rarely used outside teaching.', entry: null, alias: 'sort' },
    { name: 'Insertion sort', group: 'Sorting', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', assume: 'Best case is already-sorted input. Stable.', caveat: 'Fast on small or nearly sorted arrays, which is why hybrid sorts use it for small runs.', entry: null, alias: 'sort' },
    { name: 'Selection sort', group: 'Sorting', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', assume: 'Always scans the unsorted part for the minimum. Not stable in the usual version.', caveat: 'Does at most n−1 swaps, which matters only when writes are expensive.', entry: null, alias: 'sort' },
    { name: 'Merge sort', group: 'Sorting', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', assume: 'Array version with a merge buffer. Stable.', caveat: 'A linked-list version needs only O(log n) stack space.', entry: 'mergesort', alias: 'sort divide conquer' },
    { name: 'Quicksort', group: 'Sorting', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n) average stack', assume: 'Average assumes a pivot that splits input reasonably, such as a random pivot. Not stable.', caveat: 'A first-element pivot on sorted input is the classic worst case. Recurse into the smaller half first to bound the stack at O(log n).', entry: 'quicksort', alias: 'sort pivot partition' },
    { name: 'Heapsort', group: 'Sorting', best: 'O(n log n) for distinct keys', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', assume: 'In place. Not stable.', caveat: 'Slower in practice than quicksort because of poor cache locality.', entry: 'heapsort', alias: 'sort' },
    { name: 'Counting sort', group: 'Sorting', best: 'O(n + k)', avg: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)', assume: 'Integer keys in a known range of size k. Stable in the standard version.', caveat: 'If k is much larger than n, this is slower than a comparison sort.', entry: 'counting-sort', alias: 'sort radix bucket' },
    { name: 'Built-in sort (Python sorted, list.sort)', group: 'Sorting', best: 'O(n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', assume: 'Timsort. Stable. Runs of already-sorted data are detected.', caveat: 'Java sorts objects with the same Timsort idea and primitives with dual-pivot quicksort. JavaScript Array.sort is stable since ES2019.', entry: 'python-sort', alias: 'timsort sorted arrays.sort' },
    { name: 'Breadth-first search', group: 'Graphs', best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', assume: 'Adjacency list. Stops early only if you return when the target is found.', caveat: 'With an adjacency matrix, enumerating neighbors makes it O(V²).', entry: 'bfs', alias: 'shortest path unweighted level order' },
    { name: 'Depth-first search', group: 'Graphs', best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', assume: 'Adjacency list. Space is the recursion depth plus the visited set.', caveat: 'Recursive DFS can overflow the stack on deep graphs. Use an explicit stack.', entry: 'dfs', alias: 'cycle topological' },
    { name: 'Dijkstra shortest path', group: 'Graphs', best: 'O((V + E) log V)', avg: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V)', assume: 'Binary heap and an adjacency list. Non-negative edge weights only.', caveat: 'Negative weights give wrong answers. With a Fibonacci heap it is O(E + V log V).', entry: 'dijkstra', alias: 'shortest path weighted' },
    { name: 'Bellman-Ford shortest path', group: 'Graphs', best: 'O(E) with an early exit', avg: 'O(V · E)', worst: 'O(V · E)', space: 'O(V)', assume: 'Relaxes every edge up to V−1 times.', caveat: 'Handles negative weights and detects negative cycles.', entry: 'bellman-ford', alias: 'negative weights' },
    { name: 'Kruskal minimum spanning tree', group: 'Graphs', best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)', assume: 'Sort edges, then use Union-Find. Sorting dominates.', caveat: 'O(E log E) equals O(E log V) because E is at most V².', entry: 'kruskal', alias: 'mst spanning tree' },
    { name: 'Prim minimum spanning tree', group: 'Graphs', best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)', assume: 'Binary heap and an adjacency list.', caveat: 'With an array and no heap it is O(V²), which can win on dense graphs.', entry: 'prim', alias: 'mst spanning tree' },
    { name: 'Union-Find find and union', group: 'Graphs', best: 'O(1)', avg: 'O(α(n)) amortized', worst: 'O(α(n)) amortized', space: 'O(n)', assume: 'Union by rank or size, plus path compression.', caveat: 'Without both optimizations, a single operation can cost O(n). α(n) is at most 4 for any practical n.', entry: 'union-find', alias: 'disjoint set dsu' },
    { name: 'Tree traversal (in-order, pre-order, post-order, level-order)', group: 'Trees', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h) stack; O(w) for level-order', assume: 'Visits each node once. h is height, w is the widest level.', caveat: 'A skewed tree has h = n, so the recursion stack is O(n).', entry: 'tree-traversal', alias: 'inorder preorder postorder level' },
    { name: 'Trie insert and search', group: 'Trees', best: 'O(m)', avg: 'O(m)', worst: 'O(m)', space: 'O(total characters)', assume: 'm is the length of the key. Children stored in arrays or hash maps.', caveat: 'Independent of the number of stored keys, but can use a lot of memory.', entry: 'trie', alias: 'prefix autocomplete' },
    { name: 'Prefix sums', group: 'Patterns', best: 'O(n) build, O(1) query', avg: 'O(n) build, O(1) query', worst: 'O(n) build, O(1) query', space: 'O(n)', assume: 'The array is not modified between queries.', caveat: 'Updates make this O(n) each. Use a Fenwick tree or segment tree for mixed updates and queries.', entry: 'prefix-sums', alias: 'range sum cumulative' },
    { name: 'Two pointers and sliding window', group: 'Patterns', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1) or O(k)', assume: 'Each pointer only moves forward, so total moves are at most 2n.', caveat: 'A window that tracks counts needs O(k) space for k distinct values.', entry: 'sliding-window', alias: 'window pointers' }
  ];
  BigO.LOOKUP = LOOKUP;

  // ---------- Lookup UI ----------
  function buildLookup() {
    var mount = document.getElementById('lookup-mount'); if (!mount) return;
    var wrap = el('div', 'lookup');
    var label = el('label', null, 'Operation or algorithm'); label.setAttribute('for', 'lookup-q');
    var input = el('input'); input.id = 'lookup-q'; input.type = 'search'; input.autocomplete = 'off';
    input.placeholder = 'Try heap pop, quicksort, or hash lookup';
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'lookup-list'); input.setAttribute('aria-autocomplete', 'list');
    var list = el('ul', 'lookup-list'); list.id = 'lookup-list'; list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Matching operations');
    var detail = el('div', 'lookup-detail'); detail.setAttribute('aria-live', 'polite');
    wrap.appendChild(label); wrap.appendChild(input); wrap.appendChild(list); wrap.appendChild(detail);
    mount.appendChild(wrap);

    var shown = [], active = -1, chosen = 0;
    LOOKUP.forEach(function (r) { r.hay = (r.name + ' ' + r.group + ' ' + (r.alias || '')).toLowerCase(); });

    function match(q) {
      q = q.trim().toLowerCase();
      if (!q) return LOOKUP.slice(0, 8);
      var toks = q.split(/\s+/);
      return LOOKUP.filter(function (r) {
        return toks.every(function (t) {
          var esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp('(^|[^a-z0-9])' + esc).test(r.hay);
        });
      });
    }

    function row(label, value) {
      var tr = el('tr'); var th = el('th', null, label); th.scope = 'row';
      tr.appendChild(th); tr.appendChild(el('td', null, value)); return tr;
    }

    function showDetail(r) {
      detail.textContent = '';
      if (!r) { detail.appendChild(el('p', 'empty', 'Nothing matches. Try a shorter search, such as "sort" or "heap".')); return; }
      var h = el('h3', null, r.name); h.style.marginTop = '0';
      detail.appendChild(h);
      var tw = el('div', 'table-wrap'); tw.setAttribute('role', 'region'); tw.setAttribute('aria-label', 'Complexity for ' + r.name); tw.tabIndex = 0;
      var t = el('table', 'table lookup-table');
      var body = el('tbody');
      body.appendChild(row('Best case', r.best)); body.appendChild(row('Average case', r.avg));
      body.appendChild(row('Worst case', r.worst)); body.appendChild(row('Auxiliary space', r.space));
      t.appendChild(body); tw.appendChild(t); detail.appendChild(tw);
      var a = el('p'); a.appendChild(el('strong', null, 'Assumptions: ')); a.appendChild(document.createTextNode(r.assume)); detail.appendChild(a);
      var c = el('p'); c.appendChild(el('strong', null, 'Watch out for: ')); c.appendChild(document.createTextNode(r.caveat)); detail.appendChild(c);
      var links = el('div', 'links');
      if (r.entry && BigO.entryById(r.entry)) {
        var go = el('a', null, 'Open the full card'); go.href = '#algo=' + r.entry; links.appendChild(go);
      }
      var cp = el('button', 'btn btn-sm', 'Copy as text'); cp.type = 'button';
      cp.addEventListener('click', function () {
        BigO.copyText(r.name + '\nBest: ' + r.best + '\nAverage: ' + r.avg + '\nWorst: ' + r.worst + '\nSpace: ' + r.space + '\nAssumptions: ' + r.assume + '\nCaveat: ' + r.caveat, cp);
      });
      links.appendChild(cp);
      detail.appendChild(links);
    }

    function paint() {
      list.textContent = '';
      shown.forEach(function (r, i) {
        var li = el('li', null, r.name); li.setAttribute('role', 'option'); li.id = 'lookup-opt-' + i;
        li.setAttribute('aria-selected', i === chosen ? 'true' : 'false');
        if (i === active) li.classList.add('is-active');
        li.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
        li.addEventListener('click', function () { choose(i); });
        var g = el('span', 'lookup-group', r.group); li.appendChild(g);
        list.appendChild(li);
      });
      input.setAttribute('aria-expanded', shown.length ? 'true' : 'false');
      if (active >= 0) input.setAttribute('aria-activedescendant', 'lookup-opt-' + active); else input.removeAttribute('aria-activedescendant');
    }
    function choose(i) { chosen = i; active = i; paint(); showDetail(shown[i]); }
    function refresh() {
      shown = match(input.value).slice(0, 8); chosen = 0; active = shown.length ? 0 : -1;
      paint(); showDetail(shown[0]);
    }
    input.addEventListener('input', refresh);
    input.addEventListener('keydown', function (ev) {
      if (!shown.length) return;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); active = (active + 1) % shown.length; paint(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); active = (active - 1 + shown.length) % shown.length; paint(); }
      else if (ev.key === 'Enter') { ev.preventDefault(); choose(Math.max(active, 0)); }
    });
    refresh();
  }

  // ---------- Roadmap ----------
  function buildRoadmap() {
    var mount = document.getElementById('roadmap-mount'); if (!mount) return;
    var data = window.BIGO_DATA.ROADMAP;
    var summary = el('p', 'progress-summary'); summary.setAttribute('role', 'status');
    var bar = el('div', 'progress-bar'); var fill = el('div', 'progress-fill'); bar.appendChild(fill);
    bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', 'Topics learned'); bar.setAttribute('aria-valuemin', '0');
    var note = el('p', 'footnotes');
    var grid = el('div', 'roadmap');
    mount.appendChild(summary); mount.appendChild(bar); mount.appendChild(note); mount.appendChild(grid);

    var order = 0;
    var total = 0;
    var boxes = [];
    data.forEach(function (lvl) {
      var sec = el('section', 'road-level');
      var h = el('h3', null, lvl.level); sec.appendChild(h);
      var lede = el('p', 'road-blurb', lvl.blurb); sec.appendChild(lede);
      var ol = el('ol', 'road-steps'); ol.start = order + 1;   // one continuous order across all levels
      lvl.steps.forEach(function (s) {
        var e = BigO.entryById(s.id); if (!e) return;
        order++; total++;
        var li = el('li', 'road-step');
        var row = el('div', 'road-row');
        var cb = el('input'); cb.type = 'checkbox'; cb.id = 'road-' + s.id;
        cb.checked = BigO.store.isLearned(s.id);
        var lab = el('label', null, e.name); lab.setAttribute('for', cb.id);
        cb.addEventListener('change', function () {
          if (cb.checked !== BigO.store.isLearned(s.id)) BigO.store.toggleLearned(s.id);
          BigO.announce(e.name + (cb.checked ? ' marked as learned' : ' marked as not learned'));
        });
        boxes.push({ id: s.id, cb: cb, li: li, needs: s.needs });
        var open = el('a', 'road-open', 'Open card'); open.href = '#algo=' + s.id;
        open.setAttribute('aria-label', 'Open the card for ' + e.name);
        row.appendChild(cb); row.appendChild(lab); row.appendChild(open);
        li.appendChild(row);
        var meta = el('p', 'road-meta');
        meta.appendChild(el('span', 'road-time', e.time));
        if (s.needs.length) {
          var names = s.needs.map(function (n) { var x = BigO.entryById(n); return x ? x.name : n; });
          meta.appendChild(el('span', 'road-needs', 'Learn first: ' + names.join(', ') + '.'));
        }
        li.appendChild(meta);
        ol.appendChild(li);
      });
      sec.appendChild(ol); grid.appendChild(sec);
    });

    function sync() {
      var done = 0;
      boxes.forEach(function (b) {
        var learned = BigO.store.isLearned(b.id);
        b.cb.checked = learned; if (learned) done++;
        var ready = b.needs.every(function (n) { return BigO.store.isLearned(n); });
        b.li.classList.toggle('is-learned', learned);
        b.li.classList.toggle('is-ready', !learned && ready);
      });
      var saved = BigO.store.state().bookmarks.length;
      summary.textContent = 'Learned ' + done + ' of ' + total + ' topics. Saved ' + saved + '.';
      fill.style.width = (total ? Math.round(done / total * 100) : 0) + '%';
      bar.setAttribute('aria-valuemax', String(total)); bar.setAttribute('aria-valuenow', String(done));
      var next = boxes.filter(function (b) { return !BigO.store.isLearned(b.id) && b.needs.every(function (n) { return BigO.store.isLearned(n); }); })[0];
      note.textContent = BigO.persistenceNote() + (next && done < total ? ' Suggested next topic: ' + BigO.entryById(next.id).name + '.' : '');
    }
    BigO.on('change', sync);
    sync();
  }

  BigO.onEntries(function () { buildLookup(); buildRoadmap(); });
})();
