import Link from "next/link";
import HomeProgress from "@/components/home/HomeProgress";
import HomeSearch from "@/components/home/HomeSearch";
import LegacyLinks from "@/components/home/LegacyLinks";
import { ENTRIES } from "@/data/entries";
import { CURVES, fmtDuration } from "@/lib/growth";
import { pageMeta } from "@/lib/meta";
import { GITHUB_URL, NAV, TOPICS_PAGE, topicHref } from "@/lib/routes";
import { asset } from "@/lib/utils";

export const metadata = {
  ...pageMeta(
    "Big O cheat sheet: time and space complexity",
    "Interactive Big O cheat sheet for coding interviews: time and space complexity of data structures, sorting, and graph algorithms, with a quiz and visualizer.",
    "./",
  ),
  title: { absolute: "Big O cheat sheet: time and space complexity | BigOSheet" },
};

const N = 1_000_000;

// The costs people get asked about most. Each row links to its topic page.
const MOST_ASKED: { label: string; id: string; avg: [string, string]; worst: [string, string] }[] = [
  { label: "Hash table lookup", id: "hash-table", avg: ["O(1)", "green"], worst: ["O(n)", "yellow"] },
  { label: "Binary search", id: "binary-search", avg: ["O(log n)", "yellow-green"], worst: ["O(log n)", "yellow-green"] },
  { label: "Heap push or pop", id: "binary-heap", avg: ["O(log n)", "yellow-green"], worst: ["O(log n)", "yellow-green"] },
  { label: "Sort with mergesort", id: "mergesort", avg: ["O(n log n)", "orange"], worst: ["O(n log n)", "orange"] },
  { label: "Sort with quicksort", id: "quicksort", avg: ["O(n log n)", "orange"], worst: ["O(n²)", "red"] },
  { label: "BFS or DFS", id: "bfs", avg: ["O(V + E)", "yellow"], worst: ["O(V + E)", "yellow"] },
  { label: "Dijkstra with a binary heap", id: "dijkstra", avg: ["O((V + E) log V)", "orange"], worst: ["O((V + E) log V)", "orange"] },
  { label: "Generate every subset", id: "backtracking", avg: ["O(2ⁿ)", "dark-red"], worst: ["O(2ⁿ)", "dark-red"] },
];

export default function Home() {
  return (
    <>
      <LegacyLinks />
      <section className="hero" aria-labelledby="home-title">
        <div>
          <p className="eyebrow">Big O reference for coding interviews</p>
          <h1 id="home-title">Time and space complexity, with the fine print.</h1>
          <p className="lede">
            {ENTRIES.length} data structures, algorithms, and patterns. Every bound says whether it is average, amortized, or
            worst case, and what it assumes.
          </p>
          <HomeSearch />
          <p className="hero-links">
            <Link href="/revision/">One-page revision sheet</Link>
            <Link href="/roadmap/">Where to start</Link>
            <a href={asset("/Big-O-Sheet.pdf")} download>
              Download the PDF
            </a>
          </p>
        </div>

        <aside className="scale-card" aria-labelledby="scale-title">
          <h2 id="scale-title">One million items</h2>
          <p>Roughly how long each class takes at 10⁸ simple operations a second.</p>
          <table>
            <tbody>
              {CURVES.map((c) => (
                <tr key={c.key}>
                  <td>
                    <code className={c.cls}>{c.label}</code>
                  </td>
                  <td>{fmtDuration(c.l(N))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="scale-note">
            That gap is the whole point. <Link href="/basics/">Try other sizes in the playground</Link>.
          </p>
        </aside>
      </section>

      <HomeProgress />

      <section className="home-section" aria-labelledby="index-title">
        <h2 id="index-title">What&apos;s here</h2>
        <div className="index-grid">
          {NAV.map((group) => {
            const links = group.label === "Reference" ? [TOPICS_PAGE, ...group.links] : group.links;
            return (
              <div key={group.label}>
                <h3>{group.label}</h3>
                <ol className="index-list">
                  {links.map((l) => (
                    <li key={l.href}>
                      <span>
                        <Link href={l.href}>{l.label}</Link>
                        <p>{l.blurb}</p>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="asked-title">
        <h2 id="asked-title">The ones you will be asked about</h2>
        <p>If you only memorize eight lines, make it these. Each links to the full explanation.</p>
        <div className="table-wrap" role="region" aria-label="Most asked complexities" tabIndex={0}>
          <table className="table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Average</th>
                <th>Worst</th>
              </tr>
            </thead>
            <tbody>
              {MOST_ASKED.map((r) => (
                <tr key={r.label}>
                  <td>
                    <Link href={topicHref(r.id)}>{r.label}</Link>
                  </td>
                  <td>
                    <code className={r.avg[1]}>{r.avg[0]}</code>
                  </td>
                  <td>
                    <code className={r.worst[1]}>{r.worst[0]}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="footnotes">
          The hash table worst case assumes many keys collide. Quicksort hits O(n²) with a bad pivot on sorted input. The
          colors match the strip at the top of every page: green is cheapest, dark red is exponential.
        </p>
      </section>

      <p className="home-note">
        Found a bound that looks wrong? <a href={GITHUB_URL + "/issues"}>Open an issue</a> with a source, and it gets fixed.
      </p>
    </>
  );
}
