import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { i18n } = useTranslation();
  // Initialize theme on mount
  useTheme();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Placeholder routes for navigation */}
        <Route path="/shop" element={<HomePage />} />
        <Route path="/collections" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
