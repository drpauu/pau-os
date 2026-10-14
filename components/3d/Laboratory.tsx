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
import { Core } from "./materials/Core";
import {
  Floor,
  Arch,
  Cables,
  StationDesk,
  Particles,
} from "./scenes/Architecture";
import Link from "next/link";
import { useLaboratory, type Station } from "@/stores/laboratory";

const targets: Record<
  Station,
  { position: [number, number, number]; look: [number, number, number] }
> = {
  core: { position: [11, 8.5, 13], look: [0, 1.1, 0] },
  athra: { position: [8, 5, 7], look: [-3, 1.4, 0.8] },
  trackflow: { position: [10, 5, 2.5], look: [2.8, 1.1, -2.2] },
  "cami-curt": { position: [6, 4.3, 10], look: [2.4, 1, 3.1] },
  lab: { position: [4, 4, 4], look: [-3.4, 1.8, -2.6] },
  about: { position: [12, 8, 14], look: [0, 1.1, 0] },
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
function StaticScene() {
  return (
    <div
      className="scene-poster"
      role="img"
      aria-label="The PAU.OS laboratory in static mode"
    >
      <span className="fallback-label mono">
        STATIC VIEW / ALL CONTENT AVAILABLE BELOW
      </span>
    </div>
  );
}
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, pointer, invalidate } = useThree();
  const station = useLaboratory((s) => s.station),
    skipped = useLaboratory((s) => s.introSkipped);
  const destination = useRef(new THREE.Vector3());
  const skipState = useRef(false);
  const look = useRef(new THREE.Vector3(0, 1.1, 0)),
    base = useRef({ x: 14, y: 10, z: 17 }),
    started = useRef(false);
  useEffect(() => {
    const d = targets[station];
    const justSkipped = skipped && !skipState.current;
    skipState.current = skipped;
    const duration = reduced || justSkipped ? 0 : started.current ? 1.35 : 2;
    started.current = true;
    const tween = gsap.to(base.current, {
      x: d.position[0],
      y: d.position[1],
      z: d.position[2],
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
  }, [station, reduced, skipped, invalidate]);
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
  { id: "core", title: "PAU.OS / CORE", point: [0, 4.85, 0] },
  { id: "lab", title: "ENGINEERING LAB", point: [-3.4, 3.2, -2.6] },
  { id: "athra", title: "ATHRA", point: [-3.3, 1.9, 1.2] },
  { id: "trackflow", title: "TRACKFLOW", point: [2.8, 1.9, -2.4] },
  { id: "cami-curt", title: "CAMÍ CURT", point: [2.5, 1.9, 3.1] },
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
      {labels.map((label) => (
        <div data-station={label.id} key={label.id} className="projected-label">
          {label.id === "core" ? (
            <Link href="/about/" className="core-label">
              <span className="mono">PAU.OS / CORE</span>
              <span>ENGINEERING IN MOTION ↗</span>
            </Link>
          ) : (
            <>
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
                <Link
                  className="station-visit"
                  href={
                    label.id === "lab" ? "/lab/" : "/projects/" + label.id + "/"
                  }
                >
                  {label.id === "lab"
                    ? "Open experiment ↗"
                    : "Open case study ↗"}
                </Link>
              )}
            </>
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
    [reduced, setReduced] = useState(false);
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
          camera={{ position: [14, 10, 17], fov: 40, near: 0.1, far: 150 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          fallback={<StaticScene />}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={["#080e14", 22, 55]} />
            <ambientLight intensity={0.35} />
            <hemisphereLight args={["#9bccdf", "#0a1522", 0.85]} />
            <directionalLight
              position={[3, 10, 5]}
              intensity={3}
              color="#c6e5f0"
              castShadow={actual === "high"}
              shadow-mapSize={[1024, 1024]}
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
              color="#2c90bf"
            />
            <pointLight
              position={[5, 6, 0]}
              intensity={30}
              distance={15}
              color="#d8efff"
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
                color="#67baff"
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
            <Floor />
            <Core reduced={reduced} />
            <Arch />
            <Cables />
            <StationDesk
              id="athra"
              name="ATHRA"
              position={[-3.3, 0, 1.2]}
              rotation={0.4}
              kind={0}
            />
            <StationDesk
              id="trackflow"
              name="TRACKFLOW"
              position={[2.8, 0, -2.4]}
              rotation={0.4}
              kind={1}
            />
            <StationDesk
              id="cami-curt"
              name="CAMÍ CURT"
              position={[2.5, 0, 3.1]}
              rotation={-0.25}
              kind={2}
            />
            {actual === "high" && <Particles />}
            <Runtime
              reduced={reduced}
              onDegrade={() => {
                if (quality === "auto")
                  setTier((t) => (t === "high" ? "medium" : "low"));
              }}
            />
            {actual === "high" && (
              <EffectComposer multisampling={4}>
                <Bloom intensity={0.35} luminanceThreshold={1} mipmapBlur />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
        <SceneLabels />
      </div>
    </CanvasBoundary>
  );
}
