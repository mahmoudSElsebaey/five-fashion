import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

type Brand = {
  name: string;
  domain: string;
  /** simpleicons slug when available */
  slug?: string;
};

/** Famous apparel brands — logo with the brand name underneath. */
const BRANDS: Brand[] = [
  { name: 'Nike', domain: 'nike.com', slug: 'nike' },
  { name: 'Adidas', domain: 'adidas.com', slug: 'adidas' },
  { name: 'Puma', domain: 'puma.com', slug: 'puma' },
  { name: 'New Balance', domain: 'newbalance.com', slug: 'newbalance' },
  { name: 'Converse', domain: 'converse.com', slug: 'converse' },
  { name: 'Vans', domain: 'vans.com', slug: 'vans' },
  { name: 'Gucci', domain: 'gucci.com' },
  { name: 'Prada', domain: 'prada.com' },
  { name: 'Chanel', domain: 'chanel.com' },
  { name: 'Dior', domain: 'dior.com' },
  { name: 'Zara', domain: 'zara.com', slug: 'zara' },
  { name: 'H&M', domain: 'hm.com', slug: 'hm' },
];

function logoCandidates(brand: Brand): string[] {
  const list: string[] = [];
  if (brand.slug) {
    list.push(`https://cdn.simpleicons.org/${brand.slug}`);
  }
  list.push(`https://logo.clearbit.com/${brand.domain}`);
  list.push(`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`);
  return list;
}

function BrandLogo({ brand }: { brand: Brand }) {
  const sources = logoCandidates(brand);

  return (
    <img
      src={sources[0]}
      alt={brand.name}
      title={brand.name}
      loading="lazy"
      decoding="async"
      className="h-10 max-h-10 w-auto max-w-[5.5rem] object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:h-12 sm:max-h-12 sm:max-w-[6.5rem] dark:brightness-0 dark:invert"
      onError={(e) => {
        const img = e.currentTarget;
        const idx = Number(img.dataset.idx || '0');
        const next = sources[idx + 1];
        if (next) {
          img.dataset.idx = String(idx + 1);
          img.src = next;
          return;
        }
        img.style.display = 'none';
      }}
    />
  );
}

export function BrandsStrip() {
  const { t } = useTranslation();
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

      <div className="relative px-2 sm:px-4">
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
            <SwiperSlide key={`${brand.domain}-${i}`} className="!w-auto">
              <div className="group flex h-24 w-32 flex-col items-center justify-center gap-2 px-4 transition-transform duration-300 hover:scale-105 sm:h-28 sm:w-40 sm:px-5">
                <BrandLogo brand={brand} />
                <span className="text-center text-xs font-medium tracking-wide text-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:text-sm">
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
