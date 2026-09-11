import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center" aria-label="FIVE Fashion home">
              <img src="/logo.png" alt="FIVE Fashion" className="h-21 w-auto max-w-[210px] object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] dark:drop-shadow-none sm:h-24 sm:max-w-[240px]" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/shop" className="transition-colors hover:text-foreground">{t('nav.shop')}</Link></li>
              <li><Link to="/collections" className="transition-colors hover:text-foreground">{t('nav.collections')}</Link></li>
              <li><Link to="/shop?new=true" className="transition-colors hover:text-foreground">{t('footer.newArrivals')}</Link></li>
              <li><Link to="/shop?sale=true" className="transition-colors hover:text-foreground">{t('footer.sale')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/contact" className="transition-colors hover:text-foreground">{t('footer.contact')}</Link></li>
              <li><Link to="/shipping" className="transition-colors hover:text-foreground">{t('footer.shipping')}</Link></li>
              <li><Link to="/returns" className="transition-colors hover:text-foreground">{t('footer.returns')}</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-foreground">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.newsletter')}
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              {t('footer.newsletterDesc')}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} FIVE Fashion. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="transition-colors hover:text-foreground">{t('footer.privacy')}</Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
