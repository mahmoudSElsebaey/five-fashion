import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { RootState } from '@/store';
import { logout, updateUser } from '@/features/auth/authSlice';
import { authApi } from '@/features/auth/authApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((s: RootState) => s.auth);

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  const handleLogout = async () => {
    try {
      if (accessToken) await authApi.logout(accessToken);
    } catch {
      // ignore network errors on logout
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  const handleSaveName = async () => {
    if (!accessToken || !name.trim()) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await authApi.updateProfile(accessToken, { name: name.trim() });
      const updatedName =
        (res.data as { name?: string } | undefined)?.name ||
        (res.data as { user?: { name?: string } } | undefined)?.user?.name ||
        name.trim();
      dispatch(updateUser({ name: updatedName }));
      setMessage(t('auth.profileUpdated'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.profileUpdateError'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('auth.profile')}
      </h1>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-medium">{t('auth.accountInfo')}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success" role="status">
              {message}
            </div>
          )}

          <Input
            label={t('auth.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <Button type="button" size="sm" isLoading={saving} onClick={handleSaveName}>
            {t('auth.saveProfile')}
          </Button>

          <div>
            <p className="text-xs text-muted-foreground">{t('auth.email')}</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('auth.role')}</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        <Link to="/orders">
          <Button variant="outline" fullWidth>
            {t('auth.myOrders')}
          </Button>
        </Link>

        {isAdmin && (
          <Link to="/admin">
            <Button fullWidth>
              {t('admin.nav.dashboard', { defaultValue: 'Admin Dashboard' })}
            </Button>
          </Link>
        )}

        <Button variant="outline" fullWidth onClick={handleLogout}>
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
}
