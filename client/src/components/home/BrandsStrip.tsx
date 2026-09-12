import { useTranslation } from 'react-i18next';

/** Brand tiles — fashion imagery + lettermark (no trademark logos). */
const BRAND_TILES = [
  {
    name: 'Gucci',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Prada',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Chanel',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Dior',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Burberry',
    img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Versace',
    img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Armani',
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ralph Lauren',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Calvin Klein',
    img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tommy Hilfiger',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
  },
] as const;

export function BrandsStrip() {
  const { t } = useTranslation();
  // Triple for seamless continuous loop
  const loop = [...BRAND_TILES, ...BRAND_TILES, ...BRAND_TILES];

  return (
    <section
      className="relative overflow-hidden border-y border-border/50 bg-surface/40 py-10 sm:py-14"
      aria-label={t('home.brands.label', { defaultValue: 'Featured brands' })}
    >
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {t('home.brands.label', { defaultValue: 'Featured brands' })}
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {t('home.brands.title', { defaultValue: 'Houses we celebrate' })}
        </h2>
      </div>

      <div className="five-brands-track flex w-max items-center gap-5 sm:gap-7" style={{ perspective: '900px' }}>
        {loop.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="five-brand-tile group relative h-24 w-36 shrink-0 sm:h-28 sm:w-44"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-transform duration-300 ease-out group-hover:[transform:rotateY(-12deg)_rotateX(6deg)_translateZ(12px)]"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow:
                  '0 14px 28px -10px rgba(0,0,0,0.45), 0 6px 12px -6px color-mix(in srgb, var(--accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
            >
              <img
                src={brand.img}
                alt={brand.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-2 text-center font-display text-xs font-semibold tracking-[0.18em] text-white sm:text-sm">
                {brand.name.charAt(0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fiveBrandsScroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.333%, 0, 0); }
        }
        .five-brands-track {
          animation: fiveBrandsScroll 48s linear infinite;
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
            gap: 1rem;
            padding-inline: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
