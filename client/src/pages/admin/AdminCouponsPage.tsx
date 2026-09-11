import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { couponsApi } from '@/services/apiClient';

export function AdminCouponsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minimumOrderAmount: '0',
    usageLimit: '100',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await couponsApi.adminList({ limit: 50 });
      setRows((res.data as any[]) || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponsApi.create({
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minimumOrderAmount: Number(form.minimumOrderAmount) || undefined,
        usageLimit: Number(form.usageLimit) || undefined,
        isActive: form.isActive,
      });
      setForm({ ...form, code: '' });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Coupons</h2>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <select className="rounded-lg border border-border px-3 py-2 text-sm" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Min order" value={form.minimumOrderAmount} onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })} />
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Usage limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
        <Button type="submit" disabled={saving}>Create</Button>
      </form>
      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start">Code</th>
                <th className="px-4 py-3 text-start">Type</th>
                <th className="px-4 py-3 text-start">Value</th>
                <th className="px-4 py-3 text-start">Used</th>
                <th className="px-4 py-3 text-start">Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.discountType}</td>
                  <td className="px-4 py-3">{c.discountValue}</td>
                  <td className="px-4 py-3">{c.usedCount}/{c.usageLimit ?? '∞'}</td>
                  <td className="px-4 py-3">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-end space-x-2">
                    <Button size="sm" variant="ghost" onClick={async () => { await couponsApi.update(c._id, { isActive: !c.isActive }); await load(); }}>Toggle</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { if (confirm('Delete?')) { await couponsApi.remove(c._id); await load(); } }}>Delete</Button>
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
