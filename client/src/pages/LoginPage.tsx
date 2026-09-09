import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.data?.user && res.data.accessToken && res.data.refreshToken) {
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('auth.loginSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={loading}>
          {t('auth.login')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-medium text-foreground hover:underline">
          {t('auth.register')}
        </Link>
      </p>
    </div>
  );
}
