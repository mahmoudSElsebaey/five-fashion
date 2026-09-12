import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function EditorialSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Visual side — large 3D logo */}
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-visible rounded-2xl bg-gradient-to-br from-muted/80 via-background to-muted/60 lg:aspect-square">
          <div
            className="pointer-events-none absolute inset-8 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)',
            }}
          />
          <img
            src="/logo.png"
            alt="FIVE Fashion"
            className="relative z-10 h-40 w-auto object-contain sm:h-52 lg:h-64"
            style={{
              filter:
                'drop-shadow(0 28px 40px rgba(0,0,0,0.45)) drop-shadow(0 12px 20px color-mix(in srgb, var(--accent) 40%, transparent)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              transform: 'translateZ(40px)',
            }}
          />
        </div>

        {/* Content side */}
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
