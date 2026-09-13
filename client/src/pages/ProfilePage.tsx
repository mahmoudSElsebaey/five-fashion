import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { RootState } from '@/store';
import { logout, updateUser } from '@/features/auth/authSlice';
import { authApi } from '@/features/auth/authApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardContainer, CardBody, CardItem } from '@/components/ui/ThreeDCard';
import { Seo } from '@/components/seo/Seo';

type PanelId = 'account' | 'private' | 'options' | 'admin' | 'logout' | null;

function ProfilePanel({
  id,
  openId,
  onToggle,
  title,
  subtitle,
  accent,
  children,
}: {
  id: Exclude<PanelId, null>;
  openId: PanelId;
  onToggle: (id: Exclude<PanelId, null>) => void;
  title: string;
  subtitle?: string;
  accent?: boolean;
  children: ReactNode;
}) {
  const open = openId === id;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-shadow duration-300 ${
        open
          ? 'border-accent/50 shadow-[0_20px_50px_-20px_color-mix(in_srgb,var(--accent)_40%,transparent)]'
          : 'border-border/60 shadow-md'
      } ${
        accent ? 'bg-gradient-to-br from-accent/15 via-card to-card' : 'bg-card/90'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-start sm:px-5"
      >
        <div>
          <p className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {title}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          )}
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm transition-transform duration-300 ${
            open
              ? 'rotate-180 border-accent/50 bg-accent text-accent-foreground'
              : 'border-border bg-background/80 text-foreground'
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-4 pb-5 pt-3 sm:px-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((s: RootState) => s.auth);

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openPanel, setOpenPanel] = useState<PanelId>('account');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const togglePanel = (id: Exclude<PanelId, null>) => {
    setOpenPanel((prev) => (prev === id ? null : id));
    if (id !== 'logout') setLogoutConfirm(false);
  };

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
    <div className="relative mx-auto max-w-2xl px-3 py-10 sm:px-6 sm:py-16">
      <Seo title={t('auth.profile')} />

      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-lg opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)',
        }}
      />

      {/* 3D identity card */}
      <CardContainer className="w-full" containerClassName="w-full">
        <CardBody className="w-full">
          <div
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-surface px-5 py-8 sm:px-8 sm:py-10"
            style={{
              boxShadow:
                '0 24px 60px -24px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent)',
            }}
          >
            <CardItem translateZ={50} className="flex flex-col items-center text-center">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/40 bg-gradient-to-br from-accent/30 to-muted font-display text-2xl font-semibold text-foreground sm:h-28 sm:w-28 sm:text-3xl"
                style={{
                  boxShadow:
                    '0 16px 40px -12px color-mix(in srgb, var(--accent) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                {initials}
              </div>
              <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {user.name || t('auth.profile')}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-3 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                {user.role}
              </span>
            </CardItem>

            <CardItem translateZ={30} className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/orders"
                className="rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:text-accent"
              >
                {t('auth.myOrders')}
              </Link>
              <Link
                to="/wishlist"
                className="rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:text-accent"
              >
                {t('nav.wishlist', { defaultValue: 'Wishlist' })}
              </Link>
              <Link
                to="/shop"
                className="rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:text-accent"
              >
                {t('nav.shop')}
              </Link>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {/* Controllable 3D panels */}
      <div className="mt-8 space-y-3" style={{ perspective: '1200px' }}>
        <ProfilePanel
          id="account"
          openId={openPanel}
          onToggle={togglePanel}
          title={t('auth.accountInfo')}
          subtitle={t('auth.profileEditHint', {
            defaultValue: 'Update your display name and view account details',
          })}
        >
          {error && (
            <div
              className="mb-3 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
              role="alert"
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className="mb-3 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
              role="status"
            >
              {message}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label={t('auth.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-background/50 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t('auth.email')}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium">{user.email}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/50 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t('auth.role')}
                </p>
                <p className="mt-0.5 text-sm font-medium capitalize">{user.role}</p>
              </div>
            </div>
            <Button type="button" size="sm" isLoading={saving} onClick={handleSaveName}>
              {t('auth.saveProfile')}
            </Button>
          </div>
        </ProfilePanel>

        <ProfilePanel
          id="private"
          openId={openPanel}
          onToggle={togglePanel}
          title={t('auth.privateBox', { defaultValue: 'Private box' })}
          subtitle={t('auth.privateBoxHint', {
            defaultValue: 'Sensitive preferences — open only when you need them',
          })}
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
              <span>{t('auth.emailVisible', { defaultValue: 'Email on this device' })}</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
              <span>{t('auth.session', { defaultValue: 'Session' })}</span>
              <span className="font-medium text-success">
                {t('auth.sessionActive', { defaultValue: 'Active' })}
              </span>
            </li>
            <li className="rounded-xl border border-border/50 bg-background/40 px-3 py-2.5 leading-relaxed">
              {t('auth.privateNote', {
                defaultValue:
                  'Your tokens stay on this device. Closing this panel hides private details from the screen.',
              })}
            </li>
          </ul>
          <button
            type="button"
            className="mt-3 text-xs font-medium text-accent underline-offset-2 hover:underline"
            onClick={() => setOpenPanel(null)}
          >
            {t('auth.closePrivate', { defaultValue: 'Close private box' })}
          </button>
        </ProfilePanel>

        <ProfilePanel
          id="options"
          openId={openPanel}
          onToggle={togglePanel}
          title={t('auth.profileOptions', { defaultValue: 'Profile options' })}
          subtitle={t('auth.profileOptionsHint', {
            defaultValue: 'Orders, wishlist, and shopping shortcuts',
          })}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              to="/orders"
              className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              {t('auth.myOrders')}
            </Link>
            <Link
              to="/wishlist"
              className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              {t('nav.wishlist', { defaultValue: 'Wishlist' })}
            </Link>
            <Link
              to="/cart"
              className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              {t('nav.cart', { defaultValue: 'Cart' })}
            </Link>
            <Link
              to="/shop"
              className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              {t('nav.shop')}
            </Link>
          </div>
        </ProfilePanel>

        {isAdmin && (
          <ProfilePanel
            id="admin"
            openId={openPanel}
            onToggle={togglePanel}
            title={t('admin.nav.dashboard', { defaultValue: 'Admin Dashboard' })}
            subtitle={t('auth.adminHint', {
              defaultValue: 'Manage products, orders, and store settings',
            })}
            accent
          >
            <p className="mb-3 text-sm text-muted-foreground">
              {t('auth.adminBody', {
                defaultValue: 'You have admin access. Open the control panel to manage the store.',
              })}
            </p>
            <Link to="/admin">
              <Button fullWidth>
                {t('admin.nav.dashboard', { defaultValue: 'Open dashboard' })}
              </Button>
            </Link>
          </ProfilePanel>
        )}

        <ProfilePanel
          id="logout"
          openId={openPanel}
          onToggle={togglePanel}
          title={t('auth.logout')}
          subtitle={t('auth.logoutHint', {
            defaultValue: 'End your session on this device',
          })}
        >
          {!logoutConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('auth.logoutConfirmAsk', {
                  defaultValue: 'Are you sure you want to sign out?',
                })}
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setLogoutConfirm(true)}
                className="border-error/40 text-error hover:bg-error/10"
              >
                {t('auth.logout')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-error">
                {t('auth.logoutConfirmFinal', {
                  defaultValue: 'Confirm sign out — you can always sign in again.',
                })}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button fullWidth onClick={handleLogout} className="bg-error hover:opacity-90">
                  {t('auth.logoutConfirm', { defaultValue: 'Yes, sign out' })}
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setLogoutConfirm(false);
                    setOpenPanel(null);
                  }}
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </Button>
              </div>
            </div>
          )}
        </ProfilePanel>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        {t('auth.panelHint', {
          defaultValue: 'Tap any section to open or close it. Only one panel stays open at a time.',
        })}
      </p>
    </div>
  );
}
