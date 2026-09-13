import { useEffect, useRef, useState } from 'react';

const TRAIL_COUNT = 4;
/** Lag factors: head follows tight, tail is softer */
const LAGS = [1, 0.35, 0.2, 0.12, 0.07];

/**
 * Brand custom cursor — accent core + fading trail.
 * Fine-pointer only; respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
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
    // positions: [0]=core, [1..n]=trail
    const pts = Array.from({ length: TRAIL_COUNT + 1 }, () => ({
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
        const lag = LAGS[i] ?? 0.1;
        pts[i].x += (pts[i - 1].x - pts[i].x) * lag;
        pts[i].y += (pts[i - 1].y - pts[i].y) * lag;
      }

      const scale = hoveringInteractive.current ? 1.35 : 1;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = pts[i + 1];
        if (!p) return;
        const tScale = (1 - i * 0.18) * (hoveringInteractive.current ? 1.15 : 1);
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${tScale})`;
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
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full bg-accent"
          style={{
            width: `${10 - i * 1.5}px`,
            height: `${10 - i * 1.5}px`,
            opacity: 0.45 - i * 0.09,
            willChange: 'transform',
            boxShadow: '0 0 10px color-mix(in srgb, var(--accent) 50%, transparent)',
          }}
        />
      ))}
      <div
        ref={coreRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-accent"
        style={{
          willChange: 'transform',
          boxShadow:
            '0 0 14px color-mix(in srgb, var(--accent) 75%, transparent), 0 0 4px color-mix(in srgb, var(--accent) 90%, transparent)',
        }}
      />
    </>
  );
}
