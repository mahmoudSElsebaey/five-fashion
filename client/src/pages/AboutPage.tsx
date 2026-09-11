import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';

/** SECTION 11 — Brand about page */
export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo
        title={t('nav.about', { defaultValue: 'About' })}
        description={t('about.seo', {
          defaultValue: 'FIVE Fashion — refined luxury ready-to-wear and digital craft.',
        })}
      />
      <p className="text-sm font-medium tracking-widest text-accent uppercase">
        {t('about.label', { defaultValue: 'The house' })}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('about.title', { defaultValue: 'FIVE Fashion' })}
      </h1>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        <p>
          {t('about.p1', {
            defaultValue:
              'FIVE is a contemporary fashion house focused on precise cuts, quiet luxury, and an immersive digital experience. Every piece is designed to feel intentional — on the body and on the screen.',
          })}
        </p>
        <p>
          {t('about.p2', {
            defaultValue:
              'We blend craftsmanship with technology: bilingual shopping, refined product storytelling, and 3D previews that let you explore silhouette before you order.',
          })}
        </p>
        <p>
          {t('about.p3', {
            defaultValue:
              'From Cairo to the world — limited drops, considered materials, and service that respects your time.',
          })}
        </p>
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button size="lg">{t('nav.shop', { defaultValue: 'Shop' })}</Button>
        </Link>
        <Link to="/collections">
          <Button size="lg" variant="outline">
            {t('nav.collections', { defaultValue: 'Collections' })}
          </Button>
        </Link>
      </div>
    </div>
  );
}
