import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
export const cyan = "#91eafa",
  steel = "#31444f";
const machinedBox = new RoundedBoxGeometry(1, 1, 1, 2, 0.045);
export function GlowRing({
  radius,
  y = 0,
  color = cyan,
  thickness = 0.015,
  rotation = [-Math.PI / 2, 0, 0],
}: {
  radius: number;
  y?: number;
  color?: string;
  thickness?: number;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={[0, y, 0]} rotation={rotation}>
      <torusGeometry args={[radius, thickness, 8, 128]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
export function Body({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = steel,
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <primitive object={machinedBox} attach="geometry" dispose={null} />
      <meshStandardMaterial color={color} metalness={0.72} roughness={0.33} />
    </mesh>
  );
}
