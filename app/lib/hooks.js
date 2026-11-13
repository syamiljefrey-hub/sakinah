"use client";
import { useEffect, useState } from "react";
import { loadTimings } from "./api";

export function usePersist(key, init) {
  const [v, setV] = useState(init);
  useEffect(() => { try { const r = localStorage.getItem("sk:" + key); if (r) setV(JSON.parse(r)); } catch {} }, [key]);
  const set = (x) => setV((p) => {
    const n = typeof x === "function" ? x(p) : x;
    try { localStorage.setItem("sk:" + key, JSON.stringify(n)); } catch {}
    return n;
  });
  return [v, set];
}

export function usePrayer(s, offset = 0) {
  const [d, setD] = useState(null);
  useEffect(() => {
    let on = true; setD(null);
    loadTimings(s, offset).then((r) => on && setD(r));
    return () => { on = false; };
  }, [s.lat, s.lng, s.address, s.method, s.school, offset]);
  return d;
}

export function useTick() {
  const [, set] = useState(0);
  useEffect(() => { const id = setInterval(() => set((n) => n + 1), 1000); return () => clearInterval(id); }, []);
}
