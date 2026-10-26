# Contributing to the Big O cheat sheet

Thanks for helping. Accuracy matters more than coverage here, so a small correct change is better than a large one that is hard to check.

## Ground rules

1. **Say which case you mean.** Worst, average (expected), and amortized costs are different claims. Never write one where you mean another. If a bound holds only under an assumption (random keys, a good hash function, sorted input), state the assumption in a note next to the table.
2. **Use the notation consistently.** `Θ` for tight bounds, `O` for upper bounds, `Ω` for lower bounds.
3. **Name the implementation when it matters.** For example, a queue is O(1) with a circular buffer or linked list, and O(n) per dequeue if it shifts a plain array.
4. **Cite a source.** Link a reference (Wikipedia, a textbook, or official docs) for anything non-obvious. If you are correcting an existing value, say what the old value got wrong.
5. **Space means auxiliary space** unless a table says otherwise.

## Set up

```bash
npm install
```

```bash
npm run dev
```

The site is a Next.js app exported as static files (`output: "export"` in `next.config.ts`). See the project layout in [README.md](README.md).

## Adding content

All content lives in `src/data/`, typed by `src/data/types.ts`. Most changes are a data edit with no new component code, and the TypeScript compiler flags a missing or misspelled field.

- **Search card:** add an `Entry` to `ENTRIES` in `entries.ts`. The revision sheet picks up every entry with `rel: "High"`.

  | Field | What to write |
  | --- | --- |
  | `id` | Short, unique, lowercase with hyphens |
  | `name` | The name people search for |
  | `topic` | One of the values in `TOPICS` |
  | `section` | The `id` of the table section it links to |
  | `time`, `space` | Short and exact, with the case or assumption included |
  | `classes` | Any of the values in `COMPLEXITY_CLASSES` |
  | `rel` | `"High"` or `"Medium"` interview relevance |
  | `keywords` | Extra search terms (aliases, library names) |
  | `when` | One sentence on when to reach for it |
  | `why` | One or two sentences on why the cost is what it is |
  | `pitfall` | The mistake people actually make |
  | `code` | A short Python snippet (about 3 to 15 lines) with comments that show where the cost comes from |
  | `ref` | A reference URL, or `null` |

  Code snippets must run. Test yours against a few inputs before submitting.

- **Quiz question:** add to `QUIZ` in `quiz.ts` with `q`, `code` (or `null`), `options`, `answer` (the index of the correct option), and `why`. Explain the reasoning, not just the answer.
- **Code challenge:** add to `CHALLENGES` in `challenges.ts` with the same snippet in `python`, `javascript`, and `java`, the correct `time` and `space`, and option lists that contain them.
- **Lookup row:** add to `LOOKUP` in `lookup.ts`. Set `entry` to a card `id`, or `null`.
- **Comparison:** add to `COMPARE` in `compare.ts`, keyed by the card `id`. Use `"Not applicable"` for stability and in-place where they do not apply, so the row is hidden for that pair. The card gets a **Compare** button automatically.
- **Other language example:** add to `MULTILANG` in `multilang.ts`, keyed by the card `id`. The `cost` sentence must say what the language changes.
- **Roadmap step:** add `{ id, needs: [...] }` to the right level in `ROADMAP`. A step may only need topics that appear earlier in the order.
- **Visualizer algorithm:** write a frame builder in `src/lib/visualizer.ts` that returns `Frame[]`, then add it to `ALGOS`.

## Editing the reference tables

The static tables are JSX in `src/components/sections/`, one file per section. Color classes are `green`, `yellow-green`, `yellow`, `orange`, `red`, `dark-red`, and `gray`, applied to a `<code>` element. Use the color that matches the complexity class (see the color key on the page). Write code samples inside ``<pre><code>{`...`}</code></pre>`` so whitespace is kept.

## Adding a feature or section

1. Build the component in `src/components/interactive/` (add `"use client"` if it uses state or browser APIs).
2. Wrap it in `<InteractiveSection id="..." title="...">` in `src/app/page.tsx`. Interactive sections are hidden when printing.
3. Add a link to `src/components/layout/Toc.tsx`.
4. Use `useProgress()` for anything saved in the browser, and `useSheet()` for shared UI state, such as filters, the comparison pair, opening a card (`openAlgo`), and screen reader announcements (`announce`).
5. Anything random or read from the browser must not change the first render. Use `useMounted()` from `src/lib/hooks.ts` to render it after hydration, or the page logs a hydration error.

Progress is stored under one local storage key, `bigo:v1`. If you change what is stored, keep reading the old shape in `normalize()` in `ProgressContext.tsx`, so nobody loses their progress.

## Before you open a pull request

- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [ ] Run `npm run dev` and check the browser console for errors, including hydration warnings.
- [ ] Check the page in light mode, dark mode, and print preview.
- [ ] Try the search box and each filter with your new entry.
- [ ] Confirm the one-page revision view still fits on a single printed page.
- [ ] Tab through your change with the keyboard only, and check it with the system reduced-motion setting on.
- [ ] If you added a quiz question or challenge, check that exactly one answer is correct.
- [ ] Describe the source for any complexity you added or changed.
- [ ] Regenerate `public/Big-O-Sheet.pdf` and `public/Big-O-Sheet-one-page.pdf` when content changes (print to PDF from the browser; open `#revision` for the one-page version).

## Writing style

Use sentence case for headings and labels. Write plain, direct sentences, and avoid spaces around dashes.
