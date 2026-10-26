"use client";

import { useSheet } from "@/context/SheetContext";
import { asset } from "@/lib/utils";

export default function Toolbar() {
  const { revision, setRevision, setShortcutsOpen } = useSheet();
  return (
    <div className="toolbar" role="group" aria-label="View and download options">
      <button type="button" className="btn" id="btn-revision" aria-pressed={revision} onClick={() => setRevision(!revision, true)}>
        {revision ? "Back to the full sheet" : "One-page revision view"}
      </button>
      <button type="button" className="btn" onClick={() => window.print()}>
        Print or save as PDF
      </button>
      <a className="btn" href={asset("/Big-O-Sheet.pdf")} download>
        Download full PDF
      </a>
      <a className="btn" href={asset("/Big-O-Sheet-one-page.pdf")} download>
        Download one-page PDF
      </a>
      <button type="button" className="btn" aria-haspopup="dialog" onClick={() => setShortcutsOpen(true)}>
        Keyboard shortcuts
      </button>
    </div>
  );
}
