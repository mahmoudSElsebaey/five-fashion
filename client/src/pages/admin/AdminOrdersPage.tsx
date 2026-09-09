import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectOrders } from '@/features/orders/ordersSlice';
import { Badge } from '@/components/ui/Badge';

export function AdminOrdersPage() {
  const { t, i18n } = useTranslation();
  const orders = useSelector(selectOrders);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {t('admin.orders.title')}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('admin.orders.subtitle', { count: orders.length })}
      </p>

      {orders.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">{t('admin.dashboard.noOrders')}</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-start">
              <tr>
                <th className="px-4 py-3 font-medium">{t('checkout.orderId')}</th>
                <th className="px-4 py-3 font-medium">{t('auth.name')}</th>
                <th className="px-4 py-3 font-medium">{t('checkout.total')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.orders.status')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.orders.date')}</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">
                    <div>{o.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer.email}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">${o.total.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        o.status === 'confirmed'
                          ? 'success'
                          : o.status === 'cancelled'
                          ? 'error'
                          : 'default'
                      }
                    >
                      {t(`checkout.status.${o.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString(i18n.language)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      to={`/order-confirmation/${o.id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {t('checkout.viewDetails')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
