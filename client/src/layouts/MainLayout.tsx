import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SkipLink } from '@/components/a11y/SkipLink';
import { ScrollToTop } from '@/components/routing/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
