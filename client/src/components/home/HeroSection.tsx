import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageStreamHero, type StreamImage } from '@/components/ui/image-stream-hero';

/** Fashion photography — Unsplash, no brand logos. */
const HERO_IMAGES: StreamImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&auto=format&fit=crop',
    alt: 'Fashion model in tailored look',
  },
  {
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80&auto=format&fit=crop',
    alt: 'Woman in flowing dress',
  },
  {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&auto=format&fit=crop',
    alt: 'Street style shopping',
  },
  {
    src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80&auto=format&fit=crop',
    alt: 'Editorial fashion portrait',
  },
  {
    src: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1600&q=85&auto=format&fit=crop',
    alt: 'Model in outerwear',
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=crop',
    alt: 'Runway-inspired fashion',
  },
  {
    src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=80&auto=format&fit=crop',
    alt: 'Menswear portrait',
  },
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80&auto=format&fit=crop',
    alt: 'Man in suit',
  },
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80&auto=format&fit=crop',
    alt: 'Tailored suit detail',
  },
  {
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80&auto=format&fit=crop',
    alt: 'Red dress fashion',
  },
  {
    src: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=80&auto=format&fit=crop',
    alt: 'Coat style',
  },
  {
    src: 'https://images.unsplash.com/photo-1558171813-4c0880e7c3d6?w=900&q=80&auto=format&fit=crop',
    alt: 'Fashion accessories mood',
  },
];

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ImageStreamHero
      images={HERO_IMAGES}
      cards={9}
      speed={22}
      axis={52}
      className="min-h-[85vh] w-full bg-background"
    >
      {/* Soft wash so copy stays readable over the corridor */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/55 to-background" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl text-center sm:text-left rtl:sm:text-right">
          <div className="animate-[heroFadeUp_0.7s_ease-out_both]">
            <Badge variant="accent" className="mb-5 sm:mb-6">
              {t('home.hero.badge')}
            </Badge>
          </div>

          <h1 className="animate-[heroFadeUp_0.8s_ease-out_0.1s_both] font-display text-[clamp(2.35rem,8vw,5rem)] font-semibold leading-[1.02] tracking-tight text-foreground">
            {t('home.hero.title')}
          </h1>

          <p className="mx-auto mt-5 max-w-lg animate-[heroFadeUp_0.8s_ease-out_0.2s_both] text-base leading-relaxed text-muted-foreground sm:mx-0 sm:mt-6 sm:text-lg">
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-8 flex animate-[heroFadeUp_0.8s_ease-out_0.3s_both] flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:justify-start rtl:sm:flex-row-reverse">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="w-full transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
            >
              {t('home.hero.ctaPrimary')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/collections')}
              className="w-full transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
            >
              {t('home.hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[heroFadeUp_0\\.7s_ease-out_both\\],
          .animate-\\[heroFadeUp_0\\.8s_ease-out_0\\.1s_both\\],
          .animate-\\[heroFadeUp_0\\.8s_ease-out_0\\.2s_both\\],
          .animate-\\[heroFadeUp_0\\.8s_ease-out_0\\.3s_both\\] {
            animation: none !important;
          }
        }
      `}</style>
    </ImageStreamHero>
  );
}
