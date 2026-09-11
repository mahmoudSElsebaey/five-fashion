import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectOrders, type Order } from '@/features/orders/ordersSlice';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Seo } from '@/components/seo/Seo';
import { ordersApi } from '@/services/apiClient';
import type { RootState } from '@/store';

type ApiOrderItem = {
  product?: string;
  nameEn?: string;
  nameAr?: string;
  quantity?: number;
  unitPrice?: number;
  size?: string;
  color?: string;
  image?: string;
};

type ApiOrder = {
  _id?: string;
  orderNumber?: string;
  items?: ApiOrderItem[];
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  total?: number;
  status?: string;
  couponCode?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    street?: string;
    apartment?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  createdAt?: string;
};

function mapApiOrder(o: ApiOrder): Order {
  const id = o.orderNumber || o._id || 'unknown';
  const addr = o.shippingAddress || {};
  return {
    id: String(id),
    items: (o.items || []).map((it) => ({
      productId: String(it.product || ''),
      nameEn: it.nameEn || '',
      nameAr: it.nameAr || '',
      price: it.unitPrice ?? 0,
      quantity: it.quantity ?? 1,
      size: it.size,
      color: it.color,
    })),
    subtotal: o.subtotal ?? 0,
    shipping: o.shippingCost ?? 0,
    discount: o.discount ?? 0,
    total: o.total ?? 0,
    status: (o.status as Order['status']) || 'pending',
    customer: {
      name: addr.fullName || '',
      email: o.customerEmail || '',
      phone: o.customerPhone || addr.phone || '',
    },
    address: {
      line1: addr.street || '',
      line2: addr.apartment,
      city: addr.city || '',
      country: addr.country || '',
      postalCode: addr.postalCode || '',
    },
    shippingMethod: 'standard',
    couponCode: o.couponCode,
    createdAt: o.createdAt || new Date().toISOString(),
  };
}

function statusVariant(
  status: string
): 'success' | 'error' | 'default' | 'accent' {
  if (status === 'confirmed' || status === 'delivered') return 'success';
  if (status === 'cancelled') return 'error';
  if (status === 'shipped' || status === 'processing') return 'accent';
  return 'default';
}

/** SECTION 08 — Customer orders from real API + local merge for confirmation UX */
export function OrdersPage() {
  const { t, i18n } = useTranslation();
  const localOrders = useSelector(selectOrders);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        setOrders(localOrders);
        return;
      }
      const res = await ordersApi.list({ page: 1, limit: 50 });
      const list = ((res.data || []) as ApiOrder[]).map(mapApiOrder);
      const apiIds = new Set(list.map((o) => o.id));
      const extras = localOrders.filter((o) => !apiIds.has(o.id));
      setOrders([...list, ...extras]);
    } catch (e) {
      setOrders(localOrders);
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, localOrders]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo title="My Orders" description="Your FIVE Fashion order history." />
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('checkout.myOrders')}
      </h1>

      {loading ? (
        <div className="flex justify-center py-24" role="status">
          <Spinner size="lg" />
        </div>
      ) : error && orders.length === 0 ? (
        <ErrorState
          className="mt-12"
          message={error}
          retryLabel={t('shop.filters.reset', { defaultValue: 'Try again' })}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          className="mt-12"
          title={t('checkout.noOrders')}
          description={t('checkout.noOrdersDesc', {
            defaultValue: 'Orders you place will appear here.',
          })}
          actionLabel={t('cart.continueShopping')}
          actionTo="/shop"
        />
      ) : (
        <>
          {error && (
            <p className="mt-4 text-xs text-muted-foreground" role="status">
              {error} — {t('checkout.showingCached', { defaultValue: 'showing saved orders' })}
            </p>
          )}
          <ul className="mt-10 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-surface-hover"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-medium">{order.id}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(i18n.language, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant={statusVariant(order.status)}>
                    {t(`checkout.status.${order.status}`, {
                      defaultValue: order.status,
                    })}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {order.items.length} {t('checkout.items')} · ${order.total.toFixed(0)}
                  </span>
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {t('checkout.viewDetails')}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
