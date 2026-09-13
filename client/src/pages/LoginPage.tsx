import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { authApi } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import type { RootState } from '@/store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

type DemoAccount = {
  key: 'customer' | 'admin';
  email: string;
  password: string;
};

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    key: 'customer',
    email: 'demo.customer@fivefashion.com',
    password: 'FiveDemo2026!',
  },
  {
    key: 'admin',
    email: 'demo.admin@fivefashion.com',
    password: 'FiveAdmin2026!',
  },
];

function EyeIcon({ off = false }: { off?: boolean }) {
  return off ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 10.7a2 2 0 002.7 2.7" strokeLinecap="round" />
      <path d="M9.9 4.3A10.8 10.8 0 0112 4c5.5 0 9 5.8 9 5.8a17.7 17.7 0 01-3.1 3.8M6.1 6.2C3.9 7.9 3 9.8 3 9.8s3.5 5.8 9 5.8c.8 0 1.6-.1 2.3-.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true">
      <path d="M3 12s3.5-5.8 9-5.8S21 12 21 12s-3.5 5.8-9 5.8S3 12 3 12z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const redirectQuery = searchParams.get('redirect');
  const from =
    redirectQuery ||
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    '/';
  const locationMessage =
    (location.state as { message?: string } | null)?.message || '';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<DemoAccount['key'] | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from === '/login' ? '/' : from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const useDemoAccount = (account: DemoAccount) => {
    setError('');
    setSelectedDemo(account.key);
    setValue('email', account.email, { shouldValidate: true });
    setValue('password', account.password, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.data?.user && res.data.accessToken && res.data.refreshToken) {
        const user = {
          ...res.data.user,
          id: String(res.data.user.id),
        };
        dispatch(
          setCredentials({
            user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );
        const isAdmin = String(user.role || '').toLowerCase() === 'admin';
        const dest =
          isAdmin && (from === '/' || from === '/login') ? '/admin' : from === '/login' ? '/' : from;
        navigate(dest, { replace: true });
      } else {
        setError(t('auth.loginError'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const isArabic = i18n.language.startsWith('ar');

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            {t('auth.register')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {locationMessage && (
          <div
            className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground"
            role="status"
          >
            {locationMessage}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error" role="alert">
            {error}
          </div>
        )}

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          className="h-12 rounded-xl border-border/80 bg-surface/70"
          {...register('email')}
        />

        <div className="relative">
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={errors.password?.message}
            className="h-12 rounded-xl border-border/80 bg-surface/70 pe-12"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute end-3 top-[2.15rem] flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label={showPassword ? (isArabic ? 'إخفاء كلمة المرور' : 'Hide password') : isArabic ? 'إظهار كلمة المرور' : 'Show password'}
            title={showPassword ? (isArabic ? 'إخفاء كلمة المرور' : 'Hide password') : isArabic ? 'إظهار كلمة المرور' : 'Show password'}
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={loading} className="h-12 rounded-xl">
          {t('auth.login')}
        </Button>
      </form>

      <div className="mt-7 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <div className="mb-3 text-center">
          <p className="text-sm font-semibold text-foreground">
            {isArabic ? 'حسابات التجربة' : 'Demo accounts'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isArabic ? 'جرّب المتجر كعميل أو استكشف لوحة الإدارة' : 'Explore the store as a customer or admin'}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => {
            const isSelected = selectedDemo === account.key;
            const isAdmin = account.key === 'admin';
            return (
              <button
                key={account.key}
                type="button"
                onClick={() => useDemoAccount(account)}
                className={
                  isSelected
                    ? 'rounded-xl border px-3 py-3 text-start transition-all duration-normal ease-five hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background border-accent/50 bg-background shadow-sm ring-1 ring-accent/20'
                    : 'rounded-xl border px-3 py-3 text-start transition-all duration-normal ease-five hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background border-border/70 bg-background/50'
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {isArabic
                      ? isAdmin
                        ? 'مدير المتجر'
                        : 'عميل تجريبي'
                      : isAdmin
                        ? 'Store Admin'
                        : 'Demo Customer'}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{account.email}</p>
                <p className="mt-2 text-xs font-medium text-accent">
                  {isArabic ? 'استخدام الحساب' : 'Use this account'}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          {isArabic
            ? 'حسابات تجريبية عامة للمراجعة والعرض فقط.'
            : 'Public demo accounts for review and showcase only.'}
        </p>
      </div>
    </AuthShell>
  );
}
