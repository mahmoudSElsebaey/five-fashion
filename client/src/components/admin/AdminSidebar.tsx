import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-e border-border bg-surface">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <img src="/logo.png" alt="FIVE" className="h-6 w-auto" />
        <span className="font-display text-sm font-semibold tracking-tight">Admin</span>
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
      <div className="mt-auto border-t border-border p-2">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t('admin.backToStore')}
        </NavLink>
      </div>
    </aside>
  );
}
