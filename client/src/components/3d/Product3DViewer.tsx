import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

function ProductForm({ animate }: { animate: boolean }) {
  const content = (
    <mesh castShadow>
      <torusKnotGeometry args={[0.55, 0.18, 128, 32]} />
      <meshStandardMaterial
        color="#C9A88A"
        metalness={0.9}
        roughness={0.18}
        envMapIntensity={1.2}
      />
    </mesh>
  );

  if (!animate) return content;

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.35}>
      {content}
    </Float>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#888" wireframe />
    </mesh>
  );
}

interface Product3DViewerProps {
  className?: string;
}

export function Product3DViewer({ className = '' }: Product3DViewerProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={1.1} castShadow />
        <Suspense fallback={<Loader />}>
          <ProductForm animate={!reducedMotion} />
          <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={6} blur={2.5} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 start-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t('product.view3dHint')}
      </p>
    </div>
  );
}
