import { ENTRIES, TOPIC_ORDER } from "@/data/entries";

/* One-page interview revision view. Lists every entry marked rel: "High", grouped by topic.
   Hidden unless body has the "revision" class (see globals.css). */

const SIZE_GUIDE: [string, string][] = [
  ["Up to about 10", "O(n!)"],
  ["Up to about 20", "O(2ⁿ)"],
  ["Up to about 500", "O(n³)"],
  ["Up to about 5,000", "O(n²)"],
  ["Up to about 1,000,000", "O(n log n)"],
  ["Up to about 100,000,000", "O(n)"],
];

export default function RevisionSheet() {
  return (
    <section id="revision-sheet" aria-labelledby="rev-title">
      <h2 id="rev-title" style={{ borderTop: "none", marginTop: "1rem" }}>
        Interview revision sheet
      </h2>
      <p className="rev-note">
        The topics that come up most in interviews, on one page. Typical costs, not guarantees: check the full sheet for
        assumptions.
      </p>
      <div id="rev-grid" className="rev-grid">
        {TOPIC_ORDER.map((topic) => {
          const rows = ENTRIES.filter((e) => e.topic === topic && e.rel === "High");
          if (!rows.length) return null;
          return (
            <div className="rev-block" key={topic}>
              <h3>{topic}</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Topic</th>
                    <th>Time</th>
                    <th>Space</th>
                  </tr>
                  {rows.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.time}</td>
                      <td>{e.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <div className="rev-rules rev-block" style={{ marginTop: ".75rem" }}>
        <h3>Rough guide: input size to complexity</h3>
        <table>
          <tbody>
            <tr>
              <th>Input size n</th>
              <th>Complexity that usually fits</th>
            </tr>
            {SIZE_GUIDE.map(([n, c]) => (
              <tr key={n}>
                <td>{n}</td>
                <td>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="rev-note">
          Assumes roughly 10⁸ simple operations per second. Real limits depend on the language and the work per step.
        </p>
      </div>
    </section>
  );
}
