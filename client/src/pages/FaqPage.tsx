import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 14 — FAQ */
export function FaqPage() {
  const { t } = useTranslation();
  const items = [
    {
      q: t('support.faq.q1', { defaultValue: 'How do I track my order?' }),
      a: t('support.faq.a1', {
        defaultValue: 'Open My Orders from your profile or use the link in the confirmation email.',
      }),
    },
    {
      q: t('support.faq.q2', { defaultValue: 'Do you offer international shipping?' }),
      a: t('support.faq.a2', {
        defaultValue: 'Coverage depends on the active shipping zones configured for the store.',
      }),
    },
    {
      q: t('support.faq.q3', { defaultValue: 'How do coupons work?' }),
      a: t('support.faq.a3', {
        defaultValue:
          'Enter a valid code at checkout. Discounts apply only when minimums and limits are met.',
      }),
    },
    {
      q: t('support.faq.q4', { defaultValue: 'Is the 3D preview the exact product?' }),
      a: t('support.faq.a4', {
        defaultValue:
          '3D models are illustrative. Fabric and color can vary slightly between batches.',
      }),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo title={t('footer.faq', { defaultValue: 'FAQ' })} />
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('footer.faq', { defaultValue: 'FAQ' })}
      </h1>
      <dl className="mt-10 space-y-6">
        {items.map((item) => (
          <div key={item.q} className="border-b border-border pb-6">
            <dt className="font-medium text-foreground">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
