import { useTranslation } from 'react-i18next';

/** Famous fashion houses — display names only (wordmark strip). */
export const FAMOUS_BRANDS = [
  'Gucci',
  'Prada',
  'Chanel',
  'Dior',
  'Burberry',
  'Versace',
  'Armani',
  'Ralph Lauren',
  'Calvin Klein',
  'Tommy Hilfiger',
] as const;

export function BrandsStrip() {
  const { t } = useTranslation();
  // Double the list for seamless infinite scroll
  const loop = [...FAMOUS_BRANDS, ...FAMOUS_BRANDS];

  return (
    <section
      className="relative overflow-hidden border-y border-border/50 bg-surface/40 py-10 sm:py-12"
      aria-label={t('home.brands.label', { defaultValue: 'Featured brands' })}
    >
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-e from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-s from-background to-transparent sm:w-24" />

      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {t('home.brands.label', { defaultValue: 'Featured brands' })}
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {t('home.brands.title', { defaultValue: 'Houses we celebrate' })}
        </h2>
      </div>

      <div className="five-brands-track flex w-max items-center gap-10 sm:gap-14">
        {loop.map((brand, i) => (
          <div
            key={`${brand}-${i}`}
            className="flex shrink-0 items-center justify-center px-2"
          >
            <span className="select-none whitespace-nowrap font-display text-xl font-semibold tracking-[0.08em] text-foreground/45 transition-colors hover:text-accent sm:text-2xl md:text-3xl">
              {brand}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fiveBrandsScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .five-brands-track {
          animation: fiveBrandsScroll 42s linear infinite;
        }
        .five-brands-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .five-brands-track {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            max-width: 72rem;
            margin-inline: auto;
            gap: 1.5rem 2rem;
            padding-inline: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
