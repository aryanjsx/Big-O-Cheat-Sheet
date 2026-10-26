"use client";

/* Saved topics, learned topics, the last card opened, and quiz and challenge results.
   Stored in localStorage under the same key as the original site, so existing
   progress carries over. Falls back to memory when storage is blocked, and stays in
   step across open tabs. */

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const KEY = "bigo:v1";

export interface ProgressState {
  bookmarks: string[];
  learned: string[];
  last: string | null;
  quiz: { best: number | null; runs: number };
  challenge: { done: Record<string, boolean> };
}

function strings(x: unknown): string[] {
  return Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(s: any): ProgressState {
  s = s || {};
  return {
    bookmarks: strings(s.bookmarks),
    learned: strings(s.learned),
    last: typeof s.last === "string" ? s.last : null,
    quiz: { best: typeof s.quiz?.best === "number" ? s.quiz.best : null, runs: (s.quiz?.runs | 0) || 0 },
    challenge: { done: s.challenge?.done && typeof s.challenge.done === "object" ? s.challenge.done : {} },
  };
}

// ---------- Store (outside React, read with useSyncExternalStore) ----------
interface Snapshot {
  state: ProgressState;
  persistent: boolean;
}

const SERVER: Snapshot = { state: normalize(null), persistent: true };
let snap: Snapshot | null = null;
const listeners = new Set<() => void>();

function read(): Snapshot {
  if (snap) return snap;
  try {
    snap = { state: normalize(JSON.parse(localStorage.getItem(KEY) || "null")), persistent: true };
  } catch {
    let persistent = true;
    try {
      localStorage.getItem(KEY);
    } catch {
      persistent = false;
    }
    snap = { state: normalize(null), persistent };
  }
  return snap;
}

function commit(state: ProgressState) {
  let persistent = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    persistent = false;
  }
  snap = { state, persistent };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (ev: StorageEvent) => {
    if (ev.key !== KEY) return;
    snap = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function toggle(list: string[], id: string): [string[], boolean] {
  return list.includes(id) ? [list.filter((x) => x !== id), false] : [[...list, id], true];
}

// ---------- React API ----------
interface ProgressApi {
  state: ProgressState;
  persistent: boolean;
  isSaved(id: string): boolean;
  isLearned(id: string): boolean;
  /** Each toggle returns the new value. */
  toggleSaved(id: string): boolean;
  toggleLearned(id: string): boolean;
  setLast(id: string): void;
  recordQuiz(score: number, total: number): void;
  recordChallenge(id: string, ok: boolean): void;
  reset(): void;
  persistenceNote(): string;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  // The server snapshot is empty progress, so the first render matches the static HTML.
  const { state, persistent } = useSyncExternalStore(subscribe, read, () => SERVER);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      persistent,
      isSaved: (id) => state.bookmarks.includes(id),
      isLearned: (id) => state.learned.includes(id),
      toggleSaved(id) {
        const cur = read().state;
        const [bookmarks, on] = toggle(cur.bookmarks, id);
        commit({ ...cur, bookmarks });
        return on;
      },
      toggleLearned(id) {
        const cur = read().state;
        const [learned, on] = toggle(cur.learned, id);
        commit({ ...cur, learned });
        return on;
      },
      setLast(id) {
        const cur = read().state;
        if (cur.last !== id) commit({ ...cur, last: id });
      },
      recordQuiz(score, total) {
        const cur = read().state;
        const pct = Math.round((score / total) * 100);
        commit({ ...cur, quiz: { runs: cur.quiz.runs + 1, best: cur.quiz.best == null || pct > cur.quiz.best ? pct : cur.quiz.best } });
      },
      recordChallenge(id, ok) {
        const cur = read().state;
        commit({ ...cur, challenge: { done: { ...cur.challenge.done, [id]: ok } } });
      },
      reset: () => commit(normalize(null)),
      persistenceNote: () =>
        persistent
          ? "Saved topics and progress stay in this browser. Nothing is sent anywhere."
          : "This browser is blocking local storage, so progress lasts only until you close the page.",
    }),
    [state, persistent],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
