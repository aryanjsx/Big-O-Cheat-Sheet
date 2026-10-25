# Contributing to the Big O cheat sheet

Thanks for helping. Accuracy matters more than coverage here, so a small correct change is better than a large one that is hard to check.

## Ground rules

1. **Say which case you mean.** Worst, average (expected), and amortized costs are different claims. Never write one where you mean another. If a bound holds only under an assumption (random keys, a good hash function, sorted input), state the assumption in a note next to the table.
2. **Use the notation consistently.** `Θ` for tight bounds, `O` for upper bounds, `Ω` for lower bounds.
3. **Name the implementation when it matters.** For example, a queue is O(1) with a circular buffer or linked list, and O(n) per dequeue if it shifts a plain array.
4. **Cite a source.** Link a reference (Wikipedia, a textbook, or official docs) for anything non-obvious. If you are correcting an existing value, say what the old value got wrong.
5. **Space means auxiliary space** unless a table says otherwise.

## Project layout

The site is `index.html` plus a small `assets` folder of plain scripts and one stylesheet. There is no build step, no modules, and no dependencies, so the page still works when opened from disk.

| File | What it holds |
| --- | --- |
| `assets/data.js` | Roadmap, quiz questions, code challenges, comparison data, and multilanguage examples |
| `assets/core.js` | Local storage, card actions, share links, and keyboard shortcuts |
| `assets/reference.js` | The complexity lookup data and interface, and the roadmap |
| `assets/playground.js` | The growth chart and operation counts |
| `assets/visualizer.js` | Frame builders and the player for each algorithm |
| `assets/practice.js` | The quiz and the code challenges |
| `assets/compare-export.js` | The comparison table and the export tools |
| `assets/features.css` | Styles for everything above, including print rules |

- **Tables** are plain HTML. Color classes are `green`, `yellow-green`, `yellow`, `orange`, `red`, `dark-red`, and `gray`, applied to a `<code>` element. Use the color that matches the complexity class (see the color key near the top of the page).
- **Search cards and the revision sheet** come from one array named `ENTRIES` in the script at the bottom of `index.html`. Add or edit a card there. The revision sheet picks up every entry marked `"rel": "High"`.
- **Printing** is controlled by the `@media print` block in `index.html`, plus a short print block at the end of `features.css` that hides the interactive sections.
- `Big-O-Sheet.pdf` and `Big-O-Sheet-one-page.pdf` are generated from the page. Regenerate them when content changes (print to PDF from a browser, or open `index.html#revision` for the one-page version).

## Adding a card

Each entry in `ENTRIES` has these fields:

| Field | What to write |
| --- | --- |
| `id` | Short, unique, lowercase with hyphens |
| `name` | The name people search for |
| `topic` | One of: Data structures, Sorting, Searching, Graphs and trees, Patterns |
| `section` | The `id` of the table section it links to |
| `time`, `space` | Short and exact, with the case or assumption included |
| `classes` | Any of: constant, logarithmic, linear, linearithmic, polynomial, exponential |
| `rel` | `High` or `Medium` interview relevance |
| `keywords` | Extra search terms (aliases, library names) |
| `when` | One sentence on when to reach for it |
| `why` | One or two sentences on why the cost is what it is |
| `pitfall` | The mistake people actually make |
| `code` | A short Python snippet (about 3 to 15 lines) with comments that show where the cost comes from |
| `ref` | A reference URL, or `null` if there is no good one |

Code snippets must run. Test yours against a few inputs before submitting, and keep them readable over clever.

## Adding to the interactive features

All of these live in `assets/`. Each change is a data edit, with no new code.

- **Quiz question:** add an object to `QUIZ` in `data.js` with `q`, optional `code`, `options`, `answer` (the index of the correct option), and `why`. Explain the reasoning, not just the answer. If a bound depends on an assumption, say so in `why`.
- **Code challenge:** add an object to `CHALLENGES` with the same snippet in `python`, `javascript`, and `java`, the correct `time` and `space`, and option lists that contain them. If the languages really differ (string concatenation is one example), say so in `why`.
- **Lookup row:** add an object to `LOOKUP` in `reference.js` with best, average, and worst case, auxiliary space, the `assume` sentence behind the average case, and a `caveat`. Set `entry` to a card `id`, or `null`.
- **Comparison:** add an entry to `COMPARE` in `data.js`, keyed by the card `id`. Use `Not applicable` for stability and in-place where they do not apply, so the row is hidden for that pair.
- **Other language example:** add an entry to `MULTILANG`, keyed by the card `id`, with `java`, `cpp`, and `javascript` objects holding `code` and `cost`. The `cost` sentence must say what the language changes. Do not repeat the Python explanation.
- **Roadmap step:** add `{ id, needs: [...] }` to the right level in `ROADMAP`. A step may only need topics that appear earlier in the order.

Progress is stored under one local storage key, `bigo:v1`. If you change what is stored, keep reading the old shape, so nobody loses their progress.

## Before you open a pull request

- [ ] Open `index.html` in a browser and check the browser console for errors.
- [ ] Check the page in light mode, dark mode, and print preview.
- [ ] Try the search box and each filter with your new entry.
- [ ] Confirm the one-page revision view still fits on a single printed page.
- [ ] Open the page from disk (`file://`) and confirm the new features still work. Do not add `import`, `fetch`, or a build step.
- [ ] Tab through your change with the keyboard only, and check it with the system reduced-motion setting on.
- [ ] If you added a quiz question or challenge, check that exactly one answer is correct.
- [ ] Describe the source for any complexity you added or changed.

## Writing style

Use sentence case for headings and labels. Write plain, direct sentences, and avoid spaces around dashes.
