import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { Body, GlowRing, machinedBox } from "./Geometry";
import { useLaboratory } from "@/stores/laboratory";

const mint = "#c4e8dc",
  brass = "#c7ac7b";
function Drum({
  radius,
  height,
  y = 0,
  color = "#343d42",
}: {
  radius: number;
  height: number;
  y?: number;
  color?: string;
}) {
  const geometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, -height / 2),
          new THREE.Vector2(radius - 0.1, -height / 2),
          new THREE.Vector2(radius, -0.5 * height + 0.065),
          new THREE.Vector2(radius, height * 0.5 - 0.065),
          new THREE.Vector2(radius - 0.06, height / 2),
          new THREE.Vector2(0, height / 2),
        ],
        96,
      ),
    [radius, height],
  );
  return (
    <mesh geometry={geometry} position={[0, y, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}
export function ObservatoryArchitecture() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.65, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
      <Drum radius={7.1} height={0.35} y={-0.38} color="#29343a" />
      <Drum radius={6.94} height={0.09} y={-0.17} color="#4a5559" />
      <Drum radius={6.85} height={0.12} y={-0.1} color="#18262b" />
      <GlowRing radius={6.93} y={-0.25} thickness={0.012} color="#a8c5c6" />
      <GlowRing radius={6.5} y={-0.025} thickness={0.006} color="#465961" />
      <GlowRing radius={4.15} y={-0.02} thickness={0.008} color="#61797d" />
      <Instances limit={96}>
        <boxGeometry args={[0.018, 0.012, 0.16]} />
        <meshStandardMaterial color="#78908e" metalness={0.7} roughness={0.4} />
        {Array.from({ length: 96 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          return (
            <Instance
              key={i}
              position={[Math.sin(a) * 6.6, -0.015, Math.cos(a) * 6.6]}
              rotation={[0, a, 0]}
              scale={[1, 1, i % 8 === 0 ? 2.5 : 1]}
            />
          );
        })}
      </Instances>
      {/* A machined instrument pedestal, not a second focal object. */}
      <Drum radius={3.68} height={0.35} y={0.2} color="#343f44" />
      <Drum radius={3.49} height={0.19} y={0.48} color="#8b9999" />
      <Drum radius={3.42} height={0.32} y={0.69} color="#263a3e" />
      <GlowRing radius={3.45} y={0.56} thickness={0.02} color={brass} />
      <GlowRing radius={3.39} y={0.84} thickness={0.015} color={mint} />
      <mesh position={[0, 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.34, 96]} />
        <meshPhysicalMaterial
          color="#182c30"
          metalness={0.55}
          roughness={0.2}
          clearcoat={1}
        />
      </mesh>
      <Instances limit={80}>
        <boxGeometry args={[0.035, 0.16, 0.035]} />
        <meshStandardMaterial
          color="#bcc5bf"
          metalness={0.85}
          roughness={0.25}
        />
        {Array.from({ length: 80 }, (_, i) => {
          const a = (i / 80) * Math.PI * 2;
          return (
            <Instance
              key={i}
              position={[Math.sin(a) * 3.52, 0.43, Math.cos(a) * 3.52]}
              rotation={[0, a, 0]}
            />
          );
        })}
      </Instances>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2 + Math.PI / 4, 0]}>
          <Body
            position={[0, 0.22, 3.8]}
            scale={[0.33, 0.48, 0.65]}
            color="#778788"
          />
          <mesh position={[0, 0.47, 3.85]}>
            <cylinderGeometry args={[0.095, 0.095, 0.035, 12]} />
            <meshStandardMaterial
              color="#b5bcb1"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      {/* Curved architectural gantry: dim metal outside, a white task light within. */}
      <group position={[0, 1, -4.3]} rotation={[0.22, 0, 0]}>
        <mesh>
          <torusGeometry args={[4.8, 0.075, 8, 96, Math.PI]} />
          <meshStandardMaterial
            color="#617478"
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <torusGeometry args={[4.67, 0.024, 6, 96, Math.PI]} />
          <meshBasicMaterial color="#e0f0e5" toneMapped={false} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <Body
              position={[4.8 * s, -0.35, 0]}
              scale={[0.18, 1.3, 0.3]}
              color="#647477"
            />
            <Body position={[4.8 * s, -0.9, 0]} scale={[0.65, 0.22, 0.75]} />
          </group>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <group
          key={s}
          position={[s * 5.25, 0, -4.55]}
          rotation={[0, s * -0.3, 0]}
        >
          <Body
            position={[0, 1.1, 0]}
            scale={[0.28, 2.2, 0.28]}
            color="#46595f"
          />
          <Body
            position={[0, 2.3, 0.5]}
            scale={[0.35, 0.12, 1.5]}
            color="#758587"
          />
          <mesh position={[0, 2.23, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 1.2]} />
            <meshBasicMaterial color="#d8f0df" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function ExhibitBase({ color = mint }: { color?: string }) {
  return (
    <group>
      <Drum radius={1.2} height={0.22} y={0.12} />
      <Drum radius={1.12} height={0.12} y={0.28} color="#526569" />
      <GlowRing radius={1.11} y={0.34} color={color} thickness={0.012} />
      <Body
        position={[0, 0.48, 0]}
        scale={[0.32, 0.35, 0.32]}
        color="#83928f"
      />
    </group>
  );
}
export function PerformanceExhibit({ reduced }: { reduced: boolean }) {
  const active = useLaboratory((s) => s.station === "athra"),
    select = useLaboratory((s) => s.select);
  const marker = useRef<THREE.Mesh>(null);
  const curves = useMemo(
    () =>
      [0, 1, 2].map((layer) =>
        Array.from({ length: 64 }, (_, i) => {
          const x = (i / 63) * 2.35 - 1.175;
          return new THREE.Vector3(
            x,
            1.05 +
              Math.sin(i * 0.13 + layer * 0.8) * 0.23 +
              Math.sin(i * 0.35) * 0.055,
            -0.35 + layer * 0.35,
          );
        }),
      ),
    [],
  );
  useFrame(({ clock }) => {
    if (marker.current && !reduced) {
      const t = (clock.elapsedTime * 0.085) % 1;
      marker.current.position.copy(curves[0][Math.floor(t * 63)]);
    }
  });
  return (
    <group
      position={[-4.8, 0, 1.2]}
      rotation={[0, 0.35, 0]}
      onClick={(e) => {
        e.stopPropagation();
        select("athra");
      }}
    >
      <ExhibitBase color="#b3d9f0" />
      <Body position={[0, 0.72, 0]} scale={[2.6, 0.09, 1.4]} color="#647d86" />
      <Body
        position={[0, 0.78, 0]}
        scale={[2.42, 0.025, 1.25]}
        color="#122934"
      />
      {curves.map((curve, i) => (
        <Line
          key={i}
          points={curve}
          color={i === 0 ? "#c0e8ff" : "#5b8a9c"}
          lineWidth={i === 0 ? 2.4 : 1.4}
        />
      ))}
      <mesh ref={marker} position={curves[0][0]}>
        <sphereGeometry args={[0.055, 12, 8]} />
        <meshBasicMaterial color="#f0f9ff" />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <Line
          key={i}
          points={[
            [-1.15 + i * 0.23, 0.805, -0.6],
            [-1.15 + i * 0.23, 0.805, 0.6],
          ]}
          color="#3e626c"
          lineWidth={0.5}
        />
      ))}
      {[-1, 1].map((s) => (
        <Body
          key={s}
          position={[s * 1.3, 1.05, -0.61]}
          scale={[0.07, 0.58, 0.08]}
          color="#bcc8c4"
        />
      ))}
      <Line
        points={[
          [-1.3, 1.35, -0.61],
          [1.3, 1.35, -0.61],
        ]}
        color={active ? mint : "#6e949e"}
        lineWidth={1.3}
      />
    </group>
  );
}
const boardColors = [
  "#cbbba0",
  "#bd7775",
  "#779ba3",
  "#b49c6d",
  "#869b73",
  "#abb5bb",
];
const boardTiles = Array.from({ length: 24 }, (_, i) => {
  const side = Math.floor(i / 6);
  const j = i % 6;
  return {
    position: [
      side === 0
        ? -0.9 + j * 0.3
        : side === 1
          ? 0.9
          : side === 2
            ? 0.9 - j * 0.3
            : -0.9,
      0.89,
      side === 0
        ? -0.9
        : side === 1
          ? -0.9 + j * 0.3
          : side === 2
            ? 0.9
            : 0.9 - j * 0.3,
    ] as [number, number, number],
    color: boardColors[i % boardColors.length],
  };
});
export function BoardExhibit() {
  const select = useLaboratory((s) => s.select);
  return (
    <group
      position={[3.8, 0, 4.1]}
      rotation={[0, -0.25, 0]}
      onClick={(e) => {
        e.stopPropagation();
        select("alcoholfabet");
      }}
    >
      <ExhibitBase color="#ddbe91" />
      <Body position={[0, 0.72, 0]} scale={[2.3, 0.18, 2.3]} color="#a9987a" />
      <Body
        position={[0, 0.83, 0]}
        scale={[2.15, 0.055, 2.15]}
        color="#343639"
      />
      <Instances limit={boardTiles.length} castShadow receiveShadow>
        <primitive object={machinedBox} attach="geometry" dispose={null} />
        <meshStandardMaterial color="white" metalness={0.72} roughness={0.33} />
        {boardTiles.map((tile, i) => (
          <Instance
            key={i}
            position={tile.position}
            scale={[0.26, 0.065, 0.26]}
            color={tile.color}
          />
        ))}
      </Instances>
      <Body
        position={[0, 0.89, 0]}
        scale={[0.75, 0.055, 0.75]}
        color="#7b867d"
      />
      {[
        [-0.6, -0.9],
        [0.9, 0.3],
        [-0.3, 0.9],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.94, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.1, 0.16, 16]} />
            <meshStandardMaterial
              color={["#e3bd77", "#a2d5d3", "#d6a7a9"][i]}
              metalness={0.35}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshStandardMaterial
              color={["#e3bd77", "#a2d5d3", "#d6a7a9"][i]}
              metalness={0.35}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
      <Body
        position={[0.15, 1.04, 0.13]}
        scale={[0.22, 0.22, 0.22]}
        rotation={[0, 0.3, 0]}
        color="#e1dccb"
      />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.09 + i * 0.055, 1.155, 0.07 + i * 0.055]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.017, 8]} />
          <meshBasicMaterial color="#263b3d" />
        </mesh>
      ))}
    </group>
  );
}
export function PlanningExhibit({ reduced }: { reduced: boolean }) {
  const select = useLaboratory((s) => s.select);
  const sweep = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (sweep.current && !reduced)
      sweep.current.position.x = Math.sin(clock.elapsedTime * 0.35) * 0.95;
  });
  return (
    <group
      position={[3.85, 0, -3.1]}
      rotation={[0, -0.3, 0]}
      onClick={(e) => {
        e.stopPropagation();
        select("trackflow");
      }}
    >
      <ExhibitBase color="#b8c8e0" />
      {[0, 1, 2].map((layer) => (
        <group key={layer} position={[0, 0.75 + layer * 0.37, 0]}>
          <Body
            scale={[2.35, 0.045, 1.35]}
            color={layer === 2 ? "#556b7b" : "#304654"}
          />
          {[-1, 1].map((s) => (
            <Body
              key={s}
              position={[s * 1.08, -0.14, -0.56]}
              scale={[0.035, 0.3, 0.035]}
              color="#9faeaf"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <group
              key={i}
              position={[-0.8 + i * 0.65, 0.045, -0.35 + i * 0.35]}
            >
              <Body
                scale={[0.5 + (i % 2) * 0.2, 0.045, 0.2]}
                color={layer === 1 ? "#bbad8d" : "#98b8c4"}
              />
            </group>
          ))}
        </group>
      ))}
      <mesh ref={sweep} position={[0, 1.57, 0]}>
        <boxGeometry args={[0.025, 0.035, 1.4]} />
        <meshBasicMaterial color="#d0e3df" />
      </mesh>
    </group>
  );
}

