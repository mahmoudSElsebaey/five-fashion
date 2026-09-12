import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { openCart, selectCartCount } from '@/features/cart/cartSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';

const navItems = [
  {
    key: 'home',
    path: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'shop',
    path: '/shop',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: 'collections',
    path: '/collections',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
  {
    key: 'about',
    path: '/about',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === 'admin';
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen && !profileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (
        profileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mobileOpen, profileOpen]);

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent text-accent-foreground font-semibold'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md">
      {/* Desktop: three independent equal-width columns. */}
      <div className="mx-auto hidden h-[5.25rem] max-w-7xl grid-cols-3 items-center px-4 md:grid lg:px-8">
        <div className="flex min-w-0 w-full items-center justify-center">
          <nav
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-border/20 bg-surface/70 p-1.5 shadow-sm backdrop-blur-sm"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative flex shrink-0 items-center justify-center gap-2 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    isActive
                      ? 'bg-accent px-3.5 py-2.5 text-accent-foreground shadow-md shadow-accent/20 sm:px-4'
                      : 'px-2.5 py-2.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    <AnimatePresence initial={false} mode="popLayout">
                      {isActive && (
                        <motion.span
                          key={`${item.key}-label`}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 'auto', opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden whitespace-nowrap text-xs font-semibold sm:text-sm"
                        >
                          {t(`nav.${item.key}`)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 w-full items-center justify-center">
          <Link to="/" className="flex items-center justify-center" aria-label="FIVE Fashion home">
            <img
              src="/logo.png"
              alt="FIVE Fashion"
              className="h-[4.35rem] w-auto max-w-[230px] object-contain drop-shadow-[2px_3px_rgba(0,0,0,0.65)] dark:drop-shadow-none lg:h-[4.85rem] lg:max-w-[250px]"
            />
          </Link>
        </div>

        <div className="flex min-w-0 w-full items-center justify-center">
          <div
            className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-border/70 bg-surface/70 px-4 py-2 shadow-sm backdrop-blur-sm"
            role="toolbar"
            aria-label="Utilities"
          >
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
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    profileOpen
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-label={t('nav.profile', { defaultValue: 'Profile' })}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute end-0 top-full mt-2 w-48 origin-top-right rounded-2xl border border-border/70 bg-surface/95 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl"
                      role="menu"
                    >
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                        <span>{t('nav.profile', { defaultValue: 'Profile' })}</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                          <span>{t('admin.nav.dashboard', { defaultValue: 'Dashboard' })}</span>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <IconBtn to="/wishlist" label={t('nav.wishlist', { defaultValue: 'Wishlist' })} badge={wishlistCount}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </IconBtn>

            <button
              type="button"
              onClick={() => dispatch(openCart())}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t('nav.cart', { defaultValue: 'Cart' })}
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
      </div>

      {/* Mobile/tablet header remains separate from the desktop three-column layout. */}
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
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={mobileNavClass}
              >
                <span className="inline-flex items-center gap-2">
                  {item.icon}
                  {t(`nav.${item.key}`)}
                </span>
              </NavLink>
            ))}

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
              className="rounded-xl px-3 py-2.5 text-start text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t('nav.cart', { defaultValue: 'Cart' })}
              {cartCount > 0 ? ` (${cartCount})` : ''}
            </button>

            <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
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
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
