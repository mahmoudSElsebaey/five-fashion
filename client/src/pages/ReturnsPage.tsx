import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 14 — Returns */
export function ReturnsPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={t('footer.returns', { defaultValue: 'Returns' })} />
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('footer.returns', { defaultValue: 'Returns' })}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {t('support.returns.p1', {
            defaultValue:
              'Unworn items with tags may be returned within 14 days of delivery, subject to inspection. Sale and final-sale pieces may be excluded.',
          })}
        </p>
        <p>
          {t('support.returns.p2', {
            defaultValue:
              'Start a return request via your order confirmation email or contact care@fivefashion.com with the order number.',
          })}
        </p>
      </div>
    </div>
  );
}
