import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { authApi } from '@/features/auth/authApi';

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    setDevToken(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(data.email);
      setSuccess(res.message || t('auth.forgotSuccess'));
      if (res.resetToken) {
        setDevToken(res.resetToken);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.forgotError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t('auth.forgotTitle')}
      subtitle={t('auth.forgotSubtitle')}
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
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          className="h-11 rounded-xl border-border/80 bg-surface/80"
          {...register('email')}
        />

        <Button type="submit" size="lg" fullWidth isLoading={loading} className="h-12 rounded-xl">
          {t('auth.sendResetLink')}
        </Button>
      </form>

      {devToken && (
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium text-foreground">{t('auth.devTokenHint')}</p>
          <Link
            to={`/reset-password?token=${encodeURIComponent(devToken)}`}
            className="mt-2 inline-block break-all text-accent underline"
          >
            {t('auth.continueToReset')}
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
