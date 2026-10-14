"use client";
import dynamic from "next/dynamic";
import { StaticScene } from "./StaticScene";
import { professional } from "@/lib/professional";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Focus,
  RotateCcw,
} from "lucide-react";
import { useLaboratory, type Quality, type Station } from "@/stores/laboratory";
import { projects } from "@/lib/content";
const Laboratory = dynamic(() => import("@/components/3d/Laboratory"), {
  ssr: false,
  loading: () => <div className="scene-poster" aria-hidden="true" />,
});
const destinations: { id: Station; name: string; tag: string }[] = projects.map(
  (project) => ({
    id: project.slug as Station,
    name: project.title,
    tag: project.category,
  }),
);
export function Hero() {
  const [introPending, setIntroPending] = useState(true);
  const [qualityReady, setQualityReady] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { station, select, quality, setQuality, skipIntro, introSkipped } =
    useLaboratory();
  useEffect(() => {
    const t = setTimeout(() => setIntroPending(false), 2200);
    try {
      const q = localStorage.getItem("pau-quality");
      if (["auto", "high", "medium", "low"].includes(q ?? ""))
        setQuality(q as Quality);
    } catch {}
    setQualityReady(true);
    return () => clearTimeout(t);
  }, [setQuality]);
  const current = destinations.find((d) => d.id === station) ?? destinations[0];
  const moveStation = (direction: -1 | 1) => {
    const currentIndex = destinations.findIndex((d) => d.id === station);
    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + direction + destinations.length) %
          destinations.length;
    select(destinations[nextIndex].id);
  };
  const handleScenePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.pointerType !== "touch") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    moveStation(dx < 0 ? 1 : -1);
  };
  return (
    <section
      className="hero"
      data-view={station}
      aria-label="Interactive engineering observatory"
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-meta mono">
        <span>
          <i className="status-dot" /> THE ENGINEERING OBSERVATORY
        </span>
        <span>BARCELONA, ES &nbsp; / &nbsp; 41.38° N · 2.17° E</span>
      </div>
      <div className="hero-title">
        <p className="hero-issue mono">SOFTWARE · DATA · DIGITAL PRODUCTS</p>
        <h1>
          PAU
          <br />
          <span>ALCÁZAR</span>
          <span className="title-period">.</span>
        </h1>
        <p className="hero-statement">
          Ideas into systems.
          <br />
          <em>Systems into experiences.</em>
        </p>
        <p className="hero-description">
          I’m a {professional.role} who builds useful
          <br className="desktop-break" /> products, from the algorithm to the
          interface.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/work/">
            Explore my work <ArrowUpRight size={17} />
          </Link>
          <Link className="hero-resume" href="/resume/">
            View resume <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div
        className="scene-container"
        onPointerDown={(event) => {
          if (event.pointerType === "touch")
            touchStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={handleScenePointerUp}
        onPointerCancel={() => {
          touchStart.current = null;
        }}
      >
        {qualityReady && quality !== "low" ? <Laboratory /> : <StaticScene />}
      </div>
      <div className="scene-coordinate mono">
        <span>OBSERVATORY / 01</span>
        <strong>EVERY CONNECTION TELLS A STORY.</strong>
      </div>
      <div className="scene-caption">
        <span className="mono">
          {station === "core" || station === "camicurt"
            ? "01 / FEATURED INSTALLATION"
            : "PROJECT INSTALLATION"}
        </span>
        <Link href={"/work/" + current.id + "/"}>
          {current.name} <ArrowUpRight size={17} />
        </Link>
        <span className="mono">{current.tag}</span>
        <div
          className="mobile-scene-nav"
          aria-label="Browse project installations"
        >
          <button
            type="button"
            aria-label="Previous project installation"
            onClick={() => moveStation(-1)}
          >
            <ArrowLeft size={17} />
          </button>
          <span className="mono">
            {String(
              destinations.findIndex((d) => d.id === current.id) + 1,
            ).padStart(2, "0")}
            <i />
            {String(destinations.length).padStart(2, "0")} · SWIPE TO EXPLORE
          </span>
          <button
            type="button"
            aria-label="Next project installation"
            onClick={() => moveStation(1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="scene-controls">
        <button
          title="Return to overview"
          aria-label="Reset observatory view"
          onClick={() => select("core")}
        >
          <RotateCcw size={15} />
        </button>
        <label>
          <Focus size={15} />
          <span className="sr-only">Scene quality</span>
          <select
            aria-label="Scene quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value as Quality)}
          >
            <option value="auto">AUTO</option>
            <option value="high">HIGH</option>
            <option value="medium">MEDIUM</option>
            <option value="low">LOW / STATIC</option>
          </select>
        </label>
        {introPending && !introSkipped && (
          <button className="skip-intro" onClick={skipIntro}>
            Skip intro
          </button>
        )}
      </div>
      <div className="station-dock" aria-label="Project installations">
        {destinations.map((d, i) => (
          <div
            className={
              "station-card " +
              (station === d.id || (station === "core" && i === 0)
                ? "selected"
                : "")
            }
            key={d.id}
          >
            <button
              onClick={() => select(d.id)}
              aria-label={"Focus " + d.name + " station"}
              aria-pressed={station === d.id}
            >
              <span className="station-number mono">0{i + 1}</span>
              <span>
                <strong>{d.name}</strong>
                <small>{d.tag}</small>
              </span>
            </button>
            <Link
              href={"/work/" + d.id + "/"}
              aria-label={"Read " + d.name + " case study"}
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
        ))}
      </div>
      <div className="hero-bottom mono">
        <a href="#selected-work">
          SCROLL TO DISCOVER <ArrowDown size={14} />
        </a>
        <span>EIGHT PROJECTS. ONE ENGINEERING MINDSET.</span>
      </div>
    </section>
  );
}
