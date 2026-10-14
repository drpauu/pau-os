"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import gsap from "gsap";
import {
  ObservatoryArchitecture,
  PerformanceExhibit,
  BoardExhibit,
  PlanningExhibit,
} from "./scenes/Observatory";
import { StaticScene } from "@/features/laboratory/StaticScene";
import { Catalonia } from "./scenes/Catalonia";
import Link from "next/link";
import { useLaboratory, type Station } from "@/stores/laboratory";

const targets: Record<
  Station,
  { position: [number, number, number]; look: [number, number, number] }
> = {
  core: { position: [6, 15, 17], look: [0, 1, 0] },
  camicurt: { position: [3.6, 11, 11], look: [0, 1.5, 0] },
  athra: { position: [-1.5, 4, 6.7], look: [-4.8, 1, 1.2] },
  alcoholfabet: { position: [7, 5, 8], look: [3.8, 0.85, 4.1] },
  trackflow: { position: [8, 4.5, 2], look: [3.85, 1, -3.1] },
};
class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticScene /> : this.props.children;
  }
}
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, pointer, invalidate, size } = useThree();
  const station = useLaboratory((s) => s.station),
    skipped = useLaboratory((s) => s.introSkipped);
  const destination = useRef(new THREE.Vector3());
  const skipState = useRef(false);
  const look = useRef(new THREE.Vector3(0, 1.1, 0)),
    base = useRef({ x: 11.5, y: 14, z: 17 }),
    started = useRef(false);
  useEffect(() => {
    const d = targets[station];
    const justSkipped = skipped && !skipState.current;
    skipState.current = skipped;
    const duration = reduced || justSkipped ? 0 : started.current ? 0.95 : 1.6;
    started.current = true;
    const aspectScale = size.width / size.height < 0.9 ? 1.15 : 1;
    const tween = gsap.to(base.current, {
      x: d.position[0] * aspectScale,
      y: d.position[1] * aspectScale,
      z: d.position[2] * aspectScale,
      duration,
      ease: "power3.inOut",
      onUpdate: invalidate,
    });
    const focus = gsap.to(look.current, {
      x: d.look[0],
      y: d.look[1],
      z: d.look[2],
      duration,
      ease: "power3.inOut",
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
      focus.kill();
    };
  }, [station, reduced, skipped, invalidate, size.width, size.height]);
  useFrame((_, delta) => {
    const p = base.current;
    camera.position.lerp(
      destination.current.set(
        p.x + (reduced ? 0 : pointer.x * 0.35),
        p.y + (reduced ? 0 : pointer.y * 0.2),
        p.z,
      ),
      reduced ? 1 : 1 - Math.exp(-delta * 6),
    );
    camera.lookAt(look.current);
  });
  return null;
}
const labels: {
  id: Station;
  title: string;
  point: [number, number, number];
}[] = [
  { id: "camicurt", title: "01 / CAMÍ CURT", point: [1.7, 2.35, -2.5] },
  { id: "athra", title: "02 / ATHRA", point: [-4.8, 1.9, 1.2] },
  { id: "alcoholfabet", title: "03 / ALCOHOLFABET", point: [3.8, 1.65, 4.1] },
  { id: "trackflow", title: "04 / TRACKFLOW", point: [3.85, 2.05, -3.1] },
];
function ProjectLabels() {
  const { camera, size, gl } = useThree();
  const point = useRef(new THREE.Vector3());
  useFrame(() => {
    for (const label of labels) {
      const el = gl.domElement
        .closest(".canvas-wrapper")
        ?.querySelector<HTMLElement>('[data-station="' + label.id + '"]');
      if (!el) continue;
      point.current.set(...label.point).project(camera);
      el.style.transform = `translate(${(point.current.x * 0.5 + 0.5) * size.width}px,${(-point.current.y * 0.5 + 0.5) * size.height}px) translate(-50%,-50%)`;
      el.style.visibility = point.current.z < 1 ? "visible" : "hidden";
    }
  });
  return null;
}
function SceneLabels() {
  const station = useLaboratory((s) => s.station),
    select = useLaboratory((s) => s.select);
  return (
    <div className="scene-labels">
      {labels
        .filter((label) => station === "core" || station === label.id)
        .map((label) => (
          <div
            data-station={label.id}
            key={label.id}
            className="projected-label"
          >
            <button
              className={
                "station-label " + (station === label.id ? "active" : "")
              }
              onClick={() => select(label.id)}
            >
              <span className="label-beacon" />
              {label.title}
              <span>↗</span>
            </button>
            {station === label.id && (
              <Link className="station-visit" href={"/work/" + label.id + "/"}>
                Open case study ↗
              </Link>
            )}
          </div>
        ))}
    </div>
  );
}
function Runtime({
  onDegrade,
  reduced,
}: {
  onDegrade: () => void;
  reduced: boolean;
}) {
  const { gl, setFrameloop, invalidate } = useThree();
  useEffect(() => {
    gl.info.autoReset = false;
    return () => {
      gl.info.autoReset = true;
    };
  }, [gl]);
  const sample = useRef({ t: 0, n: 0, slow: 0 });
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const canvas = gl.domElement;
    const observer = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(canvas);
    const vis = () =>
      setVisible(!document.hidden && canvas.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", vis);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [gl]);
  useEffect(() => {
    setFrameloop(visible ? (reduced ? "demand" : "always") : "never");
    if (visible) invalidate();
  }, [visible, reduced, setFrameloop, invalidate]);
  useFrame((_, delta) => {
    const s = sample.current;
    s.n++;
    s.t += delta;
    if (s.t > 3) {
      const fps = Math.round(s.n / s.t);
      gl.domElement.dataset.fps = String(fps);
      gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
      gl.domElement.dataset.triangles = String(gl.info.render.triangles);
      s.slow = fps < 25 ? s.slow + 1 : 0;
      if (s.slow >= 2) {
        onDegrade();
        s.slow = 0;
      }
      s.n = 0;
      s.t = 0;
    }
    gl.info.reset();
  });
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      useLaboratory.getState().setQuality("low");
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl]);
  return null;
}
export default function Laboratory() {
  const quality = useLaboratory((s) => s.quality),
    [tier, setTier] = useState<"high" | "medium" | "low">("medium"),
    [supported, setSupported] = useState(false),
    [reduced, setReduced] = useState(false),
    [hovered, setHovered] = useState<string | null>(null),
    [routeNotice, setRouteNotice] = useState("");
  const station = useLaboratory((s) => s.station);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion.matches);
    const change = () => setReduced(motion.matches);
    motion.addEventListener("change", change);
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    setSupported(!!gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    setTier(
      window.innerWidth < 800 || navigator.hardwareConcurrency <= 4
        ? "medium"
        : "high",
    );
    return () => motion.removeEventListener("change", change);
  }, []);
  const actual = quality === "auto" ? tier : quality;
  if (!supported || actual === "low") return <StaticScene />;
  return (
    <CanvasBoundary>
      <div className="canvas-wrapper" data-quality={actual}>
        <Canvas
          shadows={actual === "high" ? { type: THREE.PCFShadowMap } : false}
          dpr={actual === "high" ? [1, 1.5] : [1, 1]}
          camera={{ position: [11.5, 14, 17], fov: 40, near: 0.1, far: 150 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          fallback={<StaticScene />}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={["#101b20", 28, 65]} />
            <ambientLight intensity={0.6} />
            <hemisphereLight args={["#d1e6e5", "#182322", 0.75]} />
            <directionalLight
              position={[-3, 12, 7]}
              intensity={2.6}
              color="#f3efe0"
              castShadow={actual === "high"}
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-8}
              shadow-camera-right={8}
              shadow-camera-top={8}
              shadow-camera-bottom={-8}
              shadow-bias={-0.001}
            />
            <pointLight
              position={[-6, 4, -2]}
              intensity={40}
              distance={15}
              color="#749fac"
            />
            <pointLight
              position={[5, 6, 0]}
              intensity={30}
              distance={15}
              color="#ebd3a6"
            />
            <Environment resolution={128} frames={1}>
              <Lightformer
                intensity={3}
                position={[0, 8, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[10, 10, 1]}
              />
              <Lightformer
                intensity={2}
                color="#a0cbd3"
                position={[-5, 4, -3]}
                scale={[3, 6, 1]}
              />
              <Lightformer
                intensity={3}
                position={[5, 3, 5]}
                scale={[5, 8, 1]}
              />
            </Environment>
            <CameraRig reduced={reduced} />
            <ProjectLabels />
            <ObservatoryArchitecture />
            <group position={[0, 1.8, 0]} rotation={[0.24, 0, 0]}>
              <Catalonia
                reduced={reduced}
                active={station === "camicurt"}
                onHover={setHovered}
                onSelect={(name, route) =>
                  setRouteNotice("Route to " + name + ": " + route.join(" → "))
                }
              />
            </group>
            <PerformanceExhibit reduced={reduced} />
            <BoardExhibit />
            <PlanningExhibit reduced={reduced} />
            <Runtime
              reduced={reduced}
              onDegrade={() => {
                if (quality === "auto")
                  setTier((t) => (t === "high" ? "medium" : "low"));
              }}
            />
            {actual === "high" && (
              <EffectComposer multisampling={4}>
                <Bloom intensity={0.2} luminanceThreshold={1.3} mipmapBlur />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
        <SceneLabels />
        {hovered && <div className="comarca-hover mono">{hovered}</div>}
        <span className="sr-only" aria-live="polite">
          {routeNotice}
        </span>
      </div>
    </CanvasBoundary>
  );
}
