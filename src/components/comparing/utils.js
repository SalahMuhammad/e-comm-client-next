"use client";

import { useState, useEffect } from "react";

/* ============================================================================
   Shared helpers used by TimelineChart, ComparisonTable, and StatusBadge.
   ============================================================================ */

export function parseDate(value) {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

export function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export function sameValue(a, b) {
  const norm = (v) => (v === null || v === undefined || v === "" ? "—" : String(v).trim().toLowerCase());
  return norm(a) === norm(b);
}

// Detects dark mode via the user's system preference.
export function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return isDark;
}