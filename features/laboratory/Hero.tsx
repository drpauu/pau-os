"use client";
import dynamic from "next/dynamic";
import { StaticScene } from "./StaticScene";
import { professional } from "@/lib/professional";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Focus, RotateCcw } from "lucide-react";
import { useLaboratory, type Quality, type Station } from "@/stores/laboratory";
const Laboratory = dynamic(() => import("@/components/3d/Laboratory"), {
  ssr: false,
  loading: () => <div className="scene-poster" aria-hidden="true" />,
});
const destinations: { id: Station; name: string; tag: string }[] = [
  { id: "camicurt", name: "CAMÍ CURT", tag: "GEOGRAPHY × GRAPH THEORY" },
  { id: "athra", name: "ATHRA", tag: "HUMAN PERFORMANCE" },
  { id: "alcoholfabet", name: "ALCOHOLFABET", tag: "PLAY × SHARED STATE" },
  { id: "trackflow", name: "TRACKFLOW", tag: "STRUCTURE × TIME" },
];
export function Hero() {
  const [introPending, setIntroPending] = useState(true);
  const [qualityReady, setQualityReady] = useState(false);
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
      <div className="scene-container">
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
        <span>FOUR PRODUCTS. ONE ENGINEERING MINDSET.</span>
      </div>
    </section>
  );
}
