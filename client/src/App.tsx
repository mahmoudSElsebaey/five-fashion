import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;

    // Restore theme preference
    const savedTheme = localStorage.getItem('five-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/"
          element={
            <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
              <img
                src="/logo.png"
                alt="FIVE Fashion"
                className="h-24 w-auto object-contain md:h-32"
              />
              <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                FIVE
              </h1>
              <p className="max-w-md text-center text-muted-foreground">
                Luxury 3D Fashion Platform — Project initialized successfully.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-normal ease-five hover:opacity-90"
                  onClick={() => {
                    const next =
                      document.documentElement.getAttribute('data-theme') === 'dark'
                        ? 'light'
                        : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('five-theme', next);
                  }}
                >
                  Toggle Theme
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium transition-all duration-normal ease-five hover:bg-surface-hover"
                  onClick={() => {
                    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
                    i18n.changeLanguage(nextLang);
                    localStorage.setItem('five-lang', nextLang);
                  }}
                >
                  {i18n.language === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
