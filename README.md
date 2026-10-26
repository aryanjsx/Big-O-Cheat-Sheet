# Big O cheat sheet

A compact, browser-friendly reference for comparing the time and space complexities of common data structures, sorting algorithms, and the graph and tree algorithms that come up in DSA interviews.

**Live site:** [aryanjsx.github.io/BigOSheet](https://aryanjsx.github.io/BigOSheet/)

This version is built with [Next.js](https://nextjs.org) (App Router), React, and TypeScript. It's exported as a fully static site, so it still needs no server and can be hosted on GitHub Pages or any static host.

## Pages

| Page | Path | What it covers |
| --- | --- | --- |
| Home | `/` | Search, where to start, and the costs asked about most |
| Topics | `/topics/` | All 34 topics with search and filters |
| Topic | `/topics/<id>/` | One page per topic: why it costs that, code, pitfalls, prerequisites |
| Big O basics | `/basics/` | Notation, the growth playground, and the color key |
| Data structures | `/data-structures/` | Common operations, more structures, priority queues, graph representations |
| Sorting | `/sorting/` | Best, average, and worst case for array sorts |
| Search and graphs | `/algorithms/` | Search, traversal, heaps, shortest paths, spanning trees |
| Coding patterns | `/patterns/` | Typical costs of common interview patterns |
| Lookup, Compare, Visualizer, Export | `/lookup/`, `/compare/`, `/visualizer/`, `/export/` | Tools |
| Roadmap, Quiz, Challenges, Revision sheet | `/roadmap/`, `/quiz/`, `/challenges/`, `/revision/` | Practice |

Links from the old single-page site (`#algo=bfs`, `#compare=a,b`, `#revision`) redirect to the matching page.

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
- **Export and share:** Markdown, CSV, printable topic cards, and links to any topic (`/topics/bfs/`) or comparison (`/compare/#mergesort,quicksort`).
- **One-page revision sheet, print stylesheet, and PDFs.**
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

To build for a subpath yourself, set `NEXT_PUBLIC_BASE_PATH` (for example `/BigOSheet`) and `NEXT_PUBLIC_SITE_URL` before `npm run build`.

## Project layout

```
public/                         PDFs and other static files
src/
  app/
    layout.tsx                  Header, footer, metadata, JSON-LD, and providers
    page.tsx                    Home page
    <route>/page.tsx            One folder per page; topics/[id] builds a page per topic
    globals.css                 Design tokens, tables, features, and print rules
    site.css                    Header, navigation, footer, page headers, and home
    sitemap.ts                  Generates sitemap.xml from every route
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
    SheetContext.tsx            Shared UI state: search filters, dialogs, announcements
  lib/
    routes.ts                   Every page and nav group; used by the navbar, footer, home, and sitemap
    ...                         Search, growth math, visualizer frame builders, helpers
  components/
    sections/                   Static reference tables, one file per section
    interactive/                Search, topic actions, lookup, roadmap, playground, visualizer, quiz, and more
    home/                       Pieces used only on the home page
    layout/                     Site header and footer, page header, on-this-page links, shortcuts, print cards
    ui/                         Small shared pieces: CopyButton, LangTabs, Field
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the accuracy rules and how to add content or features.

## License

[MIT](LICENSE)
