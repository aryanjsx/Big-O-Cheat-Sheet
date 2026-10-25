# Contributing to the Big O cheat sheet

Thanks for helping. Accuracy matters more than coverage here, so a small correct change is better than a large one that is hard to check.

## Ground rules

1. **Say which case you mean.** Worst, average (expected), and amortized costs are different claims. Never write one where you mean another. If a bound holds only under an assumption (random keys, a good hash function, sorted input), state the assumption in a note next to the table.
2. **Use the notation consistently.** `Θ` for tight bounds, `O` for upper bounds, `Ω` for lower bounds.
3. **Name the implementation when it matters.** For example, a queue is O(1) with a circular buffer or linked list, and O(n) per dequeue if it shifts a plain array.
4. **Cite a source.** Link a reference (Wikipedia, a textbook, or official docs) for anything non-obvious. If you are correcting an existing value, say what the old value got wrong.
5. **Space means auxiliary space** unless a table says otherwise.

## Project layout

The site is a single static file, `index.html`. There is no build step.

- **Tables** are plain HTML. Color classes are `green`, `yellow-green`, `yellow`, `orange`, `red`, `dark-red`, and `gray`, applied to a `<code>` element. Use the color that matches the complexity class (see the color key near the top of the page).
- **Search cards and the revision sheet** come from one array named `ENTRIES` in the script at the bottom of `index.html`. Add or edit a card there. The revision sheet picks up every entry marked `"rel": "High"`.
- **Printing** is controlled by the `@media print` block in the stylesheet.
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

## Before you open a pull request

- [ ] Open `index.html` in a browser and check the browser console for errors.
- [ ] Check the page in light mode, dark mode, and print preview.
- [ ] Try the search box and each filter with your new entry.
- [ ] Confirm the one-page revision view still fits on a single printed page.
- [ ] Describe the source for any complexity you added or changed.

## Writing style

Use sentence case for headings and labels. Write plain, direct sentences, and avoid spaces around dashes.
