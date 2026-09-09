import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    localStorage.setItem('five-lang', next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Change language"
      className="
        inline-flex h-10 items-center justify-center rounded-lg px-3
        text-sm font-medium text-foreground
        transition-all duration-normal ease-five
        hover:bg-surface-hover
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      {i18n.language === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
