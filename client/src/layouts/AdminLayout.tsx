import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useState } from 'react';

export function AdminLayout() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (String(user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className={`fixed inset-y-0 start-0 z-40 w-56 transform transition-transform duration-normal ease-five rtl:start-auto rtl:end-0 lg:translate-x-0 ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full rtl:translate-x-full'
        }`}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex min-h-screen min-w-0 flex-col lg:ms-56 rtl:lg:ms-0 rtl:lg:me-56">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-sm lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open admin menu"
          >
            Menu
          </button>
          <h1 className="text-sm font-medium text-muted-foreground">
            FIVE Fashion · {t('admin.dashboard.title', { defaultValue: 'Admin' })}
          </h1>
          <span className="truncate text-sm text-muted-foreground">{user?.email}</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
