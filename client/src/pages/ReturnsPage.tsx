import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

export function ReturnsPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? 'الإرجاع والاستبدال' : 'Returns & exchanges';
  const description = isArabic
    ? 'تعرف على شروط الإرجاع، المدة، وحالة المنتجات المؤهلة.'
    : 'Learn about return eligibility, timelines, and product conditions.';

  const sections = isArabic
    ? [
        ['مدة الإرجاع', 'يمكن طلب إرجاع المنتجات غير المستخدمة خلال 14 يومًا من تاريخ التسليم، مع خضوع الطلب للفحص والموافقة.'],
        ['حالة المنتج', 'يجب أن يكون المنتج غير مستخدم وبحالته الأصلية مع البطاقات أو الملصقات المرفقة به.'],
        ['المنتجات المستثناة', 'قد لا تشمل سياسة الإرجاع بعض المنتجات المخفضة أو المباعة نهائيًا، وفقًا لشروط العرض أو المنتج.'],
        ['طريقة طلب الإرجاع', 'للبدء، تواصل مع خدمة العملاء عبر care@fivefashion.com مع ذكر رقم الطلب وتفاصيل المنتج المطلوب إرجاعه.'],
      ]
    : [
        ['Return window', 'Unused items may be returned within 14 days of delivery, subject to inspection and approval.'],
        ['Product condition', 'The item must be unworn and in its original condition with attached tags or labels.'],
        ['Excluded items', 'Some sale or final-sale products may be excluded from the return policy according to the offer or product terms.'],
        ['How to request a return', 'To start a return, contact care@fivefashion.com with your order number and the product you want to return.'],
      ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={title} description={description} />
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{isArabic ? 'الدعم' : 'Support'}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {sections.map(([heading, body]) => (
          <section key={heading} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">{heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
