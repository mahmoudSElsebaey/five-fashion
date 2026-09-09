import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function EditorialSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted lg:aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-8xl font-semibold text-foreground/5 select-none">
              FIVE
            </span>
          </div>
        </div>

        <div className="max-w-lg">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.editorial.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t('home.editorial.title')}
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {t('home.editorial.body')}
          </p>
          <Button
            className="mt-8"
            size="lg"
            variant="outline"
            onClick={() => navigate('/about')}
          >
            {t('home.editorial.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
