import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { RootState } from '@/store';
import { logout } from '@/features/auth/authSlice';
import { authApi } from '@/features/auth/authApi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((s: RootState) => s.auth);

  const handleLogout = async () => {
    try {
      if (accessToken) await authApi.logout(accessToken);
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      navigate('/');
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
          <div>
            <p className="text-xs text-muted-foreground">{t('auth.name')}</p>
            <p className="font-medium">{user.name}</p>
          </div>
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

      {String(user.role || '').toLowerCase() === 'admin' && (
        <Link to="/admin" className="mt-6 block">
          <Button className="w-full" fullWidth>
            {t('admin.nav.dashboard', { defaultValue: 'Admin Dashboard' })}
          </Button>
        </Link>
      )}

      <Button variant="outline" className="mt-4" fullWidth onClick={handleLogout}>
        {t('auth.logout')}
      </Button>
    </div>
  );
}
