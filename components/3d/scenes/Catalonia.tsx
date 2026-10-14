"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  comarques,
  comarcaById,
  findComarcaRoute,
  initialComarcaRoute,
  type Comarca,
} from "@/lib/geography";

type CataloniaProps = {
  reduced?: boolean;
  active?: boolean;
  onHover?: (name: string | null) => void;
  onSelect?: (name: string, routeNames: string[]) => void;
};

function createRegionGeometry(region: Comarca, depth: number) {
  const shapes = region.polygons.map((rings) => {
    const shape = new THREE.Shape(
      rings[0].map(([x, z]) => new THREE.Vector2(x, -z)),
    );
    shape.holes = rings
      .slice(1)
      .map(
        (ring) =>
          new THREE.Path(ring.map(([x, z]) => new THREE.Vector2(x, -z))),
      );
    return shape;
  });
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

/** Accurate game-map geometry on an original, mechanically layered installation. */
export function Catalonia({
  reduced = false,
  active = false,
  onHover,
  onSelect,
}: CataloniaProps) {
  const { gl, invalidate } = useThree();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [route, setRoute] = useState(initialComarcaRoute);
  const regions = useRef(new Map<string, THREE.Group>());
  const courier = useRef<THREE.Mesh>(null);
  const nextPoint = useRef(new THREE.Vector3());
  const [resources] = useState(() => {
    const geometries = comarques.map((region) =>
      createRegionGeometry(region, 0.23),
    );
    const basePieces = comarques.map((region) =>
      createRegionGeometry(region, 0.1),
    );
    const base = mergeGeometries(basePieces, false)!;
    basePieces.forEach((geometry) => geometry.dispose());
    const linePoints: number[] = [];
    comarques.forEach((region) =>
      region.polygons.forEach((polygon) =>
        polygon.forEach((ring) => {
          ring.forEach(([x, z], index) => {
            if (index === 0) return;
            linePoints.push(
              ring[index - 1][0],
              0.235,
              ring[index - 1][1],
              x,
              0.235,
              z,
            );
          });
        }),
      ),
    );
    const boundaries = new THREE.BufferGeometry();
    boundaries.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePoints, 3),
    );
    return { geometries, base, boundaries };
  });
  const routePoints = useMemo<[number, number, number][]>(
    () =>
      route.map((id) => {
        const [x, z] = comarcaById.get(id)!.center;
        return [x, 0.44, z];
      }),
    [route],
  );

  useEffect(() => {
    const previous = gl.domElement.style.cursor;
    if (hovered) gl.domElement.style.cursor = "pointer";
    return () => {
      gl.domElement.style.cursor = previous;
    };
  }, [hovered, gl]);

  useEffect(
    () => () => {
      resources.geometries.forEach((geometry) => geometry.dispose());
      resources.base.dispose();
      resources.boundaries.dispose();
    },
    [resources],
  );

  useFrame(({ clock }, delta) => {
    let moving = false;
    comarques.forEach((region) => {
      const mesh = regions.current.get(region.id);
      if (!mesh) return;
      const target = region.id === hovered || region.id === selected ? 0.09 : 0;
      mesh.position.y = reduced
        ? target
        : THREE.MathUtils.damp(mesh.position.y, target, 12, delta);
      if (Math.abs(mesh.position.y - target) > 0.001) moving = true;
    });
    if (courier.current && routePoints.length > 1) {
      const step = reduced
        ? 0
        : (clock.elapsedTime * 0.45) % (routePoints.length - 1);
      const segment = Math.floor(step);
      courier.current.position.fromArray(routePoints[segment]);
      courier.current.position.lerp(
        nextPoint.current.fromArray(routePoints[segment + 1]),
        step - segment,
      );
    }
    if (moving) invalidate();
  });

  function enter(event: ThreeEvent<PointerEvent>, region: Comarca) {
    event.stopPropagation();
    setHovered(region.id);
    onHover?.(region.name);
  }

  function select(event: ThreeEvent<MouseEvent>, region: Comarca) {
    event.stopPropagation();
    setSelected(region.id);
    const nextRoute = findComarcaRoute("montsia", region.id);
    setRoute(nextRoute);
    onSelect?.(
      region.name,
      nextRoute.map((id) => comarcaById.get(id)!.name),
    );
    invalidate();
  }

  return (
    <group name="cami-curt-geographic-installation">
      {/* A thin cyan gasket sits between the two machined geography plates. */}
      <mesh position={[0, -0.19, 0]} receiveShadow>
        <primitive object={resources.base} attach="geometry" dispose={null} />
        <meshStandardMaterial
          color="#23383e"
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, -0.075, 0]} scale={[1, 0.28, 1]}>
        <primitive object={resources.base} attach="geometry" dispose={null} />
        <meshStandardMaterial
          color="#65bfb5"
          emissive="#4d9f96"
          emissiveIntensity={0.45}
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>
      {comarques.map((region, index) => {
        const isRoute = route.includes(region.id);
        const isHover = hovered === region.id;
        return (
          <group
            key={region.id}
            ref={(group) => {
              if (group) regions.current.set(region.id, group);
              else regions.current.delete(region.id);
            }}
          >
            <mesh
              castShadow
              receiveShadow
              onPointerOver={(event) => enter(event, region)}
              onPointerOut={(event) => {
                event.stopPropagation();
                setHovered(null);
                onHover?.(null);
              }}
              onClick={(event) => select(event, region)}
              userData={{ comarca: region.id, name: region.name }}
            >
              <primitive
                object={resources.geometries[index]}
                attach="geometry"
                dispose={null}
              />
              <meshStandardMaterial
                attach="material-0"
                color={
                  isHover
                    ? "#b7d7c5"
                    : isRoute
                      ? "#659879"
                      : index % 3 === 0
                        ? "#7d9b8c"
                        : "#92aa9b"
                }
                emissive={isRoute ? "#508d78" : "#263632"}
                emissiveIntensity={isRoute ? (active ? 0.2 : 0.12) : 0.025}
                metalness={0.32}
                roughness={0.48}
              />
              <meshStandardMaterial
                attach="material-1"
                color="#33494b"
                metalness={0.82}
                roughness={0.26}
              />
            </mesh>
          </group>
        );
      })}
      <lineSegments>
        <primitive
          object={resources.boundaries}
          attach="geometry"
          dispose={null}
        />
        <lineBasicMaterial color="#3a605b" transparent opacity={0.72} />
      </lineSegments>
      {routePoints.length > 1 && (
        <>
          <Line
            points={routePoints}
            color="#bd8944"
            lineWidth={2.8}
            transparent
            opacity={0.95}
          />
          {routePoints.map((point, index) => (
            <mesh
              key={route[index]}
              position={point}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.045, 0.068, 20]} />
              <meshBasicMaterial color="#573e22" toneMapped={false} />
            </mesh>
          ))}
          <mesh ref={courier} position={routePoints[0]}>
            <sphereGeometry args={[0.045, 12, 8]} />
            <meshBasicMaterial color="#f8d397" toneMapped={false} />
          </mesh>
        </>
      )}
    </group>
  );
}
