import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import type { RootState } from '@/store';

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res.data?.user && res.data.accessToken && res.data.refreshToken) {
        dispatch(
          setCredentials({
            user: {
              ...res.data.user,
              id: String(res.data.user.id),
            },
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );
        navigate('/', { replace: true });
      } else {
        setError(t('auth.registerError'));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t('auth.registerTitle')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('auth.registerSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5" noValidate>
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error" role="alert">
            {error}
          </div>
        )}

        <Input
          label={t('auth.name')}
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label={t('auth.confirmPassword')}
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" fullWidth isLoading={loading}>
          {t('auth.register')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="font-medium text-foreground hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}
