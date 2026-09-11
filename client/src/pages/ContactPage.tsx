import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';

export function ContactPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [sent, setSent] = useState(false);

  const title = isArabic ? 'تواصل معنا' : 'Contact us';
  const description = isArabic
    ? 'نحن هنا لمساعدتك في الطلبات، المقاسات، الشحن، الإرجاع وأي استفسار متعلق بتجربة FIVE Fashion.'
    : 'We are here to help with orders, sizing, shipping, returns, and anything related to your FIVE Fashion experience.';

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={title} description={description} />
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{isArabic ? 'الدعم' : 'Support'}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">{isArabic ? 'خدمة العملاء' : 'Customer care'}</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p><span className="font-medium text-foreground">Email:</span> care@fivefashion.com</p>
            <p><span className="font-medium text-foreground">{isArabic ? 'وقت الرد:' : 'Response time:'}</span> {isArabic ? 'عادة خلال 1–2 يوم عمل.' : 'Usually within 1–2 business days.'}</p>
            <p>{isArabic ? 'عند التواصل بخصوص طلب موجود، يرجى ذكر رقم الطلب لتسريع المساعدة.' : 'For an existing order, include your order number so we can assist you faster.'}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          {sent ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <h2 className="text-lg font-semibold">{isArabic ? 'تم استلام رسالتك' : 'Message received'}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{isArabic ? 'شكرًا لتواصلك معنا. سنراجع رسالتك قريبًا.' : 'Thanks for reaching out. We will review your message soon.'}</p>
              <Button type="button" variant="outline" className="mt-6" onClick={() => setSent(false)}>{isArabic ? 'رسالة جديدة' : 'New message'}</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <h2 className="text-lg font-semibold">{isArabic ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">{isArabic ? 'الاسم' : 'Name'}</label>
                <input id="contact-name" required className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
                <input id="contact-email" type="email" required className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">{isArabic ? 'الرسالة' : 'Message'}</label>
                <textarea id="contact-message" required rows={5} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button type="submit" className="w-full">{isArabic ? 'إرسال الرسالة' : 'Send message'}</Button>
              <p className="text-xs text-muted-foreground">{isArabic ? 'النموذج يسجل حالة الإرسال محليًا فقط حتى يتم ربط خدمة بريد أو دعم حقيقية.' : 'This form currently acknowledges submission locally until a real email or support service is connected.'}</p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
