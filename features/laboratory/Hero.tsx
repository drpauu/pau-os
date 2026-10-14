"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Focus,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLaboratory, type Quality, type Station } from "@/stores/laboratory";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
const Laboratory = dynamic(() => import("@/components/3d/Laboratory"), {
  ssr: false,
  loading: () => <div className="scene-poster" aria-hidden="true" />,
});
const destinations: { id: Station; name: string; tag: string; href: string }[] =
  [
    {
      id: "athra",
      name: "ATHRA",
      tag: "HUMAN PERFORMANCE",
      href: "/projects/athra/",
    },
    {
      id: "trackflow",
      name: "TRACKFLOW",
      tag: "CONNECTED SYSTEMS",
      href: "/projects/trackflow/",
    },
    {
      id: "cami-curt",
      name: "CAMÍ CURT",
      tag: "PLAYFUL ALGORITHMS",
      href: "/projects/cami-curt/",
    },
  ];
export function Hero() {
  const [introPending, setIntroPending] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntroPending(false), 3500);
    return () => clearTimeout(t);
  }, []);
  const { station, select, quality, setQuality, skipIntro, introSkipped } =
      useLaboratory(),
    { enabled, toggle } = useAmbientAudio();
  useEffect(() => {
    try {
      const q = localStorage.getItem("pau-quality");
      if (["auto", "high", "medium", "low"].includes(q ?? ""))
        setQuality(q as Quality);
    } catch {}
  }, [setQuality]);
  return (
    <section className="hero" aria-label="Interactive engineering laboratory">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-meta mono">
        <span>
          <i className="status-dot" /> INTERACTIVE ENGINEERING LABORATORY
        </span>
        <span>BARCELONA / EST. IN CURIOSITY</span>
      </div>
      <div className="hero-title">
        <p className="hero-issue mono">
          SOFTWARE ENGINEER & DATA / AI CONSULTANT
        </p>
        <h1>
          PAU
          <br />
          <span>ALCÁZAR</span>
          <span className="title-period">.</span>
        </h1>
        <p className="hero-statement">
          Building what
          <br />
          <em>comes next.</em>
        </p>
        <p className="hero-description">
          An interactive space for engineering,
          <br className="desktop-break" /> data and independent digital
          products.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/projects/">
            Explore my work <ArrowUpRight size={17} />
          </Link>
          <Link className="hero-resume" href="/resume/">
            Resume <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="scene-container">
        <Laboratory />
      </div>
      <div className="scene-coordinate mono">
        <span>FIG. 001</span>
        <strong>THE IDEA REACTOR</strong>
        <span>SELECT A STATION TO EXPLORE</span>
      </div>
      <div className="scene-controls">
        <button
          title="Return to overview"
          aria-label="Reset laboratory view"
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
        <button
          onClick={toggle}
          aria-label={enabled ? "Mute ambient audio" : "Enable ambient audio"}
          aria-pressed={enabled}
        >
          {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        {introPending && !introSkipped && (
          <button className="skip-intro" onClick={skipIntro}>
            Skip intro
          </button>
        )}
      </div>
      <div className="station-dock">
        <div className="dock-label mono">
          <span className="status-dot" /> THE LABORATORY
          <span>CHOOSE YOUR NEXT STOP</span>
        </div>
        {destinations.map((d, i) => (
          <div
            className={"station-card " + (station === d.id ? "selected" : "")}
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
              <span className="station-dot" />
            </button>
            <Link href={d.href} aria-label={"Read " + d.name + " case study"}>
              <ArrowUpRight size={20} />
            </Link>
          </div>
        ))}
      </div>
      <div className="hero-bottom mono">
        <a href="#selected-work">
          SCROLL TO DISCOVER <ArrowDown size={14} />
        </a>
        <span>MADE OF CODE. DRIVEN BY CURIOSITY.</span>
      </div>
    </section>
  );
}
