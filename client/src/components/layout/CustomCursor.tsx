import { useEffect, useRef, useState } from 'react';

/** Medium trail length */
const MAX_POINTS = 16;

/** Natural OS-style arrow (hotspot at tip). */
function NaturalPointer() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden>
      <path
        d="M1.2 1.2l16.2 11.4-7.1 1.5 3.4 8.4-2.6.9L7.6 14.4 2.2 18.6V1.2Z"
        fill="#1A1A1C"
        stroke="#F9F7F4"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Natural mouse pointer + simple medium-length smoke trail.
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const points: { x: number; y: number }[] = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let raf = 0;
    let accent = '#B08D6A';

    const readAccent = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (v) accent = v;
    };
    readAccent();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };

    const onTheme = () => readAccent();

    const tick = () => {
      const last = points[0];
      if (!last) {
        points.unshift({ x: mx, y: my });
      } else {
        // Slight lag so smoke feels soft, not glued to tip
        points.unshift({
          x: last.x + (mx - last.x) * 0.42,
          y: last.y + (my - last.y) * 0.42,
        });
      }
      if (points.length > MAX_POINTS) points.length = MAX_POINTS;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (points.length > 2) {
        // Simple smoke: one soft stroke that thins toward the tail
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = accent;
        ctx.shadowBlur = 12;

        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          const t = i / (points.length - 1);
          // Head thicker/more opaque, tail thinner/fainter — medium distance overall
          const width = 10 * (1 - t * 0.85);
          const alpha = 0.14 * (1 - t);

          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(1.5, width);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // Shorten trail when idle
      if (points.length > 6) {
        const dx = Math.abs(mx - points[0].x);
        const dy = Math.abs(my - points[0].y);
        if (dx < 0.4 && dy < 0.4) {
          points.pop();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      themeObs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998]"
      />
      <div
        ref={pointerRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          willChange: 'transform',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
        }}
      >
        <NaturalPointer />
      </div>
    </>
  );
}
