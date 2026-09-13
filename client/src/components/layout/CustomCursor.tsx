import { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 28;

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
 * Natural mouse pointer + one continuous soft cloud trail (canvas).
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
      // ease trail head toward pointer for softer cloud
      const last = points[0];
      if (!last) {
        points.unshift({ x: mx, y: my });
      } else {
        points.unshift({
          x: last.x + (mx - last.x) * 0.55,
          y: last.y + (my - last.y) * 0.55,
        });
      }
      if (points.length > MAX_POINTS) points.length = MAX_POINTS;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (points.length > 2) {
        // Continuous ribbon: layered strokes, one path
        for (let layer = 0; layer < 3; layer++) {
          const width = 22 - layer * 6;
          const alpha = 0.16 - layer * 0.04;

          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = width;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 18 - layer * 4;

          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const c = points[i];
            const n = points[i + 1];
            const mxid = (c.x + n.x) / 2;
            const myid = (c.y + n.y) / 2;
            ctx.quadraticCurveTo(c.x, c.y, mxid, myid);
          }
          const tail = points[points.length - 1];
          ctx.lineTo(tail.x, tail.y);
          ctx.stroke();
        }

        // Soft head cloud (still one blob, not dots)
        const head = points[0];
        const grd = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 28);
        grd.addColorStop(0, accent);
        grd.addColorStop(0.35, accent);
        grd.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.2;
        ctx.shadowBlur = 0;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // Fade trail by dropping oldest gradually when idle
      if (points.length > 8) {
        const dx = Math.abs(mx - points[0].x);
        const dy = Math.abs(my - points[0].y);
        if (dx < 0.5 && dy < 0.5 && points.length > 10) {
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
