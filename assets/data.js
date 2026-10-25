/* Shared data for the interactive features. Plain script, no build step.
   Exposes window.BIGO_DATA. Entry ids match the ids in ENTRIES in index.html. */
(function () {
  'use strict';

  // ---------- Roadmap ----------
  // Levels, with prerequisites expressed as entry ids.
  var ROADMAP = [
    { level: 'Beginner', blurb: 'Core structures and the two basic searches. Learn these first.', steps: [
      { id: 'dynamic-array', needs: [] },
      { id: 'linear-search', needs: ['dynamic-array'] },
      { id: 'stack', needs: ['dynamic-array'] },
      { id: 'queue-deque', needs: ['dynamic-array'] },
      { id: 'hash-table', needs: ['dynamic-array'] },
      { id: 'frequency-counting', needs: ['hash-table'] },
      { id: 'two-pointers', needs: ['dynamic-array'] },
      { id: 'binary-search', needs: ['linear-search'] }
    ]},
    { level: 'Intermediate', blurb: 'Sorting, trees, graphs, and the patterns behind most interview questions.', steps: [
      { id: 'linked-list', needs: ['dynamic-array'] },
      { id: 'mergesort', needs: ['binary-search'] },
      { id: 'quicksort', needs: ['mergesort'] },
      { id: 'prefix-sums', needs: ['dynamic-array'] },
      { id: 'sliding-window', needs: ['two-pointers'] },
      { id: 'monotonic-stack', needs: ['stack'] },
      { id: 'bst', needs: ['binary-search', 'linked-list'] },
      { id: 'tree-traversal', needs: ['bst', 'stack'] },
      { id: 'binary-heap', needs: ['dynamic-array', 'bst'] },
      { id: 'graph-representations', needs: ['hash-table', 'dynamic-array'] },
      { id: 'bfs', needs: ['queue-deque', 'graph-representations'] },
      { id: 'dfs', needs: ['stack', 'graph-representations'] },
      { id: 'merge-intervals', needs: ['mergesort'] }
    ]},
    { level: 'Advanced', blurb: 'Weighted graphs, balanced structures, and problems that need a recurrence.', steps: [
      { id: 'heapsort', needs: ['binary-heap', 'mergesort'] },
      { id: 'counting-sort', needs: ['quicksort'] },
      { id: 'python-sort', needs: ['mergesort'] },
      { id: 'balanced-bst', needs: ['bst'] },
      { id: 'trie', needs: ['hash-table', 'tree-traversal'] },
      { id: 'union-find', needs: ['graph-representations'] },
      { id: 'dijkstra', needs: ['bfs', 'binary-heap'] },
      { id: 'bellman-ford', needs: ['dijkstra'] },
      { id: 'kruskal', needs: ['union-find', 'quicksort'] },
      { id: 'prim', needs: ['dijkstra'] },
      { id: 'backtracking', needs: ['dfs'] },
      { id: 'permutations', needs: ['backtracking'] },
      { id: 'dynamic-programming', needs: ['backtracking', 'hash-table'] }
    ]}
  ];

  // ---------- Quiz ----------
  // answer is the index into options. Options are always complexity classes
  // so the question reads as "what is the time complexity of this code?".
  var QUIZ = [
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    for x in items:\n        print(x)',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2,
      why: 'One pass over n items with constant work each time.' },
    { q: 'What is the time complexity of this nested loop?',
      code: 'for i in range(n):\n    for j in range(n):\n        count += 1',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2,
      why: 'The inner loop runs n times for each of the n outer iterations, so n × n = n².' },
    { q: 'What is the time complexity of this nested loop?',
      code: 'for i in range(n):\n    for j in range(i):\n        count += 1',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], answer: 2,
      why: 'The inner loop runs 0 + 1 + … + (n−1) = n(n−1)/2 times. Drop the constant and lower term: O(n²).' },
    { q: 'What is the time complexity of this loop?',
      code: 'i = 1\nwhile i < n:\n    i *= 2',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(√n)'], answer: 1,
      why: 'i doubles every pass, so it reaches n after about log₂ n passes.' },
    { q: 'What is the time complexity of this code?',
      code: 'for i in range(n):\n    j = 1\n    while j < n:\n        j *= 2',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1,
      why: 'The outer loop runs n times. The inner loop doubles j each pass, so it runs about log n times. Total n log n.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    return items[0] + items[-1]',
      options: ['O(1)', 'O(log n)', 'O(n)', 'It depends on the values'], answer: 0,
      why: 'Two index reads on a list are constant time, regardless of length.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    for x in items:\n        pass\n    for y in items:\n        pass',
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(2n), which is different from O(n)'], answer: 1,
      why: 'Sequential loops add: n + n = 2n. Constants are dropped, so O(n).' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(a, b):\n    for x in a:\n        for y in b:\n            pass',
      options: ['O(n)', 'O(n²)', 'O(a × b), the product of the two lengths', 'O(a + b)'], answer: 2,
      why: 'The two inputs are independent, so name both. The loops multiply: len(a) × len(b). Calling it n² is only correct if both have length n.' },
    { q: 'What is the time complexity of this function?',
      code: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)',
      options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], answer: 2,
      why: 'Each call makes two more calls and nothing is cached, so the call tree roughly doubles at each level. The tight bound is about 1.618ⁿ, and O(2ⁿ) is a valid upper bound.' },
    { q: 'What is the time complexity once the result is cached?',
      code: 'from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(2ⁿ)'], answer: 1,
      why: 'There are n distinct states and each is computed once with O(1) work.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    items.sort()\n    return items[len(items) // 2]',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 2,
      why: 'The sort dominates. Reading the middle item is O(1).' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    seen = set()\n    for x in items:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False',
      options: ['O(1) expected', 'O(n) expected', 'O(n²)', 'O(n log n)'], answer: 1,
      why: 'One pass with expected O(1) set lookups and inserts. The worst case with hash collisions is worse, which is why the answer says expected.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    out = []\n    for x in items:\n        out.insert(0, x)\n    return out',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2,
      why: 'insert(0, x) shifts every existing element, which costs O(k) when the list has k items. Summed over n inserts, that is n²/2.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(n):\n    if n <= 1:\n        return 1\n    return f(n // 2) + 1',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1,
      why: 'One recursive call on half the input, plus constant work. That is log₂ n levels.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(s):\n    result = ""\n    for ch in s:\n        result += ch\n    return result',
      options: ['O(n) in every Python implementation', 'O(n²) in the worst case, because each += may copy the string', 'O(log n)', 'O(1)'], answer: 1,
      why: 'Strings are immutable, so each += can copy. CPython sometimes optimizes this in place, but you cannot rely on it. Use "".join(parts) for a guaranteed O(n).' },
    { q: 'Which complexity describes binary search on a sorted array of n items?',
      code: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1,
      why: 'Each comparison halves the remaining range.' },
    { q: 'What is the average-case time of a hash table lookup, assuming a good hash function?',
      code: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0,
      why: 'The hash gives the bucket directly. Collisions are short on average. The worst case is O(n) if everything collides.' },
    { q: 'What is the worst-case time of quicksort with a naive first-element pivot?',
      code: null,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2,
      why: 'On already-sorted input the pivot splits n items into 0 and n−1 every time. That gives n levels of O(n) work.' },
    { q: 'What is the time complexity of BFS on a graph stored as an adjacency list?',
      code: null,
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'], answer: 2,
      why: 'Each vertex is dequeued once and each edge is examined once or twice.' },
    { q: 'What is the time complexity of building a binary heap from n items with heapify?',
      code: null,
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'], answer: 0,
      why: 'Most nodes are near the bottom and sift down only a short way. The sum of the work is bounded by O(n). Pushing n items one at a time would be O(n log n).' },
    { q: 'What is the auxiliary space of merge sort on an array?',
      code: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 2,
      why: 'The standard array version needs a temporary buffer of size n for merging.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(items):\n    for i in range(len(items)):\n        if items[i] in items[i + 1:]:\n            return True\n    return False',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2,
      why: 'Two hidden costs: slicing copies O(n) items, and `in` on a list scans O(n) items. Both happen inside an O(n) loop.' },
    { q: 'What is the time complexity of this function?',
      code: 'def f(n):\n    total = 0\n    for i in range(1, n + 1):\n        for j in range(i, n + 1, i):\n            total += 1\n    return total',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n√n)'], answer: 1,
      why: 'For each i the inner loop runs about n / i times. The sum n/1 + n/2 + … + n/n is n times the harmonic number, which is O(n log n).' }
  ];

  // ---------- Code challenges ----------
  // Predict time and auxiliary space, then reveal.
  var CHALLENGES = [
    { id: 'two-sum-hash', title: 'Two sum with a set', langs: {
        python: 'def two_sum(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:\n            return True\n        seen.add(x)\n    return False',
        javascript: 'function twoSum(nums, target) {\n  const seen = new Set();\n  for (const x of nums) {\n    if (seen.has(target - x)) return true;\n    seen.add(x);\n  }\n  return false;\n}',
        java: 'static boolean twoSum(int[] nums, int target) {\n    Set<Integer> seen = new HashSet<>();\n    for (int x : nums) {\n        if (seen.contains(target - x)) return true;\n        seen.add(x);\n    }\n    return false;\n}' },
      time: 'O(n) expected', space: 'O(n)',
      timeOptions: ['O(1)', 'O(n) expected', 'O(n²)', 'O(n log n)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      why: 'One pass with expected O(1) hash operations. The set can hold up to n items, so auxiliary space is O(n).' },
    { id: 'reverse-in-place', title: 'Reverse in place', langs: {
        python: 'def reverse(a):\n    i, j = 0, len(a) - 1\n    while i < j:\n        a[i], a[j] = a[j], a[i]\n        i += 1\n        j -= 1',
        javascript: 'function reverse(a) {\n  let i = 0, j = a.length - 1;\n  while (i < j) {\n    [a[i], a[j]] = [a[j], a[i]];\n    i++; j--;\n  }\n}',
        java: 'static void reverse(int[] a) {\n    int i = 0, j = a.length - 1;\n    while (i < j) {\n        int t = a[i]; a[i] = a[j]; a[j] = t;\n        i++; j--;\n    }\n}' },
      time: 'O(n)', space: 'O(1)',
      timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      why: 'The pointers meet in the middle after n/2 swaps. Only two index variables and one temporary are used, so auxiliary space is constant.' },
    { id: 'reverse-copy', title: 'Reverse by slicing or copying', langs: {
        python: 'def reversed_copy(a):\n    return a[::-1]',
        javascript: 'function reversedCopy(a) {\n  return [...a].reverse();\n}',
        java: 'static int[] reversedCopy(int[] a) {\n    int[] out = new int[a.length];\n    for (int i = 0; i < a.length; i++) out[a.length - 1 - i] = a[i];\n    return out;\n}' },
      time: 'O(n)', space: 'O(n)',
      timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      why: 'Building the new list touches every element once. The result is a second list of n items, which counts as O(n) auxiliary space.' },
    { id: 'binary-recursive', title: 'Recursive binary search', langs: {
        python: 'def search(a, t, lo, hi):\n    if lo > hi:\n        return -1\n    mid = (lo + hi) // 2\n    if a[mid] == t:\n        return mid\n    if a[mid] < t:\n        return search(a, t, mid + 1, hi)\n    return search(a, t, lo, mid - 1)',
        javascript: 'function search(a, t, lo, hi) {\n  if (lo > hi) return -1;\n  const mid = Math.floor((lo + hi) / 2);\n  if (a[mid] === t) return mid;\n  if (a[mid] < t) return search(a, t, mid + 1, hi);\n  return search(a, t, lo, mid - 1);\n}',
        java: 'static int search(int[] a, int t, int lo, int hi) {\n    if (lo > hi) return -1;\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) return search(a, t, mid + 1, hi);\n    return search(a, t, lo, mid - 1);\n}' },
      time: 'O(log n)', space: 'O(log n)',
      timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      why: 'Each call halves the range, giving about log₂ n calls. Each call adds a stack frame, so auxiliary space is O(log n). An iterative version would use O(1).' },
    { id: 'pairs', title: 'All pairs', langs: {
        python: 'def pairs(a):\n    out = []\n    for i in range(len(a)):\n        for j in range(i + 1, len(a)):\n            out.append((a[i], a[j]))\n    return out',
        javascript: 'function pairs(a) {\n  const out = [];\n  for (let i = 0; i < a.length; i++)\n    for (let j = i + 1; j < a.length; j++)\n      out.push([a[i], a[j]]);\n  return out;\n}',
        java: 'static List<int[]> pairs(int[] a) {\n    List<int[]> out = new ArrayList<>();\n    for (int i = 0; i < a.length; i++)\n        for (int j = i + 1; j < a.length; j++)\n            out.add(new int[]{a[i], a[j]});\n    return out;\n}' },
      time: 'O(n²)', space: 'O(n²)',
      timeOptions: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], spaceOptions: ['O(1)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
      why: 'There are n(n−1)/2 pairs, so the loops and the output list are both quadratic. If you only counted pairs instead of storing them, space would drop to O(1).' },
    { id: 'string-concat', title: 'Building a string in a loop', langs: {
        python: 'def build(parts):\n    s = ""\n    for p in parts:\n        s += p\n    return s',
        javascript: 'function build(parts) {\n  let s = "";\n  for (const p of parts) s += p;\n  return s;\n}',
        java: 'static String build(List<String> parts) {\n    String s = "";\n    for (String p : parts) s += p;\n    return s;\n}' },
      time: 'O(n²) worst case in Java; often O(n) in practice in JavaScript and CPython', space: 'O(n)',
      timeOptions: ['O(n) in every language', 'O(n²) worst case in Java; often O(n) in practice in JavaScript and CPython', 'O(log n)', 'O(1)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      why: 'Java strings are immutable, so each += copies. Many JavaScript engines use ropes, and CPython can resize in place when it holds the only reference, but none of that is guaranteed. Use StringBuilder in Java and "".join in Python for a guaranteed O(n).' }
  ];

  // ---------- Compare ----------
  var COMPARE = {
    'mergesort': { name: 'Merge sort', kind: 'sort', time: 'Θ(n log n) best, average, and worst', space: 'O(n) for arrays; O(log n) stack', stable: 'Yes', inPlace: 'No (arrays)', useFor: 'Linked lists, external sorting, and any time you need a stable sort or a guaranteed O(n log n).', tradeoffs: 'Predictable running time, but the extra buffer costs memory and cache locality.' },
    'quicksort': { name: 'Quicksort', kind: 'sort', time: 'Θ(n log n) average; Θ(n²) worst', space: 'O(log n) average stack; O(n) worst', stable: 'No', inPlace: 'Yes', useFor: 'In-memory arrays of primitives where average speed and cache behavior matter.', tradeoffs: 'Usually the fastest in practice, but a bad pivot sequence gives quadratic time. Randomized or median-of-three pivots make that unlikely.' },
    'heapsort': { name: 'Heapsort', kind: 'sort', time: 'Θ(n log n) for distinct keys', space: 'O(1)', stable: 'No', inPlace: 'Yes', useFor: 'When you need a guaranteed O(n log n) and O(1) extra space.', tradeoffs: 'Worst case is safe, but poor cache locality makes it slower than quicksort in practice.' },
    'counting-sort': { name: 'Counting sort', kind: 'sort', time: 'Θ(n + k) for values in a range of size k', space: 'O(n + k)', stable: 'Yes (standard version)', inPlace: 'No', useFor: 'Integers in a small known range, or as a subroutine in radix sort.', tradeoffs: 'Beats comparison sorts when k is small, but loses badly when k is much larger than n.' },
    'bfs': { name: 'Breadth-first search', kind: 'graph', time: 'O(V + E) with an adjacency list', space: 'O(V)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Shortest path in an unweighted graph, level-order traversal, and finding the nearest target.', tradeoffs: 'The queue can hold a whole level, which is wide in bushy graphs.' },
    'dfs': { name: 'Depth-first search', kind: 'graph', time: 'O(V + E) with an adjacency list', space: 'O(V), set by the recursion depth', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Cycle detection, topological sort, connected components, and exhaustive search or backtracking.', tradeoffs: 'Uses little memory on wide graphs, but recursion can overflow the stack on deep ones, and it does not find shortest paths.' },
    'dijkstra': { name: 'Dijkstra', kind: 'graph', time: 'O((V + E) log V) with a binary heap', space: 'O(V)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Shortest paths with non-negative edge weights.', tradeoffs: 'Faster than Bellman-Ford, but it gives wrong answers when an edge weight is negative.' },
    'bellman-ford': { name: 'Bellman-Ford', kind: 'graph', time: 'O(V · E)', space: 'O(V)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Shortest paths with negative edges, and detecting negative cycles.', tradeoffs: 'Slower than Dijkstra, but handles negative weights.' },
    'kruskal': { name: 'Kruskal', kind: 'graph', time: 'O(E log E)', space: 'O(V)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Minimum spanning trees on sparse graphs, or when edges are already sorted.', tradeoffs: 'Needs Union-Find. Sorting all edges dominates.' },
    'prim': { name: 'Prim', kind: 'graph', time: 'O(E log V) with a binary heap', space: 'O(V)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Minimum spanning trees on dense graphs.', tradeoffs: 'Grows one tree from a start vertex. With an array and no heap it is O(V²), which is better for very dense graphs.' },
    'binary-search': { name: 'Binary search', kind: 'search', time: 'O(log n)', space: 'O(1) iterative; O(log n) recursive', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Sorted arrays and any monotonic yes or no predicate.', tradeoffs: 'Requires sorted data and random access. Sorting first costs O(n log n), so it only pays off with many lookups.' },
    'linear-search': { name: 'Linear search', kind: 'search', time: 'O(n); O(1) if the target is first', space: 'O(1)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Unsorted data, small inputs, or a single lookup.', tradeoffs: 'No setup cost and works on any sequence, but scales linearly.' },
    'hash-table': { name: 'Hash table', kind: 'ds', time: 'Lookup, insert, delete O(1) expected; O(n) worst', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Membership tests, counting, and caching by key.', tradeoffs: 'Fast on average, but unordered, and the worst case needs a good hash function to avoid.' },
    'bst': { name: 'Binary search tree', kind: 'ds', time: 'O(h): O(log n) balanced, O(n) worst', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Ordered data with range queries, predecessor, and successor.', tradeoffs: 'Keeps keys sorted, but an unbalanced tree degrades to a linked list.' },
    'balanced-bst': { name: 'Balanced BST', kind: 'ds', time: 'O(log n) worst case', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Ordered maps and sets that need guaranteed O(log n).', tradeoffs: 'Guaranteed height, at the price of rotation logic and more memory per node.' },
    'binary-heap': { name: 'Binary heap', kind: 'ds', time: 'Peek O(1); push and pop O(log n); build O(n)', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Priority queues, top-k, and scheduling.', tradeoffs: 'Fast access to the min or max only. Arbitrary search is O(n).' },
    'stack': { name: 'Stack', kind: 'ds', time: 'Push, pop, peek O(1)', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'Undo history, parsing, DFS, and monotonic-stack problems.', tradeoffs: 'Only the top is accessible.' },
    'queue-deque': { name: 'Queue and deque', kind: 'ds', time: 'Enqueue and dequeue O(1) with a deque', space: 'O(n)', stable: 'Not applicable', inPlace: 'Not applicable', useFor: 'BFS, scheduling, and sliding-window maximum.', tradeoffs: 'O(1) needs a deque or circular buffer. A plain array that shifts on dequeue is O(n).' }
  };

  // ---------- Multilanguage examples ----------
  // Only for entries where the language difference is real and teachable.
  var MULTILANG = {
    'dynamic-array': {
      java: { code: 'List<Integer> items = new ArrayList<>();\nfor (int x = 0; x < n; x++) {\n    items.add(x);        // amortized O(1); occasional resize copies the array\n}\nitems.get(0);            // O(1)\nitems.add(0, -1);        // O(n): shifts every element right',
        cost: 'ArrayList grows by about 1.5×. Integer values are boxed, which adds memory and indirection. Use int[] when the size is fixed.' },
      cpp: { code: 'std::vector<int> items;\nfor (int x = 0; x < n; x++) {\n    items.push_back(x);       // amortized O(1); reallocation copies or moves elements\n}\nitems[0];                     // O(1)\nitems.insert(items.begin(), -1);  // O(n): shifts every element',
        cost: 'Growth is usually 1.5× or 2×, set by the implementation. Reserve capacity up front to avoid reallocations. Elements are stored contiguously, which is cache-friendly.' },
      javascript: { code: 'const items = [];\nfor (let x = 0; x < n; x++) {\n  items.push(x);       // amortized O(1)\n}\nitems[0];              // O(1)\nitems.unshift(-1);     // O(n) in general: engines may shift elements',
        cost: 'Arrays are engine-managed objects. Dense arrays behave like vectors, but holes or mixed types can switch the engine to slower representations.' }
    },
    'hash-table': {
      java: { code: 'Map<String, Integer> counts = new HashMap<>();\nfor (String w : words) {\n    counts.merge(w, 1, Integer::sum);   // O(1) expected\n}',
        cost: 'HashMap converts long collision chains into balanced trees (since Java 8), so a single bucket is O(log n) in the worst case, though a heavily colliding table is still slow.' },
      cpp: { code: 'std::unordered_map<std::string, int> counts;\nfor (const auto& w : words) {\n    counts[w]++;          // O(1) expected; O(n) worst case\n}',
        cost: 'unordered_map is a hash table with O(n) worst-case operations. std::map is a balanced tree with O(log n) guaranteed and sorted order.' },
      javascript: { code: 'const counts = new Map();\nfor (const w of words) {\n  counts.set(w, (counts.get(w) ?? 0) + 1);   // O(1) expected\n}',
        cost: 'Map keeps insertion order and accepts any key type. Plain objects work but also carry prototype keys, so prefer Map for arbitrary keys.' }
    },
    'queue-deque': {
      java: { code: 'Deque<Integer> q = new ArrayDeque<>();\nq.addLast(1);          // O(1) amortized\nq.pollFirst();         // O(1)',
        cost: 'ArrayDeque is a circular buffer. LinkedList also works but uses more memory per element.' },
      cpp: { code: 'std::deque<int> q;\nq.push_back(1);        // O(1)\nq.pop_front();         // O(1)',
        cost: 'std::deque stores blocks of elements, giving O(1) at both ends. std::queue wraps a deque by default.' },
      javascript: { code: 'const q = [];\nq.push(1);             // O(1) amortized\nq.shift();             // can be O(n); engines vary',
        cost: 'Array.prototype.shift is not guaranteed O(1). For large queues, keep a head index or use a linked list.' }
    },
    'binary-heap': {
      java: { code: 'PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(5);           // O(log n)\npq.poll();             // O(log n)\npq.peek();             // O(1)',
        cost: 'Min-heap by default. remove(Object) is O(n), because it first has to find the element.' },
      cpp: { code: 'std::priority_queue<int, std::vector<int>, std::greater<int>> pq;\npq.push(5);            // O(log n)\npq.pop();              // O(log n)\npq.top();              // O(1)',
        cost: 'priority_queue is a max-heap by default. Pass std::greater for a min-heap. There is no decrease-key, so Dijkstra pushes duplicates.' },
      javascript: { code: '// No built-in heap. Use a library or write a small class.\nclass MinHeap {\n  constructor() { this.a = []; }\n  push(x) { this.a.push(x); this.#up(this.a.length - 1); }   // O(log n)\n  // pop and peek omitted for brevity\n  #up(i) {\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (this.a[p] <= this.a[i]) break;\n      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];\n      i = p;\n    }\n  }\n}',
        cost: 'JavaScript has no standard heap, so you write or import one. Interviews usually allow a short sketch.' }
    },
    'mergesort': {
      java: { code: 'Arrays.sort(objects);      // object arrays: stable merge-based sort (TimSort), O(n log n)\nArrays.sort(ints);         // int arrays: dual-pivot quicksort, O(n log n) typical, not stable',
        cost: 'Java chooses the algorithm by type. Objects need stability, so they use TimSort. Primitives have no identity, so stability is moot.' },
      cpp: { code: 'std::sort(v.begin(), v.end());          // O(n log n), not stable\nstd::stable_sort(v.begin(), v.end());   // O(n log n) with enough memory, stable',
        cost: 'std::sort is O(n log n) worst case (introsort). stable_sort may allocate a buffer.' },
      javascript: { code: 'arr.sort((a, b) => a - b);   // O(n log n), stable since ES2019',
        cost: 'Without a comparator, sort converts items to strings, so [10, 9, 1].sort() returns [1, 10, 9]. Always pass a comparator for numbers.' }
    },
    'binary-search': {
      java: { code: 'int mid = lo + (hi - lo) / 2;   // avoids int overflow\nint i = Arrays.binarySearch(sorted, target);   // O(log n)',
        cost: '(lo + hi) / 2 can overflow int for very large arrays. Use lo + (hi - lo) / 2.' },
      cpp: { code: 'int mid = lo + (hi - lo) / 2;\nauto it = std::lower_bound(v.begin(), v.end(), target);   // O(log n) on random-access iterators',
        cost: 'lower_bound is O(log n) comparisons, but on a std::list it is still O(n) iterator steps.' },
      javascript: { code: 'const mid = lo + ((hi - lo) >> 1);\n// No built-in binary search. Write it, or use a library.',
        cost: 'Numbers are doubles, so overflow is not a concern until about 2^53, but indexes above 2^31 break bitwise shifts.' }
    },
    'stack': {
      java: { code: 'Deque<Integer> st = new ArrayDeque<>();\nst.push(1);   // O(1)\nst.pop();     // O(1)',
        cost: 'Prefer ArrayDeque over the legacy Stack class, which is synchronized and slower.' },
      cpp: { code: 'std::stack<int> st;\nst.push(1);   // O(1)\nst.pop();     // O(1), returns void',
        cost: 'pop() does not return the value. Call top() first.' },
      javascript: { code: 'const st = [];\nst.push(1);   // O(1) amortized\nst.pop();     // O(1)',
        cost: 'A plain array is a fine stack.' }
    }
  };

  window.BIGO_DATA = {
    ROADMAP: ROADMAP, QUIZ: QUIZ, CHALLENGES: CHALLENGES, COMPARE: COMPARE, MULTILANG: MULTILANG
  };
})();
