import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === 'admin';
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-normal ease-five after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-accent after:transition-transform after:duration-normal ${
      isActive
        ? 'text-foreground after:scale-x-100'
        : 'text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-75'
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-muted text-foreground ring-1 ring-border'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Desktop: left navigation */}
        <nav className="hidden items-center justify-start gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.key} to={item.path} end={item.path === '/'} className={navClass}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Centered desktop brand */}
        <div className="flex justify-center">
          <Link to="/" className="flex shrink-0 items-center" onClick={() => setMobileOpen(false)} aria-label="FIVE Fashion home">
            <img
              src="/logo.png"
              alt="FIVE Fashion"
              className="h-14 w-auto max-w-[180px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none md:h-16 lg:h-[4.5rem] lg:max-w-[220px]"
            />
          </Link>
        </div>

        {/* Desktop: utility actions */}
        <div className="hidden items-center justify-end gap-1 md:flex">
          {isAdmin && (
            <Link to="/admin" aria-label={t('admin.nav.dashboard', { defaultValue: 'Admin Dashboard' })}>
              <Button
                variant="ghost"
                size="sm"
                className="group h-9 gap-2 rounded-lg border border-accent/45 bg-accent/10 px-3 text-accent shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent/10 hover:text-accent hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <span className="hidden lg:inline">{t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}</span>
              </Button>
            </Link>
          )}
          <LanguageToggle />
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="ghost" size="sm">{t('auth.login')}</Button>
            </Link>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </Button>
            </Link>
          )}
          <Link to="/wishlist">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlistCount > 0 && <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">{wishlistCount}</span>}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0" aria-label="Cart" onClick={() => dispatch(openCart())}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">{cartCount}</span>}
          </Button>
        </div>

        {/* Mobile: simple logo + menu */}
        <div className="col-span-3 flex items-center justify-between md:hidden">
          <Link to="/" className="flex shrink-0 items-center" onClick={() => setMobileOpen(false)} aria-label="FIVE Fashion home">
            <img
              src="/logo.png"
              alt="FIVE Fashion"
              className="h-11 w-auto max-w-[150px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none"
            />
          </Link>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.key} to={item.path} end={item.path === '/'} onClick={() => setMobileOpen(false)} className={mobileNavClass}>
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all ${isActive ? 'border-accent bg-accent text-accent-foreground shadow-sm' : 'border-accent/40 bg-accent/10 text-accent hover:border-accent/70 hover:bg-accent/10 hover:text-accent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                {t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}
              </NavLink>
            )}
            {!isAuthenticated && (
              <NavLink to="/login" end onClick={() => setMobileOpen(false)} className={mobileNavClass}>
                {t('auth.login')}
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
