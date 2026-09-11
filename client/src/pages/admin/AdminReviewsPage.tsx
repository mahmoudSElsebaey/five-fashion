import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { reviewsApi } from '@/services/apiClient';

export function AdminReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.adminList({ limit: 50, status: status || undefined });
      setRows((res.data as any[]) || []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [status]);

  const moderate = async (id: string, next: string) => {
    await reviewsApi.moderate(id, next);
    await load();
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Reviews</h2>
      <select
        className="mt-4 rounded-lg border border-border px-3 py-2 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select>
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <p className="mt-4 text-sm text-error">{error}</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No reviews</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r._id} className="rounded-xl border border-border p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{r.title || `${r.rating}/5`}</p>
                  <p className="text-muted-foreground">
                    {r.user?.email} · {r.product?.name?.en || r.product?.slug}
                  </p>
                  <p className="mt-2">{r.comment}</p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">Status: {r.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => moderate(r._id, 'approved')}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => moderate(r._id, 'rejected')}>
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (confirm('Delete?')) {
                        await reviewsApi.adminDelete(r._id);
                        await load();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
