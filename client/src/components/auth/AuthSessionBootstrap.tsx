import { useEffect, useState, type ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { bootstrapSession, getAccessToken, getRefreshToken } from '@/features/auth/session';

/**
 * Validates / refreshes the persisted session once on app mount
 * so admin data and protected routes use a live token.
 */
export function AuthSessionBootstrap({ children }: { children: ReactNode }) {
  const needsCheck = Boolean(getAccessToken() || getRefreshToken());
  const [ready, setReady] = useState(!needsCheck);

  useEffect(() => {
    if (!needsCheck) return;
    let cancelled = false;
    void bootstrapSession().finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [needsCheck]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
