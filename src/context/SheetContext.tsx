"use client";

/* Page-level UI state that several sections share: search filters, the card to open,
   the comparison pair, the revision view, the shortcuts dialog, printable cards, and
   screen reader announcements. Also handles share links (#algo=…, #compare=…, #revision). */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { COMPARE } from "@/data/compare";
import { entryById } from "@/data/entries";
import type { Entry } from "@/data/types";
import { EMPTY_FILTERS, type Filters } from "@/lib/search";

export interface CardTarget {
  id: string;
  quiet: boolean;
  /** Changes on every request, so opening the same card twice still scrolls to it. */
  nonce: number;
}

interface SheetApi {
  filters: Filters;
  setFilters(f: Filters): void;
  target: CardTarget | null;
  /** Clears the filters, then opens, scrolls to, and focuses a card. */
  openAlgo(id: string, quiet?: boolean): boolean;

  compare: { a: string; b: string };
  setCompare(a: string, b: string, updateHash: boolean): void;
  /** Picks a topic from a card, with a sensible partner, then scrolls to the comparison. */
  pickCompare(id: string): void;
  compareFocusNonce: number;

  revision: boolean;
  setRevision(on: boolean, updateHash: boolean): void;

  shortcutsOpen: boolean;
  setShortcutsOpen(open: boolean): void;

  printList: Entry[] | null;
  setPrintList(list: Entry[] | null): void;

  liveMessage: string;
  announce(msg: string): void;
}

const SheetContext = createContext<SheetApi | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [target, setTarget] = useState<CardTarget | null>(null);
  const [compare, setCompareState] = useState({ a: "mergesort", b: "quicksort" });
  const [compareFocusNonce, setCompareFocusNonce] = useState(0);
  const [revision, setRevisionState] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [printList, setPrintList] = useState<Entry[] | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const nonce = useRef(0);

  const announce = useCallback((msg: string) => {
    setLiveMessage("");
    setTimeout(() => setLiveMessage(msg), 20);
  }, []);

  const openAlgo = useCallback((id: string, quiet = false) => {
    if (!entryById(id)) return false;
    setFilters(EMPTY_FILTERS);
    setTarget({ id, quiet, nonce: ++nonce.current });
    return true;
  }, []);

  const setCompare = useCallback((a: string, b: string, updateHash: boolean) => {
    if (!COMPARE[a] || !COMPARE[b]) return;
    setCompareState({ a, b });
    if (updateHash) {
      try {
        history.replaceState(null, "", "#compare=" + a + "," + b);
      } catch {}
    }
  }, []);

  const pickCompare = useCallback(
    (id: string) => {
      const item = COMPARE[id];
      if (!item) return;
      let b = compare.b;
      if (b === id || COMPARE[b].kind !== item.kind) {
        b = Object.keys(COMPARE).find((k) => k !== id && COMPARE[k].kind === item.kind) || b;
      }
      setCompare(id, b, true);
      setCompareFocusNonce((n) => n + 1);
    },
    [compare.b, setCompare],
  );

  const setRevision = useCallback((on: boolean, updateHash: boolean) => {
    setRevisionState(on);
    if (updateHash) history.replaceState(null, "", on ? "#revision" : location.pathname + location.search);
    if (on) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("revision", revision);
  }, [revision]);

  // Share links. Runs once on load and again whenever the hash changes.
  useEffect(() => {
    function route() {
      const h = location.hash.replace(/^#/, "");
      if (h === "revision") {
        setRevision(true, false);
        return;
      }
      let m = /^algo=([a-z0-9-]+)$/.exec(h);
      if (m) {
        openAlgo(m[1], true);
        return;
      }
      m = /^compare=([a-z0-9-]+),([a-z0-9-]+)$/.exec(h);
      if (m) {
        setCompare(m[1], m[2], false);
        document.getElementById("compare")?.scrollIntoView();
      }
    }
    route();
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, [openAlgo, setCompare, setRevision]);

  const api = useMemo<SheetApi>(
    () => ({
      filters,
      setFilters,
      target,
      openAlgo,
      compare,
      setCompare,
      pickCompare,
      compareFocusNonce,
      revision,
      setRevision,
      shortcutsOpen,
      setShortcutsOpen,
      printList,
      setPrintList,
      liveMessage,
      announce,
    }),
    [filters, target, openAlgo, compare, setCompare, pickCompare, compareFocusNonce, revision, setRevision, shortcutsOpen, printList, liveMessage, announce],
  );

  return <SheetContext.Provider value={api}>{children}</SheetContext.Provider>;
}

export function useSheet(): SheetApi {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used inside <SheetProvider>");
  return ctx;
}
