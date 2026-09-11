import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';
import { useTheme } from '@/hooks/useTheme';
import { PageMeta } from '@/components/seo/PageMeta';
import { AuthCommerceSync } from '@/components/auth/AuthCommerceSync';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const WishlistPage = lazy(() =>
  import('@/pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const OrderConfirmationPage = lazy(() =>
  import('@/pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage }))
);
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })));
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage }))
);
const AdminOrdersPage = lazy(() =>
  import('@/pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage }))
);
const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminCollectionsPage = lazy(() =>
  import('@/pages/admin/AdminCollectionsPage').then((m) => ({ default: m.AdminCollectionsPage }))
);
const AdminCustomersPage = lazy(() =>
  import('@/pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage }))
);
const AdminReviewsPage = lazy(() =>
  import('@/pages/admin/AdminReviewsPage').then((m) => ({ default: m.AdminReviewsPage }))
);
const AdminCouponsPage = lazy(() =>
  import('@/pages/admin/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage }))
);

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  useTheme();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
    <AuthCommerceSync />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <>
                <PageMeta title="Home" path="/" />
                <HomePage />
              </>
            }
          />
          <Route
            path="/shop"
            element={
              <>
                <PageMeta title="Shop" path="/shop" />
                <ShopPage />
              </>
            }
          />
          <Route
            path="/collections"
            element={
              <>
                <PageMeta title="Collections" path="/collections" />
                <ShopPage />
              </>
            }
          />
          <Route path="/about" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/login"
            element={
              <>
                <PageMeta title="Sign in" path="/login" />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <PageMeta title="Create account" path="/register" />
                <RegisterPage />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <PageMeta title="Forgot password" path="/forgot-password" />
                <ForgotPasswordPage />
              </>
            }
          />
          <Route
            path="/reset-password"
            element={
              <>
                <PageMeta title="Reset password" path="/reset-password" />
                <ResetPasswordPage />
              </>
            }
          />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="collections" element={<AdminCollectionsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}

export default App;
