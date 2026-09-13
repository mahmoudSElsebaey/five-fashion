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

const EDITORIAL_IMAGE =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90';

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  return (
    <div className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-background">
      <div className="grid min-h-[calc(100vh-var(--header-height))] lg:grid-cols-[1.08fr_0.92fr]">
        {/* Editorial brand side */}
        <aside className="relative hidden min-h-[680px] overflow-hidden lg:block">
          <img
            src={EDITORIAL_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/35 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.16) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />

          <div className="absolute left-8 top-8 right-8 flex items-start justify-between text-white">
            <Link to="/" className="group" aria-label="FIVE Fashion">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="FIVE" className="h-11 w-auto object-contain drop-shadow-lg" />
                <span className="hidden border-l border-white/30 pl-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 xl:block">
                  Fashion house
                </span>
              </div>
            </Link>
            <span className="font-display text-5xl font-semibold leading-none tracking-[-0.08em] text-white/80">
              05
            </span>
          </div>

          <div className="absolute bottom-10 left-8 right-8 text-white xl:bottom-14 xl:left-12 xl:right-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-accent">
              {isArabic ? 'هوية تتجاوز الموضة' : 'Identity beyond fashion'}
            </p>
            <h2 className="max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-tight text-white xl:text-6xl">
              {isArabic ? 'ارتدِ حضورك.' : 'Wear your presence.'}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              {isArabic
                ? 'تجربة FIVE تبدأ من التفاصيل. ادخل إلى عالمك واكتشف القطع المصممة لتترك أثرًا.'
                : 'The FIVE experience starts with the details. Step into your world and discover pieces designed to leave an impression.'}
            </p>

            <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/55">
              <span className="h-px w-10 bg-accent" />
              <span>{isArabic ? 'المجموعة الحالية' : 'Current collection'}</span>
            </div>
          </div>
        </aside>

        {/* Form side */}
        <main className="relative flex min-h-[calc(100vh-var(--header-height))] items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-background" />
            <div
              className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
              style={{ background: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-15 blur-3xl"
              style={{ background: 'color-mix(in srgb, var(--accent) 28%, transparent)' }}
            />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-[470px]">
            <div className="mb-7 flex items-center justify-between lg:hidden">
              <Link to="/" aria-label="FIVE Fashion">
                <img src="/logo.png" alt="FIVE" className="h-10 w-auto object-contain" />
              </Link>
              <span className="font-display text-3xl font-semibold tracking-[-0.08em] text-accent">05</span>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-9">
              <BorderBeam size={180} duration={8} />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 dark:ring-white/5" />

              <div className="relative">
                <div className="mb-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-accent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                      {isArabic ? 'FIVE Fashion' : 'FIVE Fashion'}
                    </span>
                  </div>
                  <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {title}
                  </h1>
                  {subtitle && <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
                </div>

                {children}

                {footer && <div className="mt-7 text-center text-sm text-muted-foreground">{footer}</div>}

                <p className="mt-7 text-center text-[9px] uppercase tracking-[0.28em] text-muted-foreground/60">
                  {isArabic ? 'فايف فاشن · تفاصيل تصنع الفرق' : 'FIVE Fashion · Details make the difference'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
