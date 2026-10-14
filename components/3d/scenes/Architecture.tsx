import { useMemo } from "react";
import * as THREE from "three";
import { Line, Instances, Instance } from "@react-three/drei";
import { Body, GlowRing, cyan } from "./Geometry";
import { useLaboratory, type Station } from "@/stores/laboratory";
export function Floor() {
  return (
    <group>
      <mesh
        position={[0, -0.72, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, -0.28, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.7, 5.9, 0.48, 64]} />
        <meshStandardMaterial
          color="#15232c"
          metalness={0.8}
          roughness={0.29}
        />
      </mesh>
      <GlowRing radius={5.72} y={-0.12} thickness={0.025} />
      <GlowRing radius={5.7} y={-0.47} thickness={0.018} color="#245469" />
      <mesh position={[0, -0.018, 0]} receiveShadow>
        <cylinderGeometry args={[5.35, 5.35, 0.025, 64]} />
        <meshStandardMaterial color="#1b2b35" metalness={0.7} roughness={0.4} />
      </mesh>
      <GlowRing radius={4.9} y={0.012} color="#375566" thickness={0.01} />
      <GlowRing radius={2.1} y={0.015} color="#406e7f" thickness={0.012} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <Body
              position={[0, 0.004, 4.75]}
              scale={[0.014, 0.01, 0.7]}
              color="#496170"
            />
            <Body
              position={[0, -0.3, 5.78]}
              scale={[0.08, 0.2, 0.06]}
              color="#93b6c4"
            />
          </group>
        );
      })}
      <Instances limit={60}>
        <boxGeometry args={[0.06, 0.02, 0.23]} />
        <meshBasicMaterial color="#56889b" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * Math.PI) / 30;
          return (
            <Instance
              key={i}
              position={[Math.cos(a) * 2.35, 0.03, Math.sin(a) * 2.35]}
              rotation={[0, -a, 0]}
            />
          );
        })}
      </Instances>
    </group>
  );
}
export function Arch() {
  return (
    <group rotation={[0, -0.2, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, -0.55 + i * 0.55, 0]}>
          <Body position={[0, 2, -4.5]} scale={[0.16, 4, 0.22]} />
          <Body
            position={[0, 4.03, -3.3]}
            scale={[0.16, 0.18, 2.6]}
            rotation={[-0.06, 0, 0]}
          />
          <Body
            position={[0, 1.9, -4.35]}
            scale={[0.045, 3.3, 0.025]}
            color="#6dadc1"
          />
          <mesh position={[0, 2.1, -4.33]}>
            <boxGeometry args={[0.025, 3.4, 0.02]} />
            <meshBasicMaterial color="#a8f1ff" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <group position={[0, 4.2, -2.2]} rotation={[0.15, 0, 0]}>
        <GlowRing radius={2.3} thickness={0.035} color="#6b8b98" />
        <GlowRing radius={2.18} thickness={0.024} />
      </group>
      <group position={[-3.4, 1.2, -2.6]} rotation={[0, 0.65, 0]}>
        <Body scale={[1.2, 2.4, 0.5]} />
        {Array.from({ length: 10 }, (_, i) => (
          <group key={i}>
            <Body
              position={[0, -0.98 + i * 0.22, 0.28]}
              scale={[1.08, 0.115, 0.04]}
              color="#1b2b35"
            />
            <mesh position={[0.43, -0.98 + i * 0.22, 0.31]}>
              <boxGeometry args={[0.08, 0.02, 0.01]} />
              <meshBasicMaterial color={i % 3 === 0 ? "#c8eef3" : "#45879c"} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
function Panel({ kind }: { kind: number }) {
  const points = useMemo(
    () =>
      Array.from(
        { length: 36 },
        (_, i) =>
          new THREE.Vector3(
            -0.72 + i * 0.041,
            0.03 + Math.sin(i * 0.6) * 0.16 + Math.sin(i * 1.9) * 0.09,
            0.085,
          ),
      ),
    [],
  );
  return (
    <group position={[0, 1.08, 0]} rotation={[-0.14, 0, 0]}>
      <Body scale={[1.9, 1.03, 0.1]} color="#375260" />
      <mesh position={[0, 0, 0.057]}>
        <planeGeometry args={[1.77, 0.88]} />
        <meshStandardMaterial
          color="#031b28"
          emissive="#073443"
          emissiveIntensity={0.65}
          metalness={0.25}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[-0.62, 0.3, 0.07]}>
        <planeGeometry args={[0.28, 0.025]} />
        <meshBasicMaterial color={cyan} />
      </mesh>
      {kind === 0 ? (
        <>
          <Line points={points} color={cyan} lineWidth={1.7} />
          {[0, 1, 2, 3].map((i) => (
            <Line
              key={i}
              points={[
                [-0.75, -0.3 + i * 0.14, 0.073],
                [0.75, -0.3 + i * 0.14, 0.073],
              ]}
              color="#164957"
              lineWidth={0.5}
            />
          ))}
        </>
      ) : kind === 1 ? (
        <>
          <Instances limit={21}>
            <planeGeometry args={[0.17, 0.12]} />
            <meshBasicMaterial color="white" toneMapped={false} />
            {Array.from({ length: 21 }, (_, i) => (
              <Instance
                key={i}
                position={[
                  -0.7 + (i % 7) * 0.23,
                  -0.23 + Math.floor(i / 7) * 0.19,
                  0.08,
                ]}
                color={i % 4 === 0 ? cyan : i % 3 === 0 ? "#21627a" : "#153648"}
              />
            ))}
          </Instances>
        </>
      ) : (
        <>
          <Line
            points={[
              [-0.5, 0.15, 0.08],
              [-0.15, 0.28, 0.08],
              [0.45, 0.09, 0.08],
              [0.32, -0.23, 0.08],
              [-0.1, -0.32, 0.08],
              [-0.5, 0.15, 0.08],
            ]}
            color="#599aaa"
            lineWidth={1}
          />
          <Line
            points={[
              [-0.5, 0.15, 0.09],
              [-0.1, -0.07, 0.09],
              [0.32, -0.23, 0.09],
            ]}
            color={cyan}
            lineWidth={2}
          />
          {[
            [-0.5, 0.15],
            [-0.1, -0.07],
            [0.32, -0.23],
          ].map((p, i) => (
            <mesh key={i} position={[p[0], p[1], 0.1]}>
              <circleGeometry args={[0.038, 16]} />
              <meshBasicMaterial color={cyan} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
export function StationDesk({
  id,
  position,
  rotation,
  kind,
}: {
  id: Station;
  name: string;
  position: [number, number, number];
  rotation: number;
  kind: number;
}) {
  const active = useLaboratory((s) => s.station === id),
    select = useLaboratory((s) => s.select);
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
    >
      <Body position={[0, 0.11, 0]} scale={[2.4, 0.22, 1.6]} color="#253a46" />
      <Body position={[0, 0.42, -0.1]} scale={[0.22, 0.55, 0.3]} />
      <Body
        position={[0, 0.7, 0.25]}
        scale={[2.1, 0.09, 1]}
        rotation={[0.1, 0, 0]}
        color="#405865"
      />
      <Panel kind={kind} />
      <mesh position={[0, 0.27, 0.81]}>
        <boxGeometry args={[2.12, 0.015, 0.02]} />
        <meshBasicMaterial
          color={active ? "#e7fcff" : "#4295ae"}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
export function Cables() {
  return (
    <>
      {[
        [-3.5, 0.7],
        [3, -2.5],
        [2.5, 3.4],
      ].map(([x, z], i) => (
        <Line
          key={i}
          points={[
            [x, 0.04, z],
            [x * 0.55, 0.04, z * 0.8],
            [x * 0.3, 0.04, z * 0.5],
            [0, 0.04, 0],
          ]}
          color="#4f9fb6"
          lineWidth={1}
        />
      ))}
    </>
  );
}
export function Particles() {
  const geometry = useMemo(() => {
    const points = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      points[i * 3] = Math.sin(i * 19.1) * 6;
      points[i * 3 + 1] = 0.2 + (Math.sin(i * 14.7) * 0.5 + 0.5) * 6;
      points[i * 3 + 2] = Math.cos(i * 11.3) * 5;
    }
    return points;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.023}
        color="#94c9d6"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
