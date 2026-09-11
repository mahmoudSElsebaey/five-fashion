import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 11 — Privacy policy shell */
export function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={t('footer.privacy')} noindex />
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t('footer.privacy')}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {t('legal.privacy.p1', {
            defaultValue:
              'FIVE Fashion processes account data, orders, and device preferences only to operate the store, fulfill purchases, and improve the experience.',
          })}
        </p>
        <p>
          {t('legal.privacy.p2', {
            defaultValue:
              'We do not sell personal data. Payment details are handled by the payment provider when online payments are enabled; cash-on-delivery orders store shipping contact only.',
          })}
        </p>
        <p>
          {t('legal.privacy.p3', {
            defaultValue:
              'You may request access or deletion of your account data by contacting support through the profile or registered email.',
          })}
        </p>
      </div>
    </div>
  );
}
