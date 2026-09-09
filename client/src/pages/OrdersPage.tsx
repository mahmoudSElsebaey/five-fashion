import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrders } from '@/features/orders/ordersSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function OrdersPage() {
  const { t, i18n } = useTranslation();
  const orders = useSelector(selectOrders);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t('checkout.myOrders')}</h1>
      {orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-muted-foreground">{t('checkout.noOrders')}</p>
          <Link to="/shop" className="mt-6"><Button variant="outline">{t('cart.continueShopping')}</Button></Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-surface-hover">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-medium">{order.id}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Badge variant={order.status === 'confirmed' ? 'success' : order.status === 'cancelled' ? 'error' : 'default'}>
                  {t(`checkout.status.${order.status}`)}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{order.items.length} {t('checkout.items')} · ${order.total.toFixed(0)}</span>
                <Link to={`/order-confirmation/${order.id}`} className="font-medium text-foreground hover:underline">{t('checkout.viewDetails')}</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
