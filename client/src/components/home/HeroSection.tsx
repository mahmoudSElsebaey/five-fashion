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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="accent" className="mb-6">
            {t('home.hero.badge')}
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t('home.hero.title')}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/shop')}>
              {t('home.hero.ctaPrimary')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/collections')}>
              {t('home.hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
