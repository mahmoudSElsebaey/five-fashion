import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type PromoBannerProps = {
  variant?: 'featured' | 'arrivals';
};

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: diff <= 0,
  };
}

const FEATURED_IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85',
];

const ARRIVALS_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85',
];

export function PromoBanner({ variant = 'featured' }: PromoBannerProps) {
  const { t } = useTranslation();
  // Real countdown: 5 days from first mount, stable per session via sessionStorage
  const targetMs = useMemo(() => {
    const key = `five-promo-end-${variant}`;
    try {
      const existing = sessionStorage.getItem(key);
      if (existing) return Number(existing);
      const end = Date.now() + 5 * 24 * 60 * 60 * 1000;
      sessionStorage.setItem(key, String(end));
      return end;
    } catch {
      return Date.now() + 5 * 24 * 60 * 60 * 1000;
    }
  }, [variant]);

  const cd = useCountdown(targetMs);
  const isFeatured = variant === 'featured';

  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [
    { label: t('home.promo.days', { defaultValue: 'Days' }), value: pad(cd.days) },
    { label: t('home.promo.hours', { defaultValue: 'Hours' }), value: pad(cd.hours) },
    { label: t('home.promo.mins', { defaultValue: 'Mins' }), value: pad(cd.minutes) },
    { label: t('home.promo.secs', { defaultValue: 'Secs' }), value: pad(cd.seconds) },
  ];

  return (
    <section
      className={`relative overflow-hidden ${isFeatured ? 'py-10 sm:py-14' : 'py-12 sm:py-16'}`}
      aria-label={t('home.promo.label', { defaultValue: 'Promotion' })}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div
          className="promo-3d relative overflow-hidden rounded-3xl border border-border/50"
          style={{
            perspective: '1200px',
            boxShadow:
              '0 24px 60px -20px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent)',
          }}
        >
          {/* Background layers */}
          <div className="absolute inset-0">
            {isFeatured ? (
              <img
                src={FEATURED_IMAGES[0]}
                alt=""
                className="h-full w-full object-cover scale-105 promo-kenburns"
              />
            ) : (
              <div className="grid h-full w-full grid-cols-3 gap-1 sm:grid-cols-5">
                {ARRIVALS_IMAGES.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-full min-h-[220px] w-full object-cover sm:min-h-[280px]"
                  />
                ))}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
          </div>

          <div className="relative z-10 grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="promo-rise max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {isFeatured
                  ? t('home.promo.featuredLabel', { defaultValue: 'Limited drop' })
                  : t('home.promo.arrivalsLabel', { defaultValue: 'New season' })}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {isFeatured
                  ? t('home.promo.featuredTitle', { defaultValue: 'Evening edit — 30% off' })
                  : t('home.promo.arrivalsTitle', { defaultValue: 'Fresh silhouettes just landed' })}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {isFeatured
                  ? t('home.promo.featuredBody', {
                      defaultValue: 'Curated evening pieces with a timed offer. The clock is real — shop before it ends.',
                    })
                  : t('home.promo.arrivalsBody', {
                      defaultValue: 'A gallery of new textures and cuts. Explore the latest arrivals across the house.',
                    })}
              </p>
              <Link
                to={isFeatured ? '/shop?sale=1' : '/shop?new=1'}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-transform hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
              >
                {isFeatured
                  ? t('home.promo.featuredCta', { defaultValue: 'Shop the offer' })
                  : t('home.promo.arrivalsCta', { defaultValue: 'Browse new arrivals' })}
              </Link>
            </div>

            <div className="promo-rise promo-rise-delay flex flex-wrap justify-start gap-2 sm:gap-3 lg:justify-end">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="flex min-w-[4.25rem] flex-col items-center rounded-2xl border border-border/60 bg-background/80 px-3 py-3 shadow-xl backdrop-blur-md sm:min-w-[5rem] sm:px-4"
                  style={{
                    transform: 'translateZ(20px)',
                    boxShadow:
                      '0 12px 28px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="font-display text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
                    {cd.done ? '00' : u.value}
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes promoKenBurns {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.12) translate(-1.5%, 1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        @keyframes promoRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .promo-kenburns {
          animation: promoKenBurns 18s ease-in-out infinite;
        }
        .promo-rise {
          animation: promoRise 0.7s ease-out both;
        }
        .promo-rise-delay {
          animation-delay: 0.15s;
        }
        @media (prefers-reduced-motion: reduce) {
          .promo-kenburns,
          .promo-rise,
          .promo-rise-delay {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
