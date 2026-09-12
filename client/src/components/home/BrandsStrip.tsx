import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

/** Famous fashion / apparel brands — logos via Clearbit */
const BRANDS = [
  { name: 'Nike', domain: 'nike.com' },
  { name: 'Adidas', domain: 'adidas.com' },
  { name: 'Gucci', domain: 'gucci.com' },
  { name: 'Prada', domain: 'prada.com' },
  { name: 'Chanel', domain: 'chanel.com' },
  { name: 'Dior', domain: 'dior.com' },
  { name: 'Burberry', domain: 'burberry.com' },
  { name: 'Versace', domain: 'versace.com' },
  { name: 'Calvin Klein', domain: 'calvinklein.com' },
  { name: 'Tommy Hilfiger', domain: 'tommy.com' },
  { name: 'Zara', domain: 'zara.com' },
  { name: 'H&M', domain: 'hm.com' },
] as const;

function brandLogo(domain: string) {
  return `https://logo.clearbit.com/${domain}`;
}

export function BrandsStrip() {
  const { t } = useTranslation();
  // Duplicate slides so Swiper loop never shows a gap
  const slides = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section
      className="relative overflow-hidden border-y border-border/50 bg-surface/40 py-10 sm:py-14"
      aria-label={t('home.brands.label', { defaultValue: 'Featured brands' })}
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {t('home.brands.label', { defaultValue: 'Featured brands' })}
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {t('home.brands.title', { defaultValue: 'Houses we celebrate' })}
        </h2>
      </div>

      <div className="relative px-2 sm:px-4" style={{ perspective: '1000px' }}>
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={16}
          loop
          loopAdditionalSlides={BRANDS.length}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={8000}
          allowTouchMove
          className="five-brands-swiper !overflow-visible"
        >
          {slides.map((brand, i) => (
            <SwiperSlide
              key={`${brand.domain}-${i}`}
              className="!w-auto"
            >
              <div
                className="group flex h-20 w-28 items-center justify-center rounded-2xl border border-border/50 bg-card px-3 transition-transform duration-300 sm:h-24 sm:w-36 sm:px-4"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow:
                    '0 14px 28px -12px rgba(0,0,0,0.4), 0 6px 12px -6px color-mix(in srgb, var(--accent) 28%, transparent), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'rotateY(-10deg) rotateX(6deg) translateZ(10px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                }}
              >
                <img
                  src={brandLogo(brand.domain)}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-8 max-w-[4.5rem] object-contain opacity-80 transition-opacity group-hover:opacity-100 sm:max-h-10 sm:max-w-[5.5rem] dark:brightness-0 dark:invert"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const fallback = el.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.hidden = false;
                  }}
                />
                <span hidden className="font-display text-xs font-semibold tracking-wide text-foreground/70">
                  {brand.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .five-brands-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
          align-items: center;
        }
        .five-brands-swiper .swiper-slide {
          width: auto;
        }
      `}</style>
    </section>
  );
}
