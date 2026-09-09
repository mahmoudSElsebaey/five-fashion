import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrders } from '@/features/orders/ordersSlice';
import { mockProducts } from '@/data/mockProducts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function DashboardPage() {
  const { t } = useTranslation();
  const orders = useSelector(selectOrders);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const productCount = mockProducts.length;
  const orderCount = orders.length;
  const avgOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

  const stats = [
    { key: 'products', value: productCount },
    { key: 'orders', value: orderCount },
    { key: 'revenue', value: `$${totalRevenue.toFixed(0)}` },
    { key: 'avgOrder', value: `$${avgOrder.toFixed(0)}` },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {t('admin.dashboard.title')}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('admin.dashboard.subtitle')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="pb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t(`admin.dashboard.${stat.key}`)}
              </p>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-sm font-semibold tracking-wide">
          {t('admin.dashboard.recentOrders')}
        </h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('admin.dashboard.noOrders')}</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-start">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('checkout.orderId')}</th>
                  <th className="px-4 py-3 font-medium">{t('checkout.total')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.orders.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.orders.date')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3">${o.total.toFixed(0)}</td>
                    <td className="px-4 py-3 capitalize">{t(`checkout.status.${o.status}`)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
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
