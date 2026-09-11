import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { productsApi, categoriesApi, collectionsApi } from '@/services/apiClient';

type ProductRow = {
  _id: string;
  name?: { en?: string; ar?: string };
  slug?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  status?: string;
  gender?: string;
  featured?: boolean;
  newArrival?: boolean;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  category?: any;
  collectionRef?: any;
  brand?: string;
};

const emptyForm = {
  nameEn: '',
  nameAr: '',
  slug: '',
  sku: '',
  price: '',
  compareAtPrice: '',
  stock: '0',
  gender: 'unisex',
  category: '',
  collection: '',
  status: 'active',
  sizes: 'S,M,L',
  colors: 'Black,Ivory',
  images: '',
  featured: false,
  newArrival: false,
  brand: 'FIVE',
};

/** SECTION 10 — Products admin: Empty/Error, actionError instead of alert */
export function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [cols, setCols] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.list({ limit: 20, page, status: 'all', q: q || undefined });
      setRows((res.data as ProductRow[]) || []);
      setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    Promise.all([categoriesApi.list({ limit: 100 }), collectionsApi.list({ limit: 100 })])
      .then(([c, col]) => {
        setCats((c.data as any[]) || []);
        setCols((col.data as any[]) || []);
      })
      .catch(() => undefined);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditingId(p._id);
    setForm({
      nameEn: p.name?.en || '',
      nameAr: p.name?.ar || '',
      slug: p.slug || '',
      sku: p.sku || '',
      price: String(p.price ?? ''),
      compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
      stock: String(p.stock ?? 0),
      gender: p.gender || 'unisex',
      category: typeof p.category === 'object' ? p.category?._id : p.category || '',
      collection: typeof p.collectionRef === 'object' ? p.collectionRef?._id : p.collectionRef || '',
      status: p.status || 'active',
      sizes: (p.sizes || []).join(','),
      colors: (p.colors || []).join(','),
      images: (p.images || []).join('\n'),
      featured: Boolean(p.featured),
      newArrival: Boolean(p.newArrival),
      brand: p.brand || 'FIVE',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      setFormError('Name EN/AR required');
      return;
    }
    if (!form.sku.trim()) {
      setFormError('SKU required');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Invalid price');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setFormError('Invalid stock');
      return;
    }
    const body: Record<string, unknown> = {
      name: { en: form.nameEn.trim(), ar: form.nameAr.trim() },
      slug: form.slug.trim() || undefined,
      sku: form.sku.trim(),
      price,
      stock,
      gender: form.gender,
      status: form.status,
      brand: form.brand || 'FIVE',
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      newArrival: form.newArrival,
    };
    if (form.compareAtPrice) body.compareAtPrice = Number(form.compareAtPrice);
    if (form.category) body.category = form.category;
    if (form.collection) body.collection = form.collection;
    setSaving(true);
    try {
      if (editingId) await productsApi.update(editingId, body);
      else await productsApi.create(body);
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setActionError(null);
    try {
      await productsApi.remove(id);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {t('admin.products.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('admin.products.subtitle', { count: total })}
          </p>
        </div>
        <Button onClick={openCreate}>{t('admin.products.add')}</Button>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Search..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>

      {actionError && (
        <p className="mt-4 text-sm text-error" role="alert">
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16" role="status">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState className="mt-8" message={error} onRetry={() => void load()} />
      ) : rows.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No products"
          description="Create a product to start the catalog."
        />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-start text-sm">
            <thead className="border-b border-border bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('admin.products.name')}</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.price')}</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.status')}</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{isAr ? p.name?.ar : p.name?.en}</div>
                    <div className="text-xs text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3">${Number(p.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={(p.stock ?? 0) < 10 ? 'text-error' : ''}>{p.stock ?? 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'active' ? 'default' : 'outline'}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-end space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => void onDelete(p._id)}>
                      Delete
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
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={page * 20 >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <h3 className="font-display text-xl font-semibold">
              {editingId ? 'Edit product' : 'Create product'}
            </h3>
            {formError && (
              <p className="mt-2 text-sm text-error" role="alert">
                {formError}
              </p>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ['nameEn', 'Name EN'],
                  ['nameAr', 'Name AR'],
                  ['slug', 'Slug'],
                  ['sku', 'SKU'],
                  ['price', 'Price'],
                  ['compareAtPrice', 'Compare at'],
                  ['stock', 'Stock'],
                  ['brand', 'Brand'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label className="block text-sm">
                <span className="text-muted-foreground">Gender</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="women">women</option>
                  <option value="men">men</option>
                  <option value="unisex">unisex</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Status</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">active</option>
                  <option value="draft">draft</option>
                  <option value="archived">archived</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Category</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">—</option>
                  {cats.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name?.en || c.slug}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Collection</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.collection}
                  onChange={(e) => setForm({ ...form, collection: e.target.value })}
                >
                  <option value="">—</option>
                  {cols.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name?.en || c.slug}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-muted-foreground">Sizes (comma)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-muted-foreground">Colors (comma)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-muted-foreground">Image URLs (one per line)</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  rows={3}
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.newArrival}
                  onChange={(e) => setForm({ ...form, newArrival: e.target.checked })}
                />
                New arrival
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
