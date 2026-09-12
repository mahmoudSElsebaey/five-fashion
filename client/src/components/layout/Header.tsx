import { useEffect, useState, type ReactNode } from 'react';
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

/** Portfolio-style active link: left/right accent borders + soft fill. */
const pageNavClass = ({ isActive }: { isActive: boolean }) =>
  `capitalize rounded-[10px] px-3.5 py-2 text-sm transition-colors duration-200 ${
    isActive
      ? 'border-s-2 border-e-2 border-accent bg-accent/10 font-extrabold text-accent'
      : 'border-s-2 border-e-2 border-transparent font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground'
  }`;

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

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'border-s-2 border-e-2 border-accent bg-accent/10 font-extrabold text-accent'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/25 bg-background/80 backdrop-blur-md">
      <div className="mx-auto hidden h-[5.25rem] max-w-7xl items-center justify-center gap-6 px-4 md:flex lg:gap-8 lg:px-8">
        <nav className="flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.key} to={item.path} end={item.path === '/'} className={pageNavClass}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `ms-1 capitalize rounded-[10px] px-3.5 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? 'border border-accent bg-accent font-extrabold text-accent-foreground shadow-sm'
                    : 'border border-accent/50 bg-accent/10 font-semibold text-accent hover:border-accent hover:bg-accent/20'
                }`
              }
            >
              {t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}
            </NavLink>
          )}
        </nav>

        <Link to="/" className="flex shrink-0 items-center" aria-label="FIVE Fashion home">
          <img
            src="/logo.png"
            alt="FIVE Fashion"
            className="h-[4.25rem] w-auto max-w-[220px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none lg:h-[4.75rem] lg:max-w-[240px]"
          />
        </Link>

        <div className="flex items-center gap-0.5" role="toolbar" aria-label="Utilities">
          <LanguageToggle />
          {!isAuthenticated && (
            <IconBtn to="/login" label={t('auth.login')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            </IconBtn>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <IconBtn to="/profile" label={t('nav.profile', { defaultValue: 'Profile' })}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </IconBtn>
          )}
          <IconBtn to="/wishlist" label="Wishlist" badge={wishlistCount}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </IconBtn>
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 md:hidden">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => setMobileOpen(false)} aria-label="FIVE Fashion home">
          <img
            src="/logo.png"
            alt="FIVE Fashion"
            className="h-12 w-auto max-w-[160px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none"
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
        <div className="border-t border-accent/20 bg-background md:hidden">
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
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-accent/40 bg-accent/10 text-accent'
                  }`
                }
              >
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
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-accent/20 pt-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function IconBtn({
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
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
