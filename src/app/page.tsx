/* The whole sheet is one page. Sections render in this order; reorder or add them here,
   and add a matching link in components/layout/Toc.tsx. */

import Challenge from "@/components/interactive/Challenge";
import Compare from "@/components/interactive/Compare";
import Explore from "@/components/interactive/Explore";
import Export from "@/components/interactive/Export";
import Lookup from "@/components/interactive/Lookup";
import Quiz from "@/components/interactive/Quiz";
import Roadmap from "@/components/interactive/Roadmap";
import Visualizer from "@/components/interactive/Visualizer";
import LiveRegion from "@/components/layout/LiveRegion";
import PrintCards from "@/components/layout/PrintCards";
import RevisionSheet from "@/components/layout/RevisionSheet";
import Shortcuts from "@/components/layout/Shortcuts";
import Toc from "@/components/layout/Toc";
import Toolbar from "@/components/layout/Toolbar";
import AlgorithmReference from "@/components/sections/AlgorithmReference";
import CodingPatterns from "@/components/sections/CodingPatterns";
import DataStructures from "@/components/sections/DataStructures";
import Fundamentals from "@/components/sections/Fundamentals";
import GraphRepresentations from "@/components/sections/GraphRepresentations";
import GraphTree from "@/components/sections/GraphTree";
import MoreDataStructures from "@/components/sections/MoreDataStructures";
import Notation from "@/components/sections/Notation";
import Sorting from "@/components/sections/Sorting";
import InteractiveSection from "@/components/ui/InteractiveSection";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#explore">
        Skip to search
      </a>
      <LiveRegion />
      <main>
        <h1>Big O cheat sheet</h1>
        <p className="lede">
          Time and space complexity for common data structures, sorting algorithms, graph and tree algorithms, and the coding
          interview staples that sit between them. Examples are in Python, with Java, C++, and JavaScript on selected topics.
        </p>
        <Toolbar />
        <Toc />

        <div id="full-view">
          <Explore />
          <InteractiveSection
            id="lookup"
            title="Complexity lookup"
            lede="Type an operation or algorithm to see its best, average, and worst case in one place, with the assumption behind the average case and the caveat people usually miss."
          >
            <Lookup />
          </InteractiveSection>
          <InteractiveSection
            id="roadmap"
            title="DSA interview roadmap"
            lede="A suggested order for learning the topics on this sheet. Each step lists what to learn first. Tick a topic when you are comfortable with it. Your progress is stored in this browser only."
          >
            <Roadmap />
          </InteractiveSection>

          <Fundamentals />
          <DataStructures />
          <MoreDataStructures />
          <GraphRepresentations />
          <Sorting />
          <AlgorithmReference />
          <GraphTree />
          <CodingPatterns />

          <InteractiveSection
            id="visualizer"
            title="Algorithm visualizer"
            lede="Watch binary search, linear search, bubble sort, merge sort, BFS, and DFS work one step at a time. Each step shows what was compared or moved, and the counters show where the cost comes from. Step back as well as forward."
          >
            <Visualizer />
          </InteractiveSection>
          <InteractiveSection id="quiz" title="Big O quiz">
            <Quiz />
          </InteractiveSection>
          <InteractiveSection
            id="challenge"
            title="Code complexity challenges"
            lede="Read the snippet, then predict both its time and its auxiliary space before you reveal the answer. Snippets are shown in Python, JavaScript, and Java. Costs can differ between languages, and the explanation says when they do."
          >
            <Challenge />
          </InteractiveSection>
          <InteractiveSection
            id="compare"
            title="Compare two algorithms"
            lede="Pick any two topics to compare time, space, stability, best uses, and trade-offs. Copy the result as a Markdown table or share a link that opens the same comparison."
          >
            <Compare />
          </InteractiveSection>
          <InteractiveSection
            id="export"
            title="Export and share"
            lede="Take the sheet with you. Copy a Markdown table, download a CSV, or print compact topic cards for the topics you choose."
          >
            <Export />
          </InteractiveSection>

          <Notation />
        </div>

        <RevisionSheet />
        <PrintCards />
      </main>
      <Shortcuts />
    </>
  );
}
