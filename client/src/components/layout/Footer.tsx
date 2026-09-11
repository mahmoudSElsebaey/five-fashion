import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** SECTION 14 — Footer with real support links + honest newsletter UX */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    // No fake backend — acknowledge intent locally until a real list service exists
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="FIVE Fashion"
                className="h-14 w-auto max-w-full object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none sm:h-18 lg:h-20"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline', {
                defaultValue: 'Luxury fashion with an immersive digital experience.',
              })}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.shop', { defaultValue: 'Shop' })}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shop" className="transition-colors hover:text-foreground">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/collections" className="transition-colors hover:text-foreground">
                  {t('nav.collections')}
                </Link>
              </li>
              <li>
                <Link to="/shop?new=1" className="transition-colors hover:text-foreground">
                  {t('home.arrivals.title', { defaultValue: 'New arrivals' })}
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=1" className="transition-colors hover:text-foreground">
                  {t('home.offers.title', { defaultValue: 'Sale' })}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.support', { defaultValue: 'Support' })}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  {t('footer.contact', { defaultValue: 'Contact' })}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="transition-colors hover:text-foreground">
                  {t('footer.shipping', { defaultValue: 'Shipping' })}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="transition-colors hover:text-foreground">
                  {t('footer.returns', { defaultValue: 'Returns' })}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors hover:text-foreground">
                  {t('footer.faq', { defaultValue: 'FAQ' })}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">
              {t('footer.newsletter')}
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">{t('footer.newsletterDesc')}</p>
            {subscribed ? (
              <p className="text-sm text-success" role="status">
                {t('footer.newsletterThanks', {
                  defaultValue: 'Thanks — we will keep you posted when the list goes live.',
                })}
              </p>
            ) : (
              <form className="flex gap-2" onSubmit={onSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t('footer.emailPlaceholder')}
                />
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} FIVE Fashion. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
