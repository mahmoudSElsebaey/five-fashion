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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<DemoAccount['key'] | null>(null);

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          className="h-11 rounded-xl border-border/80 bg-surface/80"
          {...register('email')}
        />

        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          className="h-11 rounded-xl border-border/80 bg-surface/80"
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={loading} className="h-12 rounded-xl">
          {t('auth.login')}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4">
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
                className={`rounded-xl border px-3 py-3 text-start transition-all duration-normal ease-five hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background ${
                  isSelected
                    ? 'border-accent/50 bg-background shadow-sm ring-1 ring-accent/20'
                    : 'border-border/70 bg-background/50'
                }`}
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
