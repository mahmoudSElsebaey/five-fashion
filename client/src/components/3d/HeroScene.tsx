import { Canvas } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function MetallicForm({ animate }: { animate: boolean }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.6);
    shape.bezierCurveTo(0.5, 0.9, 0.9, 0.5, 0.7, 0);
    shape.bezierCurveTo(0.5, -0.4, 0.1, -0.5, -0.2, -0.3);
    shape.bezierCurveTo(-0.5, -0.1, -0.4, 0.4, 0, 0.6);

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 4,
    });
  }, []);

  const mesh = (
    <mesh geometry={geometry} rotation={[0.25, 0.5, 0]} scale={1.9}>
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.45}
        chromaticAberration={0.04}
        anisotropy={0.25}
        distortion={0.08}
        distortionScale={0.15}
        temporalDistortion={0.05}
        color="#C9A88A"
        metalness={0.92}
        roughness={0.12}
      />
    </mesh>
  );

  if (!animate) {
    return mesh;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
      {mesh}
    </Float>
  );
}

function Fallback() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.15, 1]} />
      <meshStandardMaterial color="#C9A88A" metalness={0.85} roughness={0.2} />
    </mesh>
  );
}

export function HeroScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 opacity-75" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 4]} intensity={1.15} />
        <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#C9A88A" />
        <Suspense fallback={<Fallback />}>
          <MetallicForm animate={!reducedMotion} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
