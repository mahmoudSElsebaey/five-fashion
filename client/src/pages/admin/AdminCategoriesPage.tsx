import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { categoriesApi } from '@/services/apiClient';

export function AdminCategoriesPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameAr: '', slug: '', gender: 'all' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.list({ limit: 100 });
      setRows((res.data as any[]) || []);
      setError(null);
    } catch (e) { setError(e instanceof Error ? e.message : (isArabic ? 'حدث خطأ' : 'Failed')); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form.nameEn || !form.nameAr) return;
    setSaving(true); setFormError(null);
    try {
      const body = { name: { en: form.nameEn, ar: form.nameAr }, slug: form.slug || undefined, gender: form.gender };
      if (editingId) await categoriesApi.update(editingId, body); else await categoriesApi.create(body);
      setForm({ nameEn: '', nameAr: '', slug: '', gender: 'all' }); setEditingId(null); await load();
    } catch (err) { setFormError(err instanceof Error ? err.message : (isArabic ? 'فشل الحفظ' : 'Save failed')); }
    finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm(isArabic ? 'هل تريد حذف الفئة؟' : 'Delete category?')) return;
    setFormError(null);
    try { await categoriesApi.remove(id); await load(); }
    catch (err) { setFormError(err instanceof Error ? err.message : (isArabic ? 'فشل الحذف' : 'Delete failed')); }
  };

  const genderLabel = (value: string) => ({ all: isArabic ? 'الكل' : 'all', women: isArabic ? 'نساء' : 'women', men: isArabic ? 'رجال' : 'men', unisex: isArabic ? 'للجنسين' : 'unisex' }[value] || value);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{isArabic ? 'الفئات' : 'Categories'}</h2>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={isArabic ? 'الاسم بالإنجليزية' : 'Name EN'} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={isArabic ? 'الاسم بالعربية' : 'Name AR'} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="all">{isArabic ? 'الكل' : 'all'}</option><option value="women">{isArabic ? 'نساء' : 'women'}</option><option value="men">{isArabic ? 'رجال' : 'men'}</option><option value="unisex">{isArabic ? 'للجنسين' : 'unisex'}</option>
        </select>
        <Button type="submit" disabled={saving}>{editingId ? (isArabic ? 'تحديث' : 'Update') : (isArabic ? 'إضافة' : 'Create')}</Button>
      </form>
      {formError && <p className="mt-3 text-sm text-error" role="alert">{formError}</p>}
      {loading ? <div className="flex justify-center py-12" role="status"><Spinner /></div> : error ? <ErrorState className="mt-4" message={error} onRetry={() => void load()} /> : rows.length === 0 ? <EmptyState className="mt-8" title={isArabic ? 'لا توجد فئات' : 'No categories'} description={isArabic ? 'أضف فئة لتنظيم المنتجات.' : 'Create a category to organize products.'} /> : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[480px] text-sm"><thead className="border-b bg-surface text-muted-foreground"><tr><th className="px-4 py-3 text-start">{isArabic ? 'الاسم' : 'Name'}</th><th className="px-4 py-3 text-start">Slug</th><th className="px-4 py-3 text-start">{isArabic ? 'الفئة المستهدفة' : 'Gender'}</th><th /></tr></thead><tbody>
          {rows.map((c) => <tr key={c._id} className="border-b last:border-0"><td className="px-4 py-3">{isArabic ? (c.name?.ar || c.name?.en) : c.name?.en}</td><td className="px-4 py-3 text-muted-foreground">{c.slug}</td><td className="px-4 py-3">{genderLabel(c.gender)}</td><td className="px-4 py-3 text-end space-x-2"><Button size="sm" variant="ghost" onClick={() => { setEditingId(c._id); setForm({ nameEn: c.name?.en || '', nameAr: c.name?.ar || '', slug: c.slug || '', gender: c.gender || 'all' }); }}>{isArabic ? 'تعديل' : 'Edit'}</Button><Button size="sm" variant="ghost" onClick={() => void onDelete(c._id)}>{isArabic ? 'حذف' : 'Delete'}</Button></td></tr>)}
        </tbody></table></div>
      )}
    </div>
  );
}
