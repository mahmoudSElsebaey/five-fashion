import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Floating 3D “up to top” control.
 * Uses logical positioning (`inset-inline-end`) so it sits on the
 * trailing side of the reading direction (right in LTR, left in RTL).
 */
export function BackToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div
      className={`fixed bottom-6 z-[60] transition-all duration-300 ease-out [inset-inline-end:1.25rem] sm:bottom-8 sm:[inset-inline-end:1.75rem] ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{ perspective: '600px' }}
    >
      <button
        type="button"
        onClick={scrollTop}
        aria-label={t('a11y.backToTop', { defaultValue: 'Back to top' })}
        className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/40 bg-gradient-to-br from-accent to-[color-mix(in_srgb,var(--accent)_72%,#1a1a1c)] text-accent-foreground shadow-[0_10px_28px_-8px_color-mix(in_srgb,var(--accent)_55%,transparent),inset_0_1px_0_rgba(255,255,255,0.25)] transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_36px_-8px_color-mix(in_srgb,var(--accent)_65%,transparent)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-13 sm:w-13"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D face highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-80"
          style={{
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.28) 0%, transparent 42%, transparent 58%, rgba(0,0,0,0.12) 100%)',
            transform: 'translateZ(1px)',
          }}
        />
        {/* Soft underside depth */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1 inset-x-2 h-2 rounded-full bg-accent/35 blur-md transition-opacity group-hover:opacity-80"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="relative z-[1] drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{ transform: 'translateZ(12px)' }}
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </button>
    </div>
  );
}
