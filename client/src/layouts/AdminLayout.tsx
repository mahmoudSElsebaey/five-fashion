import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useState } from 'react';

export function AdminLayout() {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (String(user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className={`fixed inset-y-0 z-40 w-56 transform transition-transform lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
      }`}>
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
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-sm lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            Menu
          </button>
          <h1 className="text-sm font-medium text-muted-foreground">FIVE Fashion · Admin</h1>
          <span className="truncate text-sm text-muted-foreground">{user?.email}</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
