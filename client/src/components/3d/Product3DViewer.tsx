import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, Component, useState, type ReactNode, type ErrorInfo } from 'react';
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

class ViewerBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { error: boolean }
> {
  state = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(_e: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

interface Product3DViewerProps {
  className?: string;
  modelUrl?: string | null;
}

/** SECTION 13 — Product 3D with load failure isolation (no page crash). */
export function Product3DViewer({ className = '', modelUrl }: Product3DViewerProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const hasModel = Boolean(modelUrl && modelUrl.trim());
  const [failed, setFailed] = useState(false);

  if (!hasModel || failed) {
    return (
      <div
        className={`relative flex min-h-[240px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center ${className}`}
      >
        <p className="text-sm font-medium text-foreground">
          {failed
            ? t('product.view3dError', { defaultValue: 'Could not load 3D model' })
            : t('product.view3dPlaceholder', { defaultValue: '3D model not available' })}
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
      <ViewerBoundary onError={() => setFailed(true)}>
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
      </ViewerBoundary>
      <p className="pointer-events-none absolute bottom-3 start-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t('product.view3dHint')}
      </p>
    </div>
  );
}
