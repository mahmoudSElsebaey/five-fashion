import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrders } from '@/features/orders/ordersSlice';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { productsApi } from '@/services/apiClient';

export function DashboardPage() {
  const { t } = useTranslation();
  const orders = useSelector(selectOrders);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    productsApi
      .list({ limit: 1 })
      .then((r) => setProductCount(r.meta?.total ?? 0))
      .catch(() => setProductCount(0));
  }, []);

  const stats = [
    { key: 'products', value: productCount },
    { key: 'orders', value: orders.length },
    { key: 'revenue', value: `$${totalRevenue.toFixed(0)}` },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {t('admin.dashboard.title')}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('admin.dashboard.subtitle')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.key}>
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">
                {t(`admin.dashboard.${s.key}`)}
              </p>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
