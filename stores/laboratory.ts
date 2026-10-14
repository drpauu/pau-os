"use client";
import { create } from "zustand";
export type Quality = "auto" | "high" | "medium" | "low";
export type Station =
  | "core"
  | "camicurt"
  | "athra"
  | "alcoholfabet"
  | "trackflow"
  | "adhoc-medical-data-processing"
  | "connect4-ai"
  | "checkers-ai"
  | "esinmath";
type State = {
  station: Station;
  orbit: [number, number];
  quality: Quality;
  terminal: boolean;
  introSkipped: boolean;
  theme: "ice" | "titanium";
  select: (s: Station) => void;
  rotate: (yawDelta: number, pitchDelta: number) => void;
  setQuality: (q: Quality) => void;
  setTerminal: (v: boolean) => void;
  skipIntro: () => void;
  setTheme: (t: "ice" | "titanium") => void;
};
export const useLaboratory = create<State>((set) => ({
  station: "core",
  orbit: [0, 0],
  quality: "auto",
  terminal: false,
  introSkipped: false,
  theme: "ice",
  select: (station) => set({ station, orbit: [0, 0] }),
  rotate: (yawDelta, pitchDelta) =>
    set((state) => ({
      orbit: [
        clamp(state.orbit[0] + yawDelta, -1.25, 1.25),
        clamp(state.orbit[1] + pitchDelta, -0.48, 0.58),
      ],
    })),
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
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
