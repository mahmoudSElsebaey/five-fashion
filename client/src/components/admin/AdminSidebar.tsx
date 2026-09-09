import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const links = [
  { to: '/admin', end: true, key: 'dashboard' },
  { to: '/admin/products', key: 'products' },
  { to: '/admin/orders', key: 'orders' },
];

export function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-e border-border bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <img src="/logo.png" alt="FIVE" className="h-6 w-auto" />
        <span className="font-display text-sm font-semibold tracking-tight">Admin</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`
            }
          >
            {t(`admin.nav.${link.key}`)}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-border p-3">
        <NavLink
          to="/"
          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t('admin.backToStore')}
        </NavLink>
      </div>
    </aside>
  );
}
