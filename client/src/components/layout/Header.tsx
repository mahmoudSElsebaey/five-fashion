import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { openCart, selectCartCount } from '@/features/cart/cartSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';

const navItems = [
  { key: 'home', path: '/' },
  { key: 'shop', path: '/shop' },
  { key: 'collections', path: '/collections' },
  { key: 'about', path: '/about' },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === 'admin';
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useLayoutEffect(() => {
    const update = () => {
      const idx = navItems.findIndex((item) =>
        item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path)
      );
      const el = idx >= 0 ? itemRefs.current[idx] : null;
      const parent = navRef.current;
      if (!el || !parent) {
        setIndicator((s) => ({ ...s, opacity: 0 }));
        return;
      }
      const parentRect = parent.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: 1,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [location.pathname, t]);

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent/15 text-accent ring-1 ring-accent/40'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/75 backdrop-blur-md">
      {/* Desktop header */}
      <div className="mx-auto hidden h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 md:flex sm:px-6 lg:px-8">
        <nav
          ref={navRef}
          className="relative flex items-center gap-0.5 rounded-full border border-border/70 bg-surface/80 p-1 shadow-sm backdrop-blur-sm"
          aria-label="Main navigation"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-accent/15 shadow-inner transition-all duration-300 ease-five"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
          {navItems.map((item, i) => (
            <NavLink
              key={item.key}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative z-10 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="flex shrink-0 items-center" aria-label="FIVE Fashion home">
          <img
            src="/logo.png"
            alt="FIVE Fashion"
            className="h-14 w-auto max-w-[180px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none lg:h-16 lg:max-w-[200px]"
          />
        </Link>

        <div
          className="flex items-end gap-1 rounded-full border border-border/70 bg-surface/80 px-2 py-1.5 shadow-sm backdrop-blur-sm"
          role="toolbar"
          aria-label="Utilities"
        >
          {isAdmin && (
            <DockItem to="/admin" label={t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </DockItem>
          )}
          <div className="flex items-center px-0.5">
            <LanguageToggle />
          </div>
          {!isAuthenticated && (
            <DockItem to="/login" label={t('auth.login')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            </DockItem>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <DockItem to="/profile" label="Profile" >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </DockItem>
          )}
          <DockItem to="/wishlist" label="Wishlist" badge={wishlistCount} >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </DockItem>
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-muted hover:text-foreground"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile header — single row only */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:hidden">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => setMobileOpen(false)} aria-label="FIVE Fashion home">
          <img
            src="/logo.png"
            alt="FIVE Fashion"
            className="h-11 w-auto max-w-[140px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none"
          />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={mobileNavClass}
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" end onClick={() => setMobileOpen(false)} className={mobileNavClass}>
                {t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}
              </NavLink>
            )}
            {!isAuthenticated && (
              <NavLink to="/login" end onClick={() => setMobileOpen(false)} className={mobileNavClass}>
                {t('auth.login')}
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/profile" end onClick={() => setMobileOpen(false)} className={mobileNavClass}>
                {t('nav.profile', { defaultValue: 'Profile' })}
              </NavLink>
            )}
            <NavLink to="/wishlist" end onClick={() => setMobileOpen(false)} className={mobileNavClass}>
              {t('nav.wishlist', { defaultValue: 'Wishlist' })}
              {wishlistCount > 0 ? ` (${wishlistCount})` : ''}
            </NavLink>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                dispatch(openCart());
              }}
              className="rounded-xl px-3 py-2.5 text-start text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t('nav.cart', { defaultValue: 'Cart' })}
              {cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function DockItem({
  to,
  label,
  children,
  badge,
}: {
  to: string;
  label: string;
  children: ReactNode;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-muted hover:text-foreground"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
