"use client";

/* Keyboard shortcuts: the global key handler and the dialog that lists them. */

import { useEffect, useRef } from "react";
import { useSheet } from "@/context/SheetContext";

const SHORTCUTS: [string[], string][] = [
  [["/"], "Focus the search box"],
  [["?"], "Show this list of shortcuts"],
  [["r"], "Switch between the full sheet and the one-page revision view"],
  [["b"], "Save or unsave the card that has focus"],
  [["l"], "Mark the card that has focus as learned or not learned"],
  [["Space", "Left arrow", "Right arrow"], "In the visualizer: play or pause, step back, step forward"],
  [["1 to 4", "Enter"], "In the quiz: pick an answer, then go to the next question"],
  [["Escape"], "Close this list"],
];

export default function Shortcuts() {
  const { shortcutsOpen, setShortcutsOpen, revision, setRevision } = useSheet();
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    if (shortcutsOpen && !dlg.open) {
      returnFocus.current = document.activeElement;
      dlg.showModal();
      dlg.querySelector("button")?.focus();
    } else if (!shortcutsOpen && dlg.open) {
      dlg.close();
    }
  }, [shortcutsOpen]);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const t = ev.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable) return;
      if (tag === "BUTTON" && (ev.key === " " || ev.key === "Enter")) return;
      const k = ev.key;
      if (k === "/") {
        const q = document.getElementById("q");
        if (q) {
          ev.preventDefault();
          q.scrollIntoView({ block: "center" });
          q.focus();
        }
      } else if (k === "?") {
        ev.preventDefault();
        setShortcutsOpen(true);
      } else if (k === "r") {
        setRevision(!revision, true);
      } else if (k === "b" || k === "l") {
        const card = t?.closest?.(".card");
        if (!card) return;
        const sel = k === "b" ? 'button[aria-pressed][aria-label^="Save "]' : 'button[aria-pressed][aria-label^="Mark "]';
        const btn = card.querySelector<HTMLButtonElement>(sel);
        if (btn) {
          ev.preventDefault();
          btn.click();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [revision, setRevision, setShortcutsOpen]);

  return (
    <dialog
      ref={dialog}
      className="shortcuts"
      aria-labelledby="shortcuts-title"
      onClose={() => {
        setShortcutsOpen(false);
        (returnFocus.current as HTMLElement | null)?.focus?.();
      }}
      onClick={(ev) => ev.target === dialog.current && setShortcutsOpen(false)}
    >
      <h2 id="shortcuts-title" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
        Keyboard shortcuts
      </h2>
      <dl className="shortcut-list">
        {SHORTCUTS.map(([keys, desc]) => (
          <div key={desc} style={{ display: "contents" }}>
            <dt>
              {keys.map((k, i) => (
                <span key={k}>
                  {i > 0 && " "}
                  <kbd>{k}</kbd>
                </span>
              ))}
            </dt>
            <dd>{desc}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className="btn" onClick={() => setShortcutsOpen(false)}>
        Close
      </button>
    </dialog>
  );
}
