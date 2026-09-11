import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { collectionsApi } from '@/services/apiClient';

export function AdminCollectionsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nameEn: '', nameAr: '', slug: '', featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await collectionsApi.list({ limit: 100 });
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
      const body = { name: { en: form.nameEn, ar: form.nameAr }, slug: form.slug || undefined, featured: form.featured };
      if (editingId) await collectionsApi.update(editingId, body);
      else await collectionsApi.create(body);
      setForm({ nameEn: '', nameAr: '', slug: '', featured: false });
      setEditingId(null);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Collections</h2>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Name EN" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Name AR" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
        <input className="rounded-lg border border-border px-3 py-2 text-sm" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <Button type="submit" disabled={saving}>{editingId ? 'Update' : 'Create'}</Button>
      </form>
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
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
                    <Button size="sm" variant="ghost" onClick={() => { setEditingId(c._id); setForm({ nameEn: c.name?.en || '', nameAr: c.name?.ar || '', slug: c.slug || '', featured: !!c.featured }); }}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { if (confirm('Delete?')) { await collectionsApi.remove(c._id); await load(); } }}>Delete</Button>
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
