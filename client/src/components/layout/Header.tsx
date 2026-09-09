import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/shop', labelKey: 'nav.shop' },
  { href: '/collections', labelKey: 'nav.collections' },
  { href: '/about', labelKey: 'nav.about' },
];

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="FIVE Fashion"
              className="h-9 w-auto object-contain"
            />
            <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
              FIVE
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="
                  rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground
                  transition-colors duration-normal ease-five
                  hover:bg-surface-hover hover:text-foreground
                "
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSwitcher />

            <button
              type="button"
              aria-label="Cart"
              className="
                relative inline-flex h-10 w-10 items-center justify-center rounded-lg
                text-foreground transition-all duration-normal ease-five
                hover:bg-surface-hover
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-surface-hover"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16M4 12h16M4 19h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}
