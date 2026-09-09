import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrderById } from '@/features/orders/ordersSlice';
import { Button } from '@/components/ui/Button';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const order = useSelector(selectOrderById(id || ''));
  const isAr = i18n.language === 'ar';

  if (!order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">{t('checkout.orderNotFound')}</h1>
        <Link to="/shop" className="mt-6"><Button variant="outline">{t('cart.continueShopping')}</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t('checkout.thankYou')}</h1>
      <p className="mt-3 text-muted-foreground">{t('checkout.orderConfirmed')}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-start">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{t('checkout.orderId')}</p>
          <p className="font-mono text-sm font-medium">{order.id}</p>
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-3">
              <span className="text-muted-foreground line-clamp-1">{isAr ? item.nameAr : item.nameEn} × {item.quantity}</span>
              <span>${((item.salePrice ?? item.price) * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>{t('checkout.total')}</span>
          <span>${order.total.toFixed(0)}</span>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/orders"><Button variant="outline">{t('checkout.viewOrders')}</Button></Link>
        <Link to="/shop"><Button>{t('cart.continueShopping')}</Button></Link>
      </div>
    </div>
  );
}
