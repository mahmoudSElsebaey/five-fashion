import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { couponsApi } from '@/services/apiClient';

/** SECTION 10 — Coupons admin without alert() */
export function AdminCouponsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minimumOrderAmount: '',
    usageLimit: '',
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await couponsApi.adminList({ limit: 100 });
      setRows((res.data as any[]) || []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await couponsApi.create({
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minimumOrderAmount: form.minimumOrderAmount ? Number(form.minimumOrderAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
      });
      setForm({
        code: '',
        discountType: 'percentage',
        discountValue: '10',
        minimumOrderAmount: '',
        usageLimit: '',
        isActive: true,
      });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete coupon?')) return;
    setFormError(null);
    try {
      await couponsApi.remove(id);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const toggleActive = async (c: any) => {
    setFormError(null);
    try {
      await couponsApi.update(c._id, { isActive: !c.isActive });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Coupons</h2>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="CODE"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
        >
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Value"
          type="number"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          required
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Min order"
          type="number"
          value={form.minimumOrderAmount}
          onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })}
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Usage limit"
          type="number"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
        />
        <Button type="submit" disabled={saving}>
          Create
        </Button>
      </form>
      {formError && (
        <p className="mt-3 text-sm text-error" role="alert">
          {formError}
        </p>
      )}
      {loading ? (
        <div className="flex justify-center py-12" role="status">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState className="mt-4" message={error} onRetry={() => void load()} />
      ) : rows.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No coupons"
          description="Create WELCOME15 or seasonal codes here."
        />
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
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.discountType}</td>
                  <td className="px-4 py-3">{c.discountValue}</td>
                  <td className="px-4 py-3">
                    {c.usedCount ?? 0}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-end space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => void toggleActive(c)}>
                      {c.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void onDelete(c._id)}>
                      Delete
                    </Button>
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
