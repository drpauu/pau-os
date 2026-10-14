"use client";
import { useEffect, useRef, useState } from "react";
export function useAmbientAudio() {
  const context = useRef<AudioContext | null>(null),
    [enabled, setEnabled] = useState(false);
  useEffect(
    () => () => {
      void context.current?.close();
    },
    [],
  );
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) void context.current?.suspend();
      else if (enabled) void context.current?.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [enabled]);
  async function toggle() {
    if (enabled) {
      await context.current?.suspend();
      setEnabled(false);
      return;
    }
    try {
      if (!context.current) {
        const ctx = new AudioContext();
        context.current = ctx;
        const gain = ctx.createGain();
        gain.gain.value = 0.025;
        gain.connect(ctx.destination);
        [55, 82.41, 110.15].forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = f;
          osc.connect(gain);
          osc.start();
        });
      }
      await context.current.resume();
      setEnabled(true);
    } catch {
      setEnabled(false);
    }
  }
  return { enabled, toggle };
}
