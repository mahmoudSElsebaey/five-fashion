import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to FIVE',
      tagline: 'Luxury 3D Fashion Platform',
      brand: 'FIVE Fashion',
    },
  },
  ar: {
    translation: {
      welcome: 'مرحبًا بك في FIVE',
      tagline: 'منصة أزياء فاخرة ثلاثية الأبعاد',
      brand: 'FIVE Fashion',
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
