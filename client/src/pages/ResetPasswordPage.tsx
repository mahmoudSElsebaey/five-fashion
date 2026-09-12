import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { authApi } from '@/features/auth/authApi';

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    if (!token) {
      setError(t('auth.resetMissingToken'));
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, data.password);
      setSuccess(res.message || t('auth.resetSuccess'));
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.resetError'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title={t('auth.resetTitle')}>
        <p className="text-center text-sm text-muted-foreground">{t('auth.resetMissingToken')}</p>
        <div className="mt-8 text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-foreground underline">
            {t('auth.forgotTitle')}
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.resetTitle')}
      subtitle={t('auth.resetSubtitle')}
      footer={
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          {t('auth.backToLogin')}
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
            role="status"
          >
            {success}
          </div>
        )}

        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          className="h-11 rounded-xl border-border/80 bg-surface/80"
          {...register('password')}
        />
        <Input
          label={t('auth.confirmPassword')}
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          className="h-11 rounded-xl border-border/80 bg-surface/80"
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" fullWidth isLoading={loading} className="h-12 rounded-xl">
          {t('auth.resetSubmit')}
        </Button>
      </form>
    </AuthShell>
  );
}
