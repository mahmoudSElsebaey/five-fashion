import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

export function TermsPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? 'الشروط والأحكام' : 'Terms & Conditions';
  const paragraphs = isArabic
    ? [
        'باستخدامك لموقع FIVE Fashion، فإنك توافق على تقديم معلومات صحيحة ودقيقة عند الطلب، وعلى أن توفر المنتجات حسب المخزون المتاح وقت تأكيد الطلب، وكذلك على مدد الشحن الموضحة أثناء إتمام الشراء.',
        'قد تتغير الأسعار والعروض الترويجية وأهلية استخدام كوبونات الخصم. يمكن إلغاء الطلبات التي ما زالت في حالة قيد الانتظار وفقًا لسياسة المتجر.',
        'صور المنتجات والمعاينات ثلاثية الأبعاد لأغراض توضيحية. قد تحدث اختلافات بسيطة في الخامة أو اللون بين دفعات الإنتاج المختلفة.',
      ]
    : [
        'By using FIVE Fashion, you agree to provide accurate order information, acknowledge that products are subject to stock availability at confirmation, and accept the shipping timelines shown during checkout.',
        'Prices, promotions, and coupon eligibility may change. Orders can be cancelled while their status is pending according to the store policy.',
        'Product images and 3D previews are for illustration purposes. Minor variations in fabric, finish, and color may occur between production batches.',
      ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={title} noindex />
      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </div>
  );
}
