# Big O cheat sheet

A compact, browser-friendly reference for comparing the time and space complexities of common data structures, sorting algorithms, and the graph and tree algorithms that come up in DSA interviews.

**Live site:** [aryanjsx.github.io/Big-O-Cheat-Sheet](https://aryanjsx.github.io/Big-O-Cheat-Sheet/)

This version is built with [Next.js](https://nextjs.org) (App Router), React, and TypeScript. It's exported as a fully static site, so it still needs no server and can be hosted on GitHub Pages or any static host.

## What's included

- **Search and filters:** search by name or keyword, then filter by topic, complexity class, interview relevance, or your own progress.
- **Explanation cards:** 34 topics, each with when to use it, why it costs what it does, a Python example (plus Java, C++, and JavaScript on seven cards), common pitfalls, and a reference link.
- **Complexity lookup:** best, average, and worst case for an operation, with the assumption and caveat behind each.
- **DSA interview roadmap:** all 34 topics in a suggested order with prerequisites and progress tracking.
- **Big O playground:** an interactive growth chart with operation counts and time estimates.
- **Reference tables:** data structure operations, more data structures, priority queues, graph representations, sorting, algorithm complexity, graph and tree algorithms, and coding patterns.
- **Algorithm visualizer:** step through linear search, binary search, bubble sort, merge sort, BFS, and DFS.
- **Big O quiz and code challenges:** practice with explanations after every answer.
- **Compare two algorithms:** side-by-side table, copyable as Markdown, shareable by link.
- **Export and share:** Markdown, CSV, printable topic cards, and links such as `#algo=bfs` and `#compare=mergesort,quicksort`.
- **One-page revision view, print stylesheet, and PDFs.**
- **Accessibility:** keyboard shortcuts (press `?`), visible focus states, a skip link, screen reader announcements, and support for the reduced-motion setting.

Progress (saved topics, learned topics, and quiz scores) is stored in your browser's local storage. No account or backend is involved.

## Get started

You need Node.js 20.9 or later.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the static site into `out/` |
| `npm start` | Serves `out/` locally to check the production build |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Runs the TypeScript compiler without emitting files |

## Deploy

`.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages on every push to `main`. In the repository settings, set **Pages** to use **GitHub Actions** as the source.

To build for a subpath yourself, set `NEXT_PUBLIC_BASE_PATH` (for example `/Big-O-Cheat-Sheet`) and `NEXT_PUBLIC_SITE_URL` before `npm run build`.

## Project layout

```
public/                         PDFs and other static files
src/
  app/
    layout.tsx                  Metadata, JSON-LD, and providers
    page.tsx                    The page: every section, in order
    globals.css                 Design tokens, tables, features, and print rules
    sitemap.ts                  Generates sitemap.xml
  data/                         All content, typed (see types.ts)
    entries.ts                  Search cards; also feed the revision sheet, roadmap, and exports
    lookup.ts                   Complexity lookup rows
    roadmap.ts                  Roadmap levels and prerequisites
    quiz.ts                     Quiz questions
    challenges.ts               Code complexity challenges
    compare.ts                  Comparison data
    multilang.ts                Java, C++, and JavaScript card snippets
  context/
    ProgressContext.tsx         Saved and learned topics, quiz and challenge results (localStorage)
    SheetContext.tsx            Shared UI state and share-link routing
  lib/                          Search, growth math, visualizer frame builders, helpers
  components/
    sections/                   Static reference tables, one file per section
    interactive/                Search, lookup, roadmap, playground, visualizer, quiz, and more
    layout/                     Toolbar, section nav, revision sheet, shortcuts, print cards
    ui/                         Small shared pieces: CopyButton, LangTabs, Field, InteractiveSection
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the accuracy rules and how to add content or features.

## License

[MIT](LICENSE)
