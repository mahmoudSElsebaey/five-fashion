import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#888" wireframe />
    </mesh>
  );
}

interface Product3DViewerProps {
  className?: string;
  /** Optional product-specific GLB/GLTF URL from product data */
  modelUrl?: string | null;
}

/**
 * Renders a product 3D model only when a real model URL is provided.
 * Does NOT show a generic torus/knot as if it were the product.
 */
export function Product3DViewer({ className = '', modelUrl }: Product3DViewerProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const hasModel = Boolean(modelUrl && modelUrl.trim());

  if (!hasModel) {
    return (
      <div
        className={`relative flex min-h-[240px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center ${className}`}
      >
        <p className="text-sm font-medium text-foreground">
          {t('product.view3dPlaceholder', { defaultValue: '3D model not available' })}
        </p>
        <p className="max-w-xs text-xs text-muted-foreground">
          {t('product.view3dDesc', {
            defaultValue: 'A product-specific 3D model will appear here when available.',
          })}
        </p>
      </div>
    );
  }

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
          <Model url={modelUrl!} />
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
