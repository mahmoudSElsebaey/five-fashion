import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

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

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.auth.user);

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
            {t(`admin.nav.${link.key}`, { defaultValue: link.key })}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <LanguageToggle />
        </div>
        <div className="mb-2 rounded-lg bg-muted/40 px-3 py-2">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name || user?.email?.split('@')[0] || 'Admin'}
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
