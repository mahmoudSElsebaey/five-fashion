import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

export function FaqPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? 'الأسئلة الشائعة' : 'Frequently asked questions';
  const description = isArabic
    ? 'إجابات سريعة عن الطلبات، الشحن، الكوبونات ومعاينة المنتجات.'
    : 'Quick answers about orders, shipping, coupons, and product previews.';

  const items = isArabic
    ? [
        ['كيف يمكنني تتبع طلبي؟', 'افتح قسم طلباتي من ملفك الشخصي لمتابعة حالة الطلب. وعند توفر رقم تتبع، يتم إرساله عبر البريد الإلكتروني.'],
        ['كم تستغرق عملية الشحن؟', 'تظهر مدة التوصيل المتوقعة أثناء إتمام الطلب، وقد تختلف حسب المدينة وشركة الشحن.'],
        ['هل يتوفر الشحن الدولي؟', 'يعتمد توفر الشحن الدولي على مناطق الشحن المفعلة للمتجر وقت إتمام الطلب.'],
        ['كيف أستخدم كوبون الخصم؟', 'أدخل الكود الصحيح في صفحة إتمام الشراء. يطبق الخصم عند استيفاء الحد الأدنى وباقي شروط الكوبون.'],
        ['هل يمكنني إرجاع المنتج؟', 'المنتجات غير المستخدمة يمكن إرجاعها خلال 14 يومًا من التسليم، مع الالتزام بشروط الإرجاع والفحص.'],
        ['هل المعاينة ثلاثية الأبعاد مطابقة للمنتج تمامًا؟', 'المعاينات ثلاثية الأبعاد لأغراض توضيحية. قد توجد اختلافات بسيطة في الخامة أو اللون بين المنتج والمعاينة.'],
      ]
    : [
        ['How can I track my order?', 'Open My Orders from your profile to follow the order status. When tracking is available, details are also sent by email.'],
        ['How long does shipping take?', 'The estimated delivery time is shown during checkout and may vary by city and courier.'],
        ['Do you offer international shipping?', 'International coverage depends on the shipping zones enabled for the store at checkout.'],
        ['How do I use a coupon?', 'Enter a valid code at checkout. The discount applies when the minimum and other coupon conditions are met.'],
        ['Can I return an item?', 'Unused items may be returned within 14 days of delivery, subject to the return conditions and inspection.'],
        ['Is the 3D preview exactly the same as the product?', '3D previews are illustrative. Minor differences in fabric or color may occur between the preview and the physical item.'],
      ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={title} description={description} />
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{isArabic ? 'الدعم' : 'Support'}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
      <dl className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface px-6 sm:px-8">
        {items.map(([question, answer]) => (
          <div key={question} className="py-6">
            <dt className="text-base font-semibold text-foreground">{question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
