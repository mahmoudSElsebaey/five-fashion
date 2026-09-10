import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { openCart, selectCartCount } from '@/features/cart/cartSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';
import type { RootState } from '@/store';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-wide transition-colors hover:text-foreground ${
    isActive ? 'text-foreground' : 'text-muted-foreground'
  }`;

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="FIVE" className="h-8 w-auto object-contain" />
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
            FIVE
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            {t('nav.shop')}
          </NavLink>
          <NavLink to="/shop?new=1" className={navLinkClass}>
            {t('nav.collections')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            to="/wishlist"
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted sm:inline-block"
            >
              {t('nav.login')}
            </Link>
          )}

          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/shop" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              {t('nav.shop')}
            </NavLink>
            {!isAuthenticated && (
              <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.login')}
              </NavLink>
            )}
          </nav>
        </div>
      )}

      <CartDrawer />
    </header>
  );
}
