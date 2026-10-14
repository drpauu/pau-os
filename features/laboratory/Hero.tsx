"use client";
import dynamic from "next/dynamic";
import { professional } from "@/lib/professional";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useLaboratory, type Station } from "@/stores/laboratory";
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
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{
    pointerId: number;
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  } | null>(null);
  const {
    station,
    orbit,
    select,
    rotate,
    skipIntro,
    introSkipped,
  } = useLaboratory();
  useEffect(() => {
    const t = setTimeout(() => setIntroPending(false), 2200);
    return () => clearTimeout(t);
  }, []);
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
  const handleScenePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLCanvasElement) || event.button !== 0)
      return;
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
  };
  const handleScenePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.lastX;
    const dy = event.clientY - active.lastY;
    active.lastX = event.clientX;
    active.lastY = event.clientY;
    if (
      !active.moved &&
      Math.hypot(event.clientX - active.x, event.clientY - active.y) > 4
    ) {
      active.moved = true;
      setIsDragging(true);
    }
    if (active.moved)
      rotate(-dx * 0.006, event.pointerType === "touch" ? 0 : dy * 0.0035);
  };
  const finishSceneDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setIsDragging(false);
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
      </div>
      <div
        className={"scene-container" + (isDragging ? " is-dragging" : "")}
        data-orbit-yaw={orbit[0].toFixed(3)}
        role="group"
        aria-label="Interactive 3D observatory. Drag the scene to look around; use the project controls to choose an installation."
        onPointerDown={handleScenePointerDown}
        onPointerMove={handleScenePointerMove}
        onPointerUp={finishSceneDrag}
        onPointerCancel={finishSceneDrag}
      >
        <Laboratory />
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
            {String(destinations.length).padStart(2, "0")} · DRAG TO ORBIT
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
        <span>DRAG TO ORBIT · EIGHT PROJECTS TO EXPLORE.</span>
      </div>
    </section>
  );
}
