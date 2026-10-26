import Link from "next/link";
import HomeProgress from "@/components/home/HomeProgress";
import HomeSearch from "@/components/home/HomeSearch";
import LegacyLinks from "@/components/home/LegacyLinks";
import { ENTRIES } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import { complexityColor } from "@/lib/complexity";
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

// The costs people get asked about most, by row name in data/lookup.ts.
const MOST_ASKED = [
  "Hash table lookup, insert, delete",
  "Binary search",
  "Binary heap pop",
  "Merge sort",
  "Quicksort",
  "Breadth-first search",
  "Dijkstra shortest path",
  "Union-Find find and union",
].map((name) => LOOKUP.find((r) => r.name === name)!);

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
          <p>Operation count divided by an assumed 10⁸ simple operations a second. An estimate, not a benchmark.</p>
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
        <p>If you only memorize eight lines, make it these. Each links to the full explanation, and the <Link href="/lookup/">lookup</Link> has the assumptions.</p>
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
                <tr key={r.name}>
                  <td>{r.entry ? <Link href={topicHref(r.entry)}>{r.name}</Link> : r.name}</td>
                  <td>
                    <code className={complexityColor(r.avg)}>{r.avg}</code>
                  </td>
                  <td>
                    <code className={complexityColor(r.worst)}>{r.worst}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="footnotes">
          The hash table worst case assumes many keys collide. Quicksort hits O(n²) when the pivot keeps splitting badly, such
          as a first-element pivot on sorted input. The colors match the strip at the top of every page: green is cheapest,
          dark red is exponential.
        </p>
      </section>

      <p className="home-note">
        Found a bound that looks wrong? <a href={GITHUB_URL + "/issues"}>Open an issue</a> with a source, and it gets fixed.
      </p>
    </>
  );
}
