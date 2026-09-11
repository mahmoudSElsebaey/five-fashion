import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { productsApi, ordersApi, usersApi } from '@/services/apiClient';

type Stats = { products: number; orders: number; customers: number; revenue: number; pending: number; lowStock: number };
type RecentOrder = { _id: string; orderNumber?: string; total?: number; status?: string; customerEmail?: string; user?: { email?: string } };

const statusAr: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
};

const dashboardLabels: Record<string, string> = {
  products: 'المنتجات',
  orders: 'الطلبات',
  customers: 'العملاء',
  revenue: 'الإيرادات',
  pending: 'طلبات معلقة',
  lowStock: 'مخزون منخفض',
};

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const text = (en: string, ar: string) => (isAr ? ar : en);
  const statusLabel = (status?: string) => (isAr ? statusAr[status || ''] || status || '—' : status || '—');
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prod, orders, users, low, pendingRes] = await Promise.all([
        productsApi.list({ limit: 1, status: 'all' }),
        ordersApi.adminList({ limit: 8 }),
        usersApi.list({ limit: 1 }),
        productsApi.list({ limit: 50, status: 'active' }),
        ordersApi.adminList({ limit: 1, status: 'pending' }),
      ]);

      const orderItems = (orders.data as RecentOrder[]) || [];
      const products = (low.data as { stock?: number }[]) || [];
      const revenue = orderItems.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
      const pending = pendingRes.meta?.total ?? orderItems.filter((order) => order.status === 'pending').length;
      const lowStock = products.filter((product) => (product.stock ?? 0) < 10).length;

      setStats({
        products: prod.meta?.total ?? 0,
        orders: orders.meta?.total ?? orderItems.length,
        customers: users.meta?.total ?? 0,
        revenue,
        pending,
        lowStock,
      });
      setRecentOrders(orderItems.slice(0, 6));
    } catch (e) {
      setError(e instanceof Error ? e.message : text('Failed to load dashboard', 'تعذر تحميل لوحة التحكم'));
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  if (loading) {
    return <div className="flex justify-center py-20" role="status"><Spinner size="lg" /></div>;
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  const cards = [
    { key: 'products', value: stats?.products ?? 0, to: '/admin/products' },
    { key: 'orders', value: stats?.orders ?? 0, to: '/admin/orders' },
    { key: 'customers', value: stats?.customers ?? 0, to: '/admin/customers' },
    { key: 'revenue', value: `$${(stats?.revenue ?? 0).toFixed(0)}`, to: '/admin/orders' },
    { key: 'pending', value: stats?.pending ?? 0, to: '/admin/orders' },
    { key: 'lowStock', value: stats?.lowStock ?? 0, to: '/admin/products' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {t('admin.dashboard.title', { defaultValue: text('Dashboard', 'لوحة التحكم') })}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('admin.dashboard.subtitle', { defaultValue: text('Overview of your store performance.', 'نظرة عامة على أداء متجرك.') })}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.key} to={card.to}>
            <Card className="transition-colors hover:border-foreground/30">
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">
                  {t(`admin.dashboard.${card.key}`, {
                    defaultValue: isAr ? dashboardLabels[card.key] : card.key,
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-semibold">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
          {t('admin.dashboard.recentOrders', { defaultValue: text('Recent orders', 'أحدث الطلبات') })}
        </h3>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t('admin.dashboard.noOrders', { defaultValue: text('No orders yet', 'لا توجد طلبات حتى الآن') })}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-start text-sm">
              <thead className="border-b border-border bg-surface text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{text('Order', 'رقم الطلب')}</th>
                  <th className="px-4 py-3 font-medium">{text('Customer', 'العميل')}</th>
                  <th className="px-4 py-3 font-medium">{text('Total', 'الإجمالي')}</th>
                  <th className="px-4 py-3 font-medium">{text('Status', 'الحالة')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link className="hover:underline" to={`/admin/orders?id=${order._id}`}>
                        {order.orderNumber || order._id?.slice(-6)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.user?.email || order.customerEmail || '—'}
                    </td>
                    <td className="px-4 py-3">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{statusLabel(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
