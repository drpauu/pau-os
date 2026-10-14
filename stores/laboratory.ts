"use client";
import { create } from "zustand";
export type Quality = "auto" | "high" | "medium" | "low";
export type Station =
  "core" | "athra" | "trackflow" | "cami-curt" | "lab" | "about";
type State = {
  station: Station;
  quality: Quality;
  terminal: boolean;
  introSkipped: boolean;
  theme: "ice" | "titanium";
  select: (s: Station) => void;
  setQuality: (q: Quality) => void;
  setTerminal: (v: boolean) => void;
  skipIntro: () => void;
  setTheme: (t: "ice" | "titanium") => void;
};
export const useLaboratory = create<State>((set) => ({
  station: "core",
  quality: "auto",
  terminal: false,
  introSkipped: false,
  theme: "ice",
  select: (station) => set({ station }),
  setQuality: (quality) => {
    try {
      localStorage.setItem("pau-quality", quality);
    } catch {}
    set({ quality });
  },
  setTerminal: (terminal) => set({ terminal }),
  skipIntro: () => set({ introSkipped: true }),
  setTheme: (theme) => set({ theme }),
}));
