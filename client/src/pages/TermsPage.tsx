import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 11 — Terms of service shell */
export function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={t('footer.terms')} noindex />
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t('footer.terms')}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {t('legal.terms.p1', {
            defaultValue:
              'By using FIVE Fashion you agree to accurate order information, available stock at confirmation, and the shipping timelines shown at checkout.',
          })}
        </p>
        <p>
          {t('legal.terms.p2', {
            defaultValue:
              'Prices, promotions, and coupon eligibility may change. Orders can be cancelled while status is pending according to store policy.',
          })}
        </p>
        <p>
          {t('legal.terms.p3', {
            defaultValue:
              'Product images and 3D previews are illustrative; minor variations in fabric and color can occur between batches.',
          })}
        </p>
      </div>
    </div>
  );
}
