"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during server rendering and hydration, true afterward. Use it to gate browser-only output. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
