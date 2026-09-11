import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ordersApi } from '@/services/apiClient';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const [params] = useSearchParams();
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.adminList({ limit: 20, page, status: status || undefined });
      setRows((res.data as any[]) || []);
      setTotal(res.meta?.total ?? 0);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status]);

  useEffect(() => {
    const id = params.get('id');
    if (!id) return;
    ordersApi.adminGet(id).then((r) => setSelected(r.data)).catch(() => undefined);
  }, [params]);

  const openOrder = async (id: string) => {
    try {
      const r = await ordersApi.adminGet(id);
      setSelected(r.data);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
  };

  const updateStatus = async (next: string) => {
    if (!selected?._id) return;
    setUpdating(true);
    try {
      const r = await ordersApi.adminUpdate(selected._id, { status: next });
      setSelected(r.data);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Orders</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className="rounded-lg border border-border px-3 py-2 text-sm" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : error ? (
        <p className="mt-4 text-sm text-error">{error}</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start">Order</th>
                <th className="px-4 py-3 text-start">Customer</th>
                <th className="px-4 py-3 text-start">Total</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Payment</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.user?.email || o.customerEmail || '—'}</td>
                  <td className="px-4 py-3">${Number(o.total || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                  <td className="px-4 py-3 capitalize">{o.paymentStatus}</td>
                  <td className="px-4 py-3 text-end">
                    <Button size="sm" variant="ghost" onClick={() => openOrder(o._id)}>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
        <span className="text-sm text-muted-foreground">Page {page} · {total} total</span>
        <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold">{selected.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">{selected.user?.email || selected.customerEmail}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p>Status: <strong className="capitalize">{selected.status}</strong></p>
              <p>Payment: <strong className="capitalize">{selected.paymentStatus}</strong></p>
              <p>Subtotal: ${Number(selected.subtotal || 0).toFixed(2)}</p>
              <p>Discount: ${Number(selected.discount || 0).toFixed(2)}</p>
              <p>Shipping: ${Number(selected.shippingCost || 0).toFixed(2)}</p>
              <p>Total: <strong>${Number(selected.total || 0).toFixed(2)}</strong></p>
            </div>
            {selected.shippingAddress && (
              <div className="mt-4 rounded-lg border border-border p-3 text-sm">
                <p className="font-medium">Shipping</p>
                <p>{selected.shippingAddress.fullName} · {selected.shippingAddress.phone}</p>
                <p className="text-muted-foreground">{selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.country}</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm font-medium">Items</p>
              <ul className="mt-2 space-y-2 text-sm">
                {(selected.items || []).map((it: any, i: number) => (
                  <li key={i} className="flex justify-between border-b border-border py-2">
                    <span>{it.nameEn} × {it.quantity} {it.size ? `(${it.size})` : ''}</span>
                    <span>${Number(it.unitPrice * it.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <Button key={s} size="sm" variant={selected.status === s ? 'primary' : 'outline'} disabled={updating} onClick={() => updateStatus(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
