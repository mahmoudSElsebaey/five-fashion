import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { usersApi } from '@/services/apiClient';

export function AdminCustomersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({ page, limit: 20, q: q || undefined });
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
  }, [page, q]);

  const toggleActive = async (u: any) => {
    try {
      await usersApi.update(u._id, { isActive: !u.isActive });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Customers</h2>
      <input
        className="mt-4 w-full max-w-sm rounded-lg border border-border px-3 py-2 text-sm"
        placeholder="Search name or email"
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <p className="mt-4 text-sm text-error">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">Email</th>
                <th className="px-4 py-3 text-start">Role</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3 text-end">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(u)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} · {total}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page * 20 >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
