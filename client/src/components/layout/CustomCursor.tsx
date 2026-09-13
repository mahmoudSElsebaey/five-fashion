import { useEffect, useRef, useState } from 'react';

/**
 * Brand custom cursor — accent ring + core.
 * Enabled only on fine-pointer devices; respects reduced motion.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
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

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
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
      x = e.clientX;
      y = e.clientY;
      hoveringInteractive.current = isInteractive(e.target);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        const scale = hoveringInteractive.current ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = hoveringInteractive.current
          ? 'var(--accent)'
          : 'color-mix(in srgb, var(--accent) 70%, transparent)';
        ringRef.current.style.background = hoveringInteractive.current
          ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
          : 'transparent';
      }
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
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-accent/70 transition-[background,border-color] duration-200"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
