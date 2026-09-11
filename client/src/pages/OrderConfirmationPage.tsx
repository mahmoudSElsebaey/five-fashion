import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrderById } from '@/features/orders/ordersSlice';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ordersApi } from '@/services/apiClient';
import { Seo } from '@/components/seo/Seo';

type DisplayOrder = {
  id: string;
  total: number;
  items: Array<{
    nameEn?: string;
    nameAr?: string;
    quantity: number;
    price?: number;
    salePrice?: number;
  }>;
};

/** SECTION 07 — Confirmation from local slice or API */
export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const local = useSelector(selectOrderById(id || ''));
  const isAr = i18n.language === 'ar';
  const [remote, setRemote] = useState<DisplayOrder | null>(null);
  const [loading, setLoading] = useState(!local && Boolean(id));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (local || !id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let res;
        try {
          res = await ordersApi.getById(id);
        } catch {
          res = await ordersApi.getByNumber(id);
        }
        if (cancelled) return;
        const data = res?.data as {
          _id?: string;
          orderNumber?: string;
          total?: number;
          items?: Array<{
            name?: { en?: string; ar?: string };
            quantity?: number;
            price?: number;
          }>;
        };
        if (data) {
          setRemote({
            id: data.orderNumber || data._id || id,
            total: data.total ?? 0,
            items: (data.items || []).map((it) => ({
              nameEn: it.name?.en,
              nameAr: it.name?.ar,
              quantity: it.quantity ?? 1,
              price: it.price,
            })),
          });
        } else {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, local]);

  const order: DisplayOrder | null = local
    ? {
        id: local.id,
        total: local.total,
        items: local.items,
      }
    : remote;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState
          title={t('checkout.orderNotFound')}
          description={
            failed
              ? t('checkout.orderNotFoundDesc', {
                  defaultValue: 'We could not find this order. Check My Orders if you are signed in.',
                })
              : undefined
          }
          actionLabel={t('cart.continueShopping')}
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <Seo title="Order confirmed" />
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
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
              <span className="line-clamp-1 text-muted-foreground">
                {(isAr ? item.nameAr : item.nameEn) || 'Item'} × {item.quantity}
              </span>
              {item.price != null && (
                <span>${(((item.salePrice ?? item.price) as number) * item.quantity).toFixed(0)}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>{t('checkout.total')}</span>
          <span>${order.total.toFixed(0)}</span>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/orders">
          <Button variant="outline">{t('checkout.viewOrders')}</Button>
        </Link>
        <Link to="/shop">
          <Button>{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    </div>
  );
}
