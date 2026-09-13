import { useEffect, useRef, useState } from 'react';

const CLOUD_COUNT = 5;
const LAGS = [1, 0.28, 0.16, 0.1, 0.065, 0.04];

/** Classic OS-style pointer path (16×16 viewBox, tip at 0,0). */
function PointerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5.5 3.2L18.2 12.1l-5.4 1.2 2.6 7.1-2.4.9-2.7-7.2-4.3 3.6V3.2Z"
        fill="var(--foreground)"
        stroke="var(--background)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 3.2L18.2 12.1l-5.4 1.2 2.6 7.1-2.4.9-2.7-7.2-4.3 3.6V3.2Z"
        fill="none"
        stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
        strokeWidth="0.75"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Classic mouse pointer + soft golden cloud trail.
 * Fine-pointer only; respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [enabled, setEnabled] = useState(false);
  const hoveringInteractive = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const on = fine.matches && !reduce.matches;
      setEnabled(on);
      document.body.classList.toggle('five-custom-cursor', on);
    };

    sync();
    fine.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
      document.body.classList.remove('five-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    const pts = Array.from({ length: CLOUD_COUNT + 1 }, () => ({
      x: targetX,
      y: targetY,
    }));
    let raf = 0;

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return Boolean(
        el.closest(
          'a, button, [role="button"], input, textarea, select, label[for], .cursor-pointer'
        )
      );
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      hoveringInteractive.current = isInteractive(e.target);
    };

    const tick = () => {
      pts[0].x = targetX;
      pts[0].y = targetY;

      for (let i = 1; i < pts.length; i++) {
        const lag = LAGS[i] ?? 0.08;
        pts[i].x += (pts[i - 1].x - pts[i].x) * lag;
        pts[i].y += (pts[i - 1].y - pts[i].y) * lag;
      }

      if (pointerRef.current) {
        // Tip of arrow aligns with hotspot (~1px,1px)
        pointerRef.current.style.transform = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0)`;
        pointerRef.current.style.opacity = hoveringInteractive.current ? '1' : '0.95';
      }

      cloudRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = pts[i + 1];
        if (!p) return;
        const grow = hoveringInteractive.current ? 1.25 : 1;
        const base = 14 + i * 6;
        el.style.width = `${base * grow}px`;
        el.style.height = `${base * grow}px`;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = String((0.28 - i * 0.04) * (hoveringInteractive.current ? 1.15 : 1));
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {Array.from({ length: CLOUD_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            cloudRefs.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
          style={{
            willChange: 'transform, opacity, width, height',
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent) 0%, color-mix(in srgb, var(--accent) 18%, transparent) 45%, transparent 72%)',
            filter: 'blur(6px)',
          }}
        />
      ))}
      <div
        ref={pointerRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          willChange: 'transform',
          filter:
            'drop-shadow(0 1px 1px rgba(0,0,0,0.35)) drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 45%, transparent))',
        }}
      >
        <PointerIcon />
      </div>
    </>
  );
}
