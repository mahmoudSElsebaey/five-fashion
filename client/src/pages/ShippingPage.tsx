import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 14 — Shipping */
export function ShippingPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={t('footer.shipping', { defaultValue: 'Shipping' })} />
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('footer.shipping', { defaultValue: 'Shipping' })}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {t('support.shipping.p1', {
            defaultValue:
              'Orders ship after confirmation. Standard delivery timelines are shown at checkout and may vary by city and courier capacity.',
          })}
        </p>
        <p>
          {t('support.shipping.p2', {
            defaultValue:
              'You will receive tracking details by email when the carrier scans the package. Cash-on-delivery is available where enabled.',
          })}
        </p>
      </div>
    </div>
  );
}
