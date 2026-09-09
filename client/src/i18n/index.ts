import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to FIVE',
      tagline: 'Luxury 3D Fashion Platform',
      brand: 'FIVE Fashion',
      nav: {
        home: 'Home',
        shop: 'Shop',
        collections: 'Collections',
        about: 'About',
      },
      footer: {
        tagline: 'Luxury fashion redefined through immersive digital experiences.',
        shop: 'Shop',
        newArrivals: 'New Arrivals',
        sale: 'Sale',
        support: 'Support',
        contact: 'Contact Us',
        shipping: 'Shipping',
        returns: 'Returns',
        faq: 'FAQ',
        newsletter: 'Newsletter',
        newsletterDesc: 'Stay ahead of the season.',
        emailPlaceholder: 'Your email',
        subscribe: 'Join',
        rights: 'All rights reserved.',
        privacy: 'Privacy',
        terms: 'Terms',
      },
      home: {
        hero: {
          badge: 'SS 2026',
          title: 'The Future of Luxury is Here',
          subtitle: 'Discover a new dimension of fashion. Immersive, refined, and crafted for those who demand more.',
          ctaPrimary: 'Shop Now',
          ctaSecondary: 'Explore Collections',
        },
        collections: {
          label: 'Collections',
          title: 'Curated Worlds',
          viewAll: 'View all',
          items: {
            essentials: 'Essentials',
            evening: 'Evening',
            street: 'Street Atelier',
            atelier: 'The Atelier',
          },
        },
        arrivals: {
          label: 'Just In',
          title: 'New Arrivals',
          viewAll: 'View all',
          new: 'New',
          sale: 'Sale',
          products: {
            silkBlazer: 'Silk Tailored Blazer',
            structuredCoat: 'Structured Wool Coat',
            fluidDress: 'Fluid Silk Dress',
            tailoredTrousers: 'Tailored Trousers',
          },
        },
        editorial: {
          label: 'Journal',
          title: 'Crafted for the Modern Era',
          body: 'FIVE redefines luxury through precision, material innovation, and digital experience. Every piece is a statement of quiet power.',
          cta: 'Discover the Brand',
        },
        offers: {
          label: 'Limited',
          title: 'Seasonal Edit — Up to 30% Off',
          subtitle: 'Selected pieces from the previous season. While stocks last.',
          cta: 'Shop the Offer',
        },
      },
    },
  },
  ar: {
    translation: {
      welcome: 'مرحبًا بك في FIVE',
      tagline: 'منصة أزياء فاخرة ثلاثية الأبعاد',
      brand: 'FIVE Fashion',
      nav: {
        home: 'الرئيسية',
        shop: 'المتجر',
        collections: 'المجموعات',
        about: 'عن العلامة',
      },
      footer: {
        tagline: 'أزياء فاخرة تُعاد تعريفها من خلال تجارب رقمية غامرة.',
        shop: 'تسوق',
        newArrivals: 'وصل حديثًا',
        sale: 'تخفيضات',
        support: 'الدعم',
        contact: 'تواصل معنا',
        shipping: 'الشحن',
        returns: 'الإرجاع',
        faq: 'الأسئلة الشائعة',
        newsletter: 'النشرة البريدية',
        newsletterDesc: 'كن أول من يعرف عن الموسم الجديد.',
        emailPlaceholder: 'بريدك الإلكتروني',
        subscribe: 'اشترك',
        rights: 'جميع الحقوق محفوظة.',
        privacy: 'الخصوصية',
        terms: 'الشروط',
      },
      home: {
        hero: {
          badge: 'ربيع/صيف 2026',
          title: 'مستقبل الفخامة هنا',
          subtitle: 'اكتشف بُعدًا جديدًا من الأزياء. غامرة، راقية، ومصممة لمن يطلبون المزيد.',
          ctaPrimary: 'تسوق الآن',
          ctaSecondary: 'استكشف المجموعات',
        },
        collections: {
          label: 'المجموعات',
          title: 'عوالم مختارة',
          viewAll: 'عرض الكل',
          items: {
            essentials: 'الأساسيات',
            evening: 'المساء',
            street: 'ستريت أتلييه',
            atelier: 'الأتلييه',
          },
        },
        arrivals: {
          label: 'وصل حديثًا',
          title: 'وصل حديثًا',
          viewAll: 'عرض الكل',
          new: 'جديد',
          sale: 'تخفيض',
          products: {
            silkBlazer: 'بليزر حرير مفصّل',
            structuredCoat: 'معطف صوف هيكلي',
            fluidDress: 'فستان حرير انسيابي',
            tailoredTrousers: 'بنطلون مفصّل',
          },
        },
        editorial: {
          label: 'المجلة',
          title: 'صُنع للعصر الحديث',
          body: 'تعيد FIVE تعريف الفخامة من خلال الدقة وابتكار المواد والتجربة الرقمية. كل قطعة بيان لقوة هادئة.',
          cta: 'اكتشف العلامة',
        },
        offers: {
          label: 'لفترة محدودة',
          title: 'اختيارات الموسم — خصم حتى 30%',
          subtitle: 'قطع مختارة من الموسم السابق. حتى نفاذ الكمية.',
          cta: 'تسوق العرض',
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('five-lang') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
