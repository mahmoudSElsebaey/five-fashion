import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';

export function PrivacyPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? 'سياسة الخصوصية' : 'Privacy Policy';
  const paragraphs = isArabic
    ? [
        'تحترم FIVE Fashion خصوصيتك وتلتزم بحماية بياناتك الشخصية. نستخدم بيانات الحساب والطلبات وتفضيلات الجهاز فقط لتشغيل المتجر، وتنفيذ عمليات الشراء، وتحسين تجربة التسوق.',
        'نحن لا نبيع بياناتك الشخصية. عند تفعيل الدفع الإلكتروني، تتم معالجة بيانات الدفع من خلال مزود خدمة الدفع. أما الطلبات عند الدفع عند الاستلام، فنحتفظ فقط ببيانات التواصل اللازمة للشحن وتنفيذ الطلب.',
        'يمكنك طلب الوصول إلى بيانات حسابك أو حذفها من خلال التواصل مع الدعم عبر ملفك الشخصي أو البريد الإلكتروني المسجل. نحتفظ بالبيانات فقط بالقدر اللازم لتقديم خدماتنا والوفاء بالالتزامات القانونية.',
      ]
    : [
        'FIVE Fashion respects your privacy and is committed to protecting your personal data. We use account data, order information, and device preferences only to operate the store, fulfill purchases, and improve your shopping experience.',
        'We do not sell personal data. When online payments are enabled, payment details are processed by the payment provider. For cash-on-delivery orders, we store only the contact and shipping information needed to fulfill the order.',
        'You may request access to or deletion of your account data by contacting support through your profile or registered email. We retain data only as needed to provide our services and meet legal obligations.',
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
