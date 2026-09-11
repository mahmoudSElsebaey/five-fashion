import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t('auth.forgotTitle')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('auth.forgotSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success" role="status">
            {success}
          </div>
        )}

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" size="lg" fullWidth isLoading={loading}>
          {t('auth.sendResetLink')}
        </Button>
      </form>

      {devToken && (
        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium text-foreground">{t('auth.devTokenHint')}</p>
          <Link
            to={`/reset-password?token=${encodeURIComponent(devToken)}`}
            className="mt-2 inline-block break-all text-accent underline"
          >
            {t('auth.continueToReset')}
          </Link>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-foreground hover:underline">
          {t('auth.backToLogin')}
        </Link>
      </p>
    </div>
  );
}
