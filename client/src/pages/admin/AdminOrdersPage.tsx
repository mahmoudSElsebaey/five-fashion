import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ordersApi } from '@/services/apiClient';
import { useTranslation } from 'react-i18next';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusAr: Record<string, string> = { pending: 'قيد الانتظار', confirmed: 'مؤكد', processing: 'قيد التجهيز', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' };
const paymentAr: Record<string, string> = { pending: 'قيد الانتظار', paid: 'مدفوع', failed: 'فشل', refunded: 'مسترد', cancelled: 'ملغي' };

type AdminOrder = {
  _id: string; orderNumber?: string; total?: number; subtotal?: number; discount?: number; shippingCost?: number;
  status?: string; paymentStatus?: string; customerEmail?: string; user?: { email?: string };
  shippingAddress?: { fullName?: string; phone?: string; street?: string; city?: string; country?: string };
  items?: Array<{ nameEn?: string; nameAr?: string; quantity?: number; size?: string; unitPrice?: number }>;
};

export function AdminOrdersPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const text = (en: string, ar: string) => (isAr ? ar : en);
  const statusLabel = (s?: string) => (isAr ? statusAr[s || ''] || s || '—' : s || '—');
  const paymentLabel = (s?: string) => (isAr ? paymentAr[s || ''] || s || '—' : s || '—');
  const [params] = useSearchParams();
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersApi.adminList({ limit: 20, page, status: status || undefined });
      setRows((res.data as AdminOrder[]) || []); setTotal(res.meta?.total ?? 0); setError(null);
    } catch (e) { setError(e instanceof Error ? e.message : text('Failed to load orders', 'تعذر تحميل الطلبات')); }
    finally { setLoading(false); }
  }, [page, status, isAr]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const id = params.get('id'); if (!id) return;
    ordersApi.adminGet(id).then(r => setSelected(r.data as AdminOrder)).catch(() => undefined);
  }, [params]);
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSelected(null); setActionError(null); } };
    document.addEventListener('keydown', onKey); const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [selected]);

  const openOrder = async (id: string) => {
    setActionError(null);
    try { const r = await ordersApi.adminGet(id); setSelected(r.data as AdminOrder); }
    catch (e) { setActionError(e instanceof Error ? e.message : text('Failed to open order', 'تعذر فتح الطلب')); }
  };
  const updateStatus = async (next: string) => {
    if (!selected?._id) return;
    setUpdating(true); setActionError(null);
    try { const r = await ordersApi.adminUpdate(selected._id, { status: next }); setSelected(r.data as AdminOrder); await load(); }
    catch (e) { setActionError(e instanceof Error ? e.message : text('Update failed', 'فشل تحديث حالة الطلب')); }
    finally { setUpdating(false); }
  };
  const close = () => { setSelected(null); setActionError(null); };

  return (
    <div>
      <div><h2 className="font-display text-2xl font-semibold">{text('Orders', 'الطلبات')}</h2><p className="mt-1 text-sm text-muted-foreground">{text('Manage customer orders and update their status.', 'إدارة طلبات العملاء وتحديث حالتها.')}</p></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={status} onChange={e => { setPage(1); setStatus(e.target.value); }} aria-label={text('Filter by status', 'تصفية حسب الحالة')}>
          <option value="">{text('All statuses', 'كل الحالات')}</option>{STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>
      {actionError && !selected && <p className="mt-3 text-sm text-error" role="alert">{actionError}</p>}
      {loading ? <div className="flex justify-center py-16" role="status"><Spinner /></div> : error ? <ErrorState className="mt-8" message={error} onRetry={() => void load()} /> : rows.length === 0 ? <EmptyState className="mt-8" title={text('No orders', 'لا توجد طلبات')} description={text('Orders will appear here when customers checkout.', 'ستظهر الطلبات هنا عند إتمام العملاء لعمليات الشراء.')} /> : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[760px] text-sm"><thead className="border-b bg-surface text-muted-foreground"><tr>
          <th className="px-4 py-3 text-start">{text('Order','رقم الطلب')}</th><th className="px-4 py-3 text-start">{text('Customer','العميل')}</th><th className="px-4 py-3 text-start">{text('Total','الإجمالي')}</th><th className="px-4 py-3 text-start">{text('Status','الحالة')}</th><th className="px-4 py-3 text-start">{text('Payment','الدفع')}</th><th />
        </tr></thead><tbody>{rows.map(o => <tr key={o._id} className="border-b last:border-0"><td className="px-4 py-3 font-medium">{o.orderNumber}</td><td className="px-4 py-3 text-muted-foreground">{o.user?.email || o.customerEmail || '—'}</td><td className="px-4 py-3">${Number(o.total || 0).toFixed(2)}</td><td className="px-4 py-3">{statusLabel(o.status)}</td><td className="px-4 py-3">{paymentLabel(o.paymentStatus)}</td><td className="px-4 py-3 text-end"><Button size="sm" variant="ghost" onClick={() => void openOrder(o._id)}>{text('Details','التفاصيل')}</Button></td></tr>)}</tbody></table></div>
      )}
      <div className="mt-4 flex items-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{text('Prev','السابق')}</Button><span className="text-sm text-muted-foreground">{text(`Page ${page} · ${total} total`, `صفحة ${page} · ${total} طلب`)}</span><Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>{text('Next','التالي')}</Button></div>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={selected.orderNumber || text('Order details','تفاصيل الطلب')}>
        <button type="button" className="absolute inset-0 cursor-default" aria-label={text('Close','إغلاق')} onClick={close} />
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6">
          <div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-xl font-semibold">{selected.orderNumber}</h3><p className="text-sm text-muted-foreground">{selected.user?.email || selected.customerEmail}</p></div><Button variant="outline" size="sm" onClick={close}>{text('Close','إغلاق')}</Button></div>
          {actionError && <p className="mt-3 text-sm text-error" role="alert">{actionError}</p>}
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>{text('Status','الحالة')}: <strong>{statusLabel(selected.status)}</strong></p><p>{text('Payment','الدفع')}: <strong>{paymentLabel(selected.paymentStatus)}</strong></p>
            <p>{text('Subtotal','الإجمالي الفرعي')}: ${Number(selected.subtotal || 0).toFixed(2)}</p><p>{text('Discount','الخصم')}: ${Number(selected.discount || 0).toFixed(2)}</p><p>{text('Shipping','الشحن')}: ${Number(selected.shippingCost || 0).toFixed(2)}</p><p>{text('Total','الإجمالي')}: <strong>${Number(selected.total || 0).toFixed(2)}</strong></p>
          </div>
          {selected.shippingAddress && <div className="mt-4 rounded-lg border border-border p-3 text-sm"><p className="font-medium">{text('Shipping address','عنوان الشحن')}</p><p>{selected.shippingAddress.fullName} · {selected.shippingAddress.phone}</p><p className="text-muted-foreground">{selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.country}</p></div>}
          <div className="mt-4"><p className="text-sm font-medium">{text('Order items','منتجات الطلب')}</p><ul className="mt-2 space-y-2 text-sm">{(selected.items || []).map((it, i) => <li key={i} className="flex justify-between gap-4 border-b border-border py-2"><span>{isAr ? (it.nameAr || it.nameEn) : it.nameEn} × {it.quantity} {it.size ? `(${it.size})` : ''}</span><span>${Number((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2)}</span></li>)}</ul></div>
          <div className="mt-6 flex flex-wrap gap-2">{STATUSES.map(s => <Button key={s} size="sm" variant={selected.status === s ? 'primary' : 'outline'} disabled={updating} onClick={() => void updateStatus(s)}>{statusLabel(s)}</Button>)}</div>
        </div>
      </div>}
    </div>
  );
}