/** Four compact, tactile studies keep the rest of the pinned portfolio present
 * in the same room without competing with Camí Curt's central map. */
export function PinnedExhibits() {
  const select = useLaboratory((s) => s.select);
  const projects = [
    {
      id: "adhoc-medical-data-processing" as const,
      position: [-5.15, 0, -3.05] as [number, number, number],
      color: "#9fc9d3",
    },
    {
      id: "connect4-ai" as const,
      position: [-0.65, 0, 5.85] as [number, number, number],
      color: "#d67c69",
    },
    {
      id: "checkers-ai" as const,
      position: [5.55, 0, 0.15] as [number, number, number],
      color: "#d9c797",
    },
    {
      id: "esinmath" as const,
      position: [-1.25, 0, -5.8] as [number, number, number],
      color: "#b4afe0",
    },
  ];
  return (
    <>
      {projects.map((project, projectIndex) => (
        <group
          key={project.id}
          position={project.position}
          onClick={(event) => {
            event.stopPropagation();
            select(project.id);
          }}
        >
          <ExhibitBase color={project.color} />
          {projectIndex === 0 && (
            <>
              {[-0.58, 0, 0.58].map((x, i) => (
                <group key={x}>
                  <Line
                    points={[
                      [x, 0.82, -0.46],
                      [x * 0.75, 1.2 + (i % 2) * 0.18, 0],
                      [x * 0.5, 0.9, 0.46],
                    ]}
                    color={project.color}
                    lineWidth={1.4}
                  />
                  <mesh position={[x * 0.75, 1.2 + (i % 2) * 0.18, 0]}>
                    <sphereGeometry args={[0.105, 16, 12]} />
                    <meshStandardMaterial
                      color={project.color}
                      metalness={0.45}
                      roughness={0.25}
                    />
                  </mesh>
                </group>
              ))}
            </>
          )}
          {projectIndex === 1 && (
            <>
              <Body
                position={[0, 0.83, 0]}
                scale={[0.96, 0.09, 0.72]}
                color="#27363d"
              />
              {Array.from({ length: 7 }, (_, i) => (
                <mesh
                  key={i}
                  position={[
                    -0.66 + (i % 4) * 0.44,
                    0.98,
                    -0.45 + Math.floor(i / 4) * 0.52,
                  ]}
                >
                  <cylinderGeometry args={[0.13, 0.13, 0.12, 24]} />
                  <meshStandardMaterial
                    color={i % 2 ? "#e6c66f" : "#d66f61"}
                    metalness={0.35}
                    roughness={0.28}
                  />
                </mesh>
              ))}
            </>
          )}
          {projectIndex === 2 && (
            <>
              <Body
                position={[0, 0.82, 0]}
                scale={[0.95, 0.08, 0.72]}
                color="#28343a"
              />
              {Array.from({ length: 16 }, (_, i) => (
                <mesh
                  key={i}
                  position={[
                    -0.66 + (i % 4) * 0.44,
                    0.93,
                    -0.48 + Math.floor(i / 4) * 0.32,
                  ]}
                >
                  <boxGeometry args={[0.22, 0.025, 0.16]} />
                  <meshStandardMaterial
                    color={(i + Math.floor(i / 4)) % 2 ? "#87918b" : "#34434a"}
                    metalness={0.4}
                    roughness={0.38}
                  />
                </mesh>
              ))}
              {[
                [0, 0.98, -0.32],
                [0.44, 0.98, 0],
                [-0.44, 0.98, 0.32],
              ].map((p, i) => (
                <mesh key={i} position={p as [number, number, number]}>
                  <cylinderGeometry args={[0.095, 0.095, 0.09, 20]} />
                  <meshStandardMaterial
                    color={i === 1 ? "#d4c49a" : "#202b30"}
                    metalness={0.5}
                    roughness={0.24}
                  />
                </mesh>
              ))}
            </>
          )}
          {projectIndex === 3 && (
            <>
              <Line
                points={[
                  [-0.82, 0.86, 0.2],
                  [-0.3, 1.42, 0],
                  [0.22, 0.94, -0.04],
                  [0.78, 1.3, 0.12],
                ]}
                color={project.color}
                lineWidth={2}
              />
              {[
                [-0.3, 1.42, 0],
                [0.22, 0.94, -0.04],
                [0.78, 1.3, 0.12],
                [-0.82, 0.86, 0.2],
              ].map((p, i) => (
                <mesh key={i} position={p as [number, number, number]}>
                  <sphereGeometry args={[0.12, 16, 12]} />
                  <meshStandardMaterial
                    color={project.color}
                    metalness={0.5}
                    roughness={0.22}
                  />
                </mesh>
              ))}
              <mesh position={[0, 1.06, 0.02]}>
                <octahedronGeometry args={[0.28, 0]} />
                <meshStandardMaterial
                  color="#e0d8ff"
                  metalness={0.55}
                  roughness={0.22}
                />
              </mesh>
            </>
          )}
        </group>
      ))}
    </>
  );
}
