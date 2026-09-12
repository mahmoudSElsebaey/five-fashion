import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BorderBeam } from './BorderBeam';

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  return (
    <div className="relative flex min-h-[calc(100vh-var(--header-height))] items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
      {/* Atmospheric brand background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 80%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative w-full max-w-[420px]">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-xl dark:bg-card/80">
          <BorderBeam size={140} duration={9} />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <Link
                to="/"
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-surface shadow-sm transition-transform duration-normal ease-five hover:scale-105"
                aria-label="FIVE Fashion"
              >
                <span className="font-display text-lg font-semibold tracking-tight text-foreground">F</span>
              </Link>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              {isArabic ? 'فايف فاشن' : 'FIVE Fashion'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
