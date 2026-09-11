import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

/** SECTION 14 — Contact */
export function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Seo
        title={t('footer.contact', { defaultValue: 'Contact' })}
        description={t('support.contact.seo', {
          defaultValue: 'Contact FIVE Fashion customer care.',
        })}
      />
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('footer.contact', { defaultValue: 'Contact' })}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {t('support.contact.p1', {
            defaultValue:
              'For order questions, sizing, or partnership inquiries, email care@fivefashion.com. We typically respond within 1–2 business days.',
          })}
        </p>
        <p>
          {t('support.contact.p2', {
            defaultValue:
              'Include your order number when writing about an existing purchase. Live chat is not available yet.',
          })}
        </p>
      </div>
    </div>
  );
}
