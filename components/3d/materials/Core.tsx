import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlowRing, cyan } from "../scenes/Geometry";
export function Core({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null),
    crystal = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(cyan) } }),
    [],
  );
  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    if (rings.current) {
      rings.current.rotation.y += delta * 0.13;
      rings.current.rotation.z = Math.sin(t * 0.25) * 0.12;
    }
    if (crystal.current) {
      crystal.current.rotation.y += delta * 0.16;
      crystal.current.position.y = 2.5 + Math.sin(t * 0.7) * 0.07;
    }
    uniforms.uTime.value = t;
  });
  return (
    <group>
      {[
        { r: 1.55, y: 0.16, h: 0.3 },
        { r: 1.25, y: 0.4, h: 0.16 },
        { r: 0.9, y: 0.61, h: 0.26 },
      ].map((d, i) => (
        <mesh key={i} position={[0, d.y, 0]} castShadow>
          <cylinderGeometry args={[d.r, d.r + 0.07, d.h, 64]} />
          <meshStandardMaterial
            color={i === 1 ? "#668393" : "#263844"}
            metalness={0.85}
            roughness={0.23}
          />
        </mesh>
      ))}
      <GlowRing radius={1.54} y={0.26} thickness={0.02} />
      <GlowRing radius={0.91} y={0.74} thickness={0.014} />
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.75, 0.6, 1.5, 48, 1, true]} />
        <meshBasicMaterial
          color="#55d5f3"
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group position={[0, 2.5, 0]} ref={rings}>
        {[0, 1, 2].map((n) => (
          <group key={n} rotation={[0.5 + n * 0.7, n * 0.9, 0.45 + n * 0.25]}>
            <mesh castShadow>
              <torusGeometry args={[1.24 + n * 0.18, 0.045, 12, 100]} />
              <meshStandardMaterial
                color="#6c909f"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            <mesh>
              <torusGeometry args={[1.25 + n * 0.18, 0.017, 8, 100]} />
              <meshBasicMaterial
                color={n === 1 ? "#d4f9ff" : cyan}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[0, 2.5, 0]} ref={crystal}>
        <icosahedronGeometry args={[0.8, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={`varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}`}
          fragmentShader={`uniform float uTime;uniform vec3 uColor;varying vec3 vNormal;varying vec3 vPosition;void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),2.0);float scan=pow(0.5+0.5*sin(vPosition.y*30.0-uTime*1.5),10.0);vec3 color=mix(vec3(0.015,0.09,0.14),uColor,rim*.85)+scan*uColor*.1;gl_FragColor=vec4(color,0.97);}`}
          transparent
        />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <icosahedronGeometry args={[0.805, 1]} />
        <meshBasicMaterial
          color="#94f1ff"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight
        position={[0, 2.2, 0]}
        intensity={12}
        color="#69d8ff"
        distance={9}
      />
    </group>
  );
}
