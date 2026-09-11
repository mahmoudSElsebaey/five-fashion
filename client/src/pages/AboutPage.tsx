import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';

/** SECTION 11 — Brand about page */
export function AboutPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const title = isArabic ? 'FIVE Fashion' : 'FIVE Fashion';
  const seoTitle = isArabic ? 'عن FIVE Fashion' : 'About FIVE Fashion';
  const seoDescription = isArabic
    ? 'FIVE Fashion — أزياء عصرية راقية وتجربة تسوق رقمية متكاملة.'
    : 'FIVE Fashion — refined luxury ready-to-wear and digital craft.';

  const label = isArabic ? 'الدار' : 'The house';
  const paragraphs = isArabic
    ? [
        'FIVE هي دار أزياء عصرية تركز على القصّات الدقيقة، والفخامة الهادئة، وتجربة رقمية متكاملة. صُممت كل قطعة بعناية لتمنحك إحساسًا مميزًا، سواء عند ارتدائها أو أثناء استكشافها عبر الموقع.',
        'نمزج بين الحرفية والتكنولوجيا من خلال تجربة تسوق ثنائية اللغة، وعرض متقن لتفاصيل المنتجات، ومعاينات ثلاثية الأبعاد تساعدك على استكشاف التصميم والشكل قبل الطلب.',
        'من القاهرة إلى العالم — إصدارات محدودة، خامات مختارة بعناية، وخدمة تحترم وقتك وتفاصيل تجربتك.',
      ]
    : [
        'FIVE is a contemporary fashion house focused on precise cuts, quiet luxury, and an immersive digital experience. Every piece is designed to feel intentional — on the body and on the screen.',
        'We blend craftsmanship with technology: bilingual shopping, refined product storytelling, and 3D previews that let you explore silhouette before you order.',
        'From Cairo to the world — limited drops, considered materials, and service that respects your time.',
      ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={seoTitle} description={seoDescription} />
      <p className="text-sm font-medium tracking-widest text-accent uppercase">
        {label}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button size="lg">{isArabic ? 'تسوق الآن' : 'Shop'}</Button>
        </Link>
        <Link to="/collections">
          <Button size="lg" variant="outline">
            {isArabic ? 'المجموعات' : 'Collections'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
