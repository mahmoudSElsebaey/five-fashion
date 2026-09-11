import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';

/** SECTION 11 — 404 */
export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <Seo title="404" noindex />
      <p className="text-sm font-medium tracking-widest text-accent uppercase">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {t('errors.notFound', { defaultValue: 'Page not found' })}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {t('errors.notFoundDesc', {
          defaultValue: 'The page you requested does not exist or was moved.',
        })}
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/">
          <Button>{t('nav.home')}</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">{t('nav.shop')}</Button>
        </Link>
      </div>
    </div>
  );
}
