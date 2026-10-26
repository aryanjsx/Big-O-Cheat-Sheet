import Visualizer from "@/components/interactive/Visualizer";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Algorithm visualizer",
  "Step through linear search, binary search, bubble sort, merge sort, BFS, and DFS one move at a time, with comparison and swap counters.",
  "visualizer/",
);

export default function VisualizerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Algorithm visualizer"
        lede="Watch binary search, linear search, bubble sort, merge sort, BFS, and DFS work one step at a time. Each step shows what was compared or moved, and the counters show where the cost comes from. You can step back as well as forward."
      />
      <div className="page-body">
        <Visualizer />
      </div>
    </>
  );
}
