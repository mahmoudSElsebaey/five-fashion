import { Canvas } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

function MetallicForm() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.6);
    shape.bezierCurveTo(0.5, 0.9, 0.9, 0.5, 0.7, 0);
    shape.bezierCurveTo(0.5, -0.4, 0.1, -0.5, -0.2, -0.3);
    shape.bezierCurveTo(-0.5, -0.1, -0.4, 0.4, 0, 0.6);

    const extrudeSettings = {
      steps: 1,
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh geometry={geometry} rotation={[0.2, 0.4, 0]} scale={1.8}>
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#C9A88A"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </Float>
  );
}

function Fallback() {
  return (
    <mesh>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial color="#C9A88A" metalness={0.85} roughness={0.2} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#C9A88A" />
        <Suspense fallback={<Fallback />}>
          <MetallicForm />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
