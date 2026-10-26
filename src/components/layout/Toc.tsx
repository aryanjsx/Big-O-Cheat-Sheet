/* In-page navigation. Add a link here when you add a section with an id. */
const LINKS: [string, string][] = [
  ["explore", "Search"],
  ["lookup", "Lookup"],
  ["roadmap", "Roadmap"],
  ["fundamentals", "Playground"],
  ["data-structures", "Data structures"],
  ["more-data-structures", "More data structures"],
  ["graph-representations", "Graph representations"],
  ["sorting", "Sorting"],
  ["algorithms", "Algorithm reference"],
  ["graph-tree", "Graph and tree algorithms"],
  ["coding-patterns", "Coding patterns"],
  ["visualizer", "Visualizer"],
  ["quiz", "Quiz"],
  ["challenge", "Challenges"],
  ["compare", "Compare"],
  ["export", "Export and share"],
];

export default function Toc() {
  return (
    <nav className="toc" aria-label="Sections">
      {LINKS.map(([id, label]) => (
        <a key={id} href={"#" + id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
