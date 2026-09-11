import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

export function ShippingPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? 'الشحن والتوصيل' : 'Shipping & delivery';
  const description = isArabic
    ? 'معلومات واضحة عن تجهيز الطلبات، مدة التوصيل، التتبع والدفع عند الاستلام.'
    : 'Clear information about order processing, delivery, tracking, and cash on delivery.';

  const sections = isArabic
    ? [
        ['تجهيز الطلب', 'يتم تجهيز طلبك بعد تأكيده ومراجعة تفاصيله. قد تختلف مدة التجهيز حسب توفر المنتج وحجم الطلب.'],
        ['مدة التوصيل', 'تظهر مدة الشحن المتوقعة أثناء إتمام الطلب، وقد تختلف حسب المدينة وشركة الشحن والظروف التشغيلية.'],
        ['تتبع الطلب', 'عند توفر رقم التتبع، يتم إرساله عبر البريد الإلكتروني عند استلام شركة الشحن للطرد ومسحه في نظامها.'],
        ['الدفع عند الاستلام', 'يتوفر الدفع عند الاستلام في المناطق التي يدعمها المتجر، وتظهر الخيارات المتاحة أثناء إتمام الشراء.'],
      ]
    : [
        ['Order processing', 'Orders are prepared after confirmation and review of the order details. Processing time may vary based on product availability and order size.'],
        ['Delivery time', 'The estimated delivery timeline is shown during checkout and may vary by city, courier, and operating conditions.'],
        ['Order tracking', 'When tracking is available, tracking details are sent by email after the courier receives and scans the package.'],
        ['Cash on delivery', 'Cash on delivery is available in supported areas, with the available options shown during checkout.'],
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
