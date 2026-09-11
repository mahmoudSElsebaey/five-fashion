import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store';
import { logout } from '@/features/auth/authSlice';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { Button } from '@/components/ui/Button';

const links = [
  { to: '/admin', end: true, key: 'dashboard' },
  { to: '/admin/products', key: 'products' },
  { to: '/admin/categories', key: 'categories' },
  { to: '/admin/collections', key: 'collections' },
  { to: '/admin/orders', key: 'orders' },
  { to: '/admin/customers', key: 'customers' },
  { to: '/admin/reviews', key: 'reviews' },
  { to: '/admin/coupons', key: 'coupons' },
];

const arabicLabels: Record<string, string> = {
  dashboard: 'لوحة التحكم',
  products: 'المنتجات',
  categories: 'الفئات',
  collections: 'المجموعات',
  orders: 'الطلبات',
  customers: 'العملاء',
  reviews: 'التقييمات',
  coupons: 'كوبونات الخصم',
};

const englishLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  collections: 'Collections',
  orders: 'Orders',
  customers: 'Customers',
  reviews: 'Reviews',
  coupons: 'Coupons',
};

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t, i18n } = useTranslation();
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const handleLogout = () => {
    dispatch(logout());
    onNavigate?.();
    navigate('/login');
  };

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-e border-border bg-surface">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <img src="/logo.png" alt="FIVE Fashion" className="h-8 w-auto object-contain" />
      </div>

      <nav className="flex flex-col gap-0.5 overflow-y-auto p-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`
            }
          >
            {t(`admin.nav.${link.key}`, {
              defaultValue: (isArabic ? arabicLabels : englishLabels)[link.key],
            })}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2">
          <LanguageToggle />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1 justify-center gap-2 text-muted-foreground hover:text-destructive"
            aria-label={isArabic ? 'تسجيل الخروج' : 'Logout'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span>{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>
          </Button>
        </div>

        <div className="mb-2 rounded-lg bg-muted/40 px-3 py-2">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name || user?.email?.split('@')[0] || (isArabic ? 'المشرف' : 'Admin')}
          </p>
          {user?.email && (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          )}
        </div>
        <NavLink
          to="/"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {t('admin.backToStore')}
        </NavLink>
      </div>
    </aside>
  );
}
