import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { collectionsApi } from '@/services/apiClient';

/** SECTION 10 — Collections admin without alert() */
export function AdminCollectionsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameAr: '', slug: '', featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await collectionsApi.list({ limit: 100 });
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
      const body = {
        name: { en: form.nameEn, ar: form.nameAr },
        slug: form.slug || undefined,
        featured: form.featured,
      };
      if (editingId) await collectionsApi.update(editingId, body);
      else await collectionsApi.create(body);
      setForm({ nameEn: '', nameAr: '', slug: '', featured: false });
      setEditingId(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete collection?')) return;
    setFormError(null);
    try {
      await collectionsApi.remove(id);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Collections</h2>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Name EN"
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          required
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Name AR"
          value={form.nameAr}
          onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
          required
        />
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <Button type="submit" disabled={saving}>
          {editingId ? 'Update' : 'Create'}
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
          title="No collections"
          description="Create a collection for the shop home."
        />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">Slug</th>
                <th className="px-4 py-3 text-start">Featured</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="px-4 py-3">{c.name?.en}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3">{c.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(c._id);
                        setForm({
                          nameEn: c.name?.en || '',
                          nameAr: c.name?.ar || '',
                          slug: c.slug || '',
                          featured: Boolean(c.featured),
                        });
                      }}
                    >
                      Edit
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
