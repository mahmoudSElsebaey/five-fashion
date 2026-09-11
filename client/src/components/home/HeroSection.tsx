import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroScene } from '@/components/3d/HeroScene';
import { ImageStreamHero } from './ImageStreamHero';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Existing WebGL hero object stays as the depth anchor. */}
      <ErrorBoundary fallback={null}>
        <HeroScene />
      </ErrorBoundary>

      {/* Fashion image corridor inspired by the Image Stream interaction pattern. */}
      <ImageStreamHero />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/25 via-background/60 to-background" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl text-center sm:text-left rtl:sm:text-right">
          <div className="animate-[heroFadeUp_0.7s_ease-out_both]">
            <Badge variant="accent" className="mb-5 sm:mb-6">
              {t('home.hero.badge')}
            </Badge>
          </div>

          <h1 className="animate-[heroFadeUp_0.8s_ease-out_0.1s_both] font-display text-[clamp(2.35rem,8vw,5rem)] font-semibold leading-[1.02] tracking-tight">
            {t('home.hero.title')}
          </h1>

          <p className="mx-auto mt-5 max-w-lg animate-[heroFadeUp_0.8s_ease-out_0.2s_both] text-base leading-relaxed text-muted-foreground sm:mx-0 sm:mt-6 sm:text-lg">
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-8 flex animate-[heroFadeUp_0.8s_ease-out_0.3s_both] flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:justify-start rtl:sm:flex-row-reverse">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="w-full border-accent bg-accent text-white shadow-[0_10px_35px_-12px_hsl(var(--accent)/0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/90 hover:bg-accent/90 hover:text-white hover:shadow-[0_14px_40px_-12px_hsl(var(--accent)/0.9)] sm:w-auto"
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
          .animate-\[heroFadeUp_0\.7s_ease-out_both\],
          .animate-\[heroFadeUp_0\.8s_ease-out_0\.1s_both\],
          .animate-\[heroFadeUp_0\.8s_ease-out_0\.2s_both\],
          .animate-\[heroFadeUp_0\.8s_ease-out_0\.3s_both\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
