import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function OffersSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-16 text-center sm:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        <div className="relative">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.offers.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.offers.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            {t('home.offers.subtitle')}
          </p>
          <Button
            className="mt-8"
            size="lg"
            variant="accent"
            onClick={() => navigate('/shop?sale=1')}
          >
            {t('home.offers.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
