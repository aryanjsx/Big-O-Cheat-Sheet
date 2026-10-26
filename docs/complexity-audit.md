# Complexity audit

An audit of every complexity claim in the site's data and reference tables, completed in October 2026. Each correction lists the claim, the problem, the fix, and a source. Claims that could not be settled are listed at the end for review.

## Scope

- `src/data/entries.ts` (34 topics), `lookup.ts` (35 rows), `compare.ts` (18 items), `quiz.ts` (23 questions), `challenges.ts` (6 challenges), `multilang.ts` (7 topics), `roadmap.ts`
- `src/lib/visualizer.ts` and its on-screen complexity labels
- `src/components/sections/` (all reference tables and their footnotes)
- The growth playground and the home page's "one million items" estimates (`src/lib/growth.ts`)

Every quiz answer index, challenge answer, and roadmap prerequisite is now checked automatically by `tests/content.test.ts`.

## Corrections

| Where | Claim before | Problem | Correction | Source |
| --- | --- | --- | --- | --- |
| `lookup.ts`, `compare.ts`: Dijkstra | Space `O(V)` | The site's own Dijkstra code pushes duplicate heap entries instead of using decrease-key, so the heap can hold up to E entries. `O(V)` is only true with an indexed heap. The algorithm table footnote already said this. | `O(V + E) with lazy deletion; O(V) with decrease-key` | Sedgewick and Wayne, *Algorithms*, 4th ed., §4.4 (lazy vs. eager Dijkstra); `GraphTree.tsx` footnote |
| `lookup.ts`, `compare.ts`: Prim | Space `O(V)` | Same issue: the lazy heap version used in the code sample holds up to E edges. The MST table already listed `O(V + E)`. | `O(V + E) with lazy deletion; O(V) with decrease-key` | Sedgewick and Wayne, §4.3 (lazy Prim uses space proportional to E) |
| `lookup.ts`, `compare.ts`: Kruskal | Space `O(V)` | Union-Find needs `O(V)`, but sorting a copy of the edge list (as `sorted(edges)` does) needs `O(E)`. The topic and MST table already listed `O(V + E)`. | `O(V + E)`, with the split explained in the assumption | Sedgewick and Wayne, §4.3 (Kruskal uses space proportional to E) |
| `compare.ts`: Prim | "Best used for: minimum spanning trees on dense graphs" next to the binary-heap time | The binary-heap version suits sparse graphs; the array version suits dense ones. | Says which version suits which graph | CLRS, 3rd ed., §23.2 |
| `lookup.ts`: two pointers and sliding window | "Each pointer only moves forward" | Two pointers on a sorted array move toward each other, so one moves backward. The bound holds because each pointer moves in one direction only. | "Each pointer moves in one direction only and never backs up" | Same reasoning as `entries.ts` "Two pointers" |
| `entries.ts`: quicksort | Space `O(log n)` | Only true when the recursion goes into the smaller part first (or loops on the larger one). A naive version, including the visualizer's, can use `O(n)` stack on sorted input. The sorting table footnote and `compare.ts` already said this. | `O(log n) stack when recursing into the smaller part first; O(n) for a naive version` | CLRS, Problem 7-4 (stack depth for quicksort) |
| `entries.ts`: dynamic array | "Capacity doubles when the array is full" | Growth factors differ: CPython over-allocates by about 1.125×, Java `ArrayList` by 1.5×. Any constant factor gives amortized O(1). The lookup row already said "a constant factor". | "Grows by a constant factor (often 1.5× or 2×)" | CPython `Objects/listobject.c` (`list_resize`); OpenJDK `ArrayList.grow`; CLRS §17.4 |
| `entries.ts`: counting sort | "This simple version is not stable." | The sample sorts bare integers, where stability has no meaning. `lookup.ts` and `compare.ts` say the standard version is stable, which is correct. | Explains that stable sorting of records needs the prefix-sum version | CLRS §8.2 |
| `entries.ts`: backtracking | Time `O(2ⁿ) output generation` | Building each of the 2ⁿ subsets copies up to n items, so generating them all is `O(n · 2ⁿ)`. The pitfall text said this, but the headline cost did not. | `O(2ⁿ) subsets; O(n · 2ⁿ) including copying each one` | Standard result; matches the coding patterns table note |
| `entries.ts`: Prim | Classes `linearithmic` only | The array version is `O(V²)`, so filtering by "Polynomial" missed it. | Adds `polynomial` | Same entry's own time field |
| `multilang.ts`: Java `HashMap` | "A single bucket is O(log n) in the worst case" since Java 8 | Tree bins order colliding keys by hash code, then by `compareTo`. When many keys share one hash code and are not `Comparable`, a lookup can still scan O(n) entries. | States the `Comparable` condition | JEP 180; OpenJDK `java.util.HashMap` implementation notes |
| `growth.ts` | "1 years", "1 days" | Plural bug in the duration formatter | "1 year", "1 day" | Tests in `tests/growth.test.ts` |
| Playground, home page | "At 10⁸ operations per second" | Read as measured timings | Labels say these are operation counts divided by an assumed 10⁸ per second, not benchmarks, and list what changes real speed | Not applicable |

The one-page PDF (`public/Big-O-Sheet-one-page.pdf`) was regenerated from `/revision/` because the backtracking row changed. It was checked to be a single page with the corrected row. The full PDF only contains the static reference tables, which this audit did not change, so it was left as is.

## Checked and left unchanged

These looked suspicious at first but are correct as written:

- Binary heap insert "O(1) average": the expected number of levels an insert moves up on random data is a constant (about 1.6). Worst case `O(log n)` is stated alongside. (Porter and Simon, 1975.)
- Bubble sort best case `Θ(n)`: stated as needing the early-exit check, in both the table footnote and the visualizer.
- Binary search: requires sorted, random-access input; `O(1)` iterative and `O(log n)` recursive space. All four places that mention it agree.
- Hash table `Θ(1)` average with `O(n)` worst case, and the assumption about the hash function and load factor.
- Union-Find `O(α(n))` amortized only with both path compression and union by rank or size.
- BFS and DFS `O(V + E)` with an adjacency list and `O(V²)` with a matrix.
- Shell sort, bucket sort, radix sort, and counting sort rows, and their footnotes.
- Every quiz question: each answer index is in range and matches its explanation. Question 15 (string `+=` in Python) answers "O(n²) in the worst case" and explains the CPython optimization, which is the honest answer.
- Every challenge: the correct time and space appear in their option lists. The Java string `+=` explanation is correct: each `+=` builds a new string.
- Language notes in `multilang.ts` other than `HashMap`.

## Open questions

Flagged for the owner. These were not changed because the right answer depends on a decision, not a fact:

1. **KD tree "Access Θ(log n)"** in the data structures table. A k-d tree has no access-by-position operation, so `N/A` (as used for hash tables and BSTs) may be more accurate. The row matches the long-standing table this sheet is based on.
2. **Topics with no reference link**: two pointers, sliding window, hash map frequency counting, and merge intervals. There is no canonical reference page for these patterns. The validation allows `ref: null` for the Patterns topic only.
3. **Cartesian tree `Θ(log n)`** assumes random priorities, as in a treap. The footnote says so. Some readers will expect a Cartesian tree built from a sequence, which has no such guarantee.
