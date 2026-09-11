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

class ViewerBoundary extends Component<{ children: ReactNode; onError: () => void }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(_e: Error, _info: ErrorInfo) { this.props.onError(); }
  render() { return this.state.error ? null : this.props.children; }
}

interface Product3DViewerProps {
  className?: string;
  modelUrl?: string | null;
}

export function Product3DViewer({ className = '', modelUrl }: Product3DViewerProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const hasModel = Boolean(modelUrl && modelUrl.trim());
  const [failed, setFailed] = useState(false);

  if (!hasModel || failed) {
    return (
      <div className={`relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-accent/50 bg-accent/5 p-6 text-center ${className}`}>
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 via-background to-accent/5 shadow-lg">
          <div className="absolute inset-3 rounded-xl border border-accent/30" />
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-accent" aria-hidden="true">
            <path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" />
            <path d="m4.5 7.2 7.5 4.2 7.5-4.2M12 11.4V21" />
          </svg>
          <span className="absolute -right-2 -top-2 rounded-full border border-accent/30 bg-background px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-accent">3D</span>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {failed ? t('product.view3dError', { defaultValue: 'Could not load 3D model' }) : t('product.view3dPlaceholder', { defaultValue: '3D product preview' })}
        </p>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {t('product.view3dDesc', { defaultValue: 'Interactive 3D product viewing will appear here when a model is available.' })}
        </p>
        {!failed && <span className="mt-4 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-accent">Interactive feature</span>}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted ${className}`}>
      <ViewerBoundary onError={() => setFailed(true)}>
        <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 5, 3]} intensity={1.1} castShadow />
          <Suspense fallback={<Loader />}>
            <Model url={modelUrl!} />
            <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={6} blur={2.5} />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate={!reducedMotion} autoRotateSpeed={1.2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.6} />
        </Canvas>
      </ViewerBoundary>
      <p className="pointer-events-none absolute bottom-3 start-3 text-[10px] uppercase tracking-wider text-muted-foreground">{t('product.view3dHint')}</p>
    </div>
  );
}