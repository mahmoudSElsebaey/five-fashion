import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { productsApi, categoriesApi, collectionsApi, uploadsApi } from '@/services/apiClient';

type ProductRow = {
  _id: string; name?: { en?: string; ar?: string }; slug?: string; sku?: string;
  price?: number; compareAtPrice?: number; stock?: number; status?: string; gender?: string;
  featured?: boolean; newArrival?: boolean; images?: string[]; sizes?: string[]; colors?: string[];
  category?: any; collectionRef?: any; brand?: string;
};

const PAGE_SIZE = 10;
const emptyForm = {
  nameEn: '', nameAr: '', slug: '', sku: '', price: '', compareAtPrice: '', stock: '0',
  gender: 'unisex', category: '', collection: '', status: 'active', sizes: 'S,M,L',
  colors: 'Black,Ivory', images: '', featured: false, newArrival: false, brand: 'FIVE',
};

export function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const text = (en: string, ar: string) => (isAr ? ar : en);
  const label = (key: string, en: string, ar: string) => t(key, { defaultValue: text(en, ar) });
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
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await productsApi.adminList({ limit: PAGE_SIZE, page, status: 'all', q: q || undefined });
      setRows((res.data as ProductRow[]) || []); setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : text('Failed to load products', 'تعذر تحميل المنتجات'));
    } finally { setLoading(false); }
  }, [page, q, isAr]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    Promise.all([categoriesApi.list({ limit: 100 }), collectionsApi.list({ limit: 100 })])
      .then(([c, col]) => { setCats((c.data as any[]) || []); setCols((col.data as any[]) || []); })
      .catch(() => undefined);
  }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setFormError(null); setFormOpen(true); };
  const openEdit = (p: ProductRow) => {
    setEditingId(p._id);
    setForm({
      nameEn: p.name?.en || '', nameAr: p.name?.ar || '', slug: p.slug || '', sku: p.sku || '',
      price: String(p.price ?? ''), compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
      stock: String(p.stock ?? 0), gender: p.gender || 'unisex',
      category: typeof p.category === 'object' ? p.category?._id : p.category || '',
      collection: typeof p.collectionRef === 'object' ? p.collectionRef?._id : p.collectionRef || '',
      status: p.status || 'active', sizes: (p.sizes || []).join(','), colors: (p.colors || []).join(','),
      images: (p.images || []).join('\n'), featured: Boolean(p.featured), newArrival: Boolean(p.newArrival), brand: p.brand || 'FIVE',
    });
    setFormError(null); setFormOpen(true);
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files);
    if (selected.some(file => !file.type.startsWith('image/'))) {
      setFormError(text('Only image files are allowed.', 'مسموح برفع ملفات الصور فقط.')); return;
    }
    setUploading(true); setFormError(null);
    try {
      const res = await uploadsApi.images(selected);
      const urls = (res.data || []).map(item => item.url).filter(Boolean);
      if (!urls.length) throw new Error(text('No images were uploaded.', 'لم يتم رفع أي صور.'));
      setForm(prev => ({ ...prev, images: [...prev.images.split('\n').map(s => s.trim()).filter(Boolean), ...urls].join('\n') }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : text('Image upload failed', 'فشل رفع الصور'));
    } finally { setUploading(false); }
  };

  const removeImage = (url: string) => {
    setForm(prev => ({ ...prev, images: prev.images.split('\n').filter(item => item.trim() && item.trim() !== url).join('\n') }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(null);
    const price = Number(form.price), stock = Number(form.stock);
    const compareAtPrice = form.compareAtPrice ? Number(form.compareAtPrice) : undefined;
    if (!form.nameEn.trim() || !form.nameAr.trim()) return setFormError(text('English and Arabic names are required', 'اسم المنتج بالإنجليزية والعربية مطلوب'));
    if (!form.sku.trim()) return setFormError(text('SKU is required', 'كود SKU مطلوب'));
    if (!Number.isFinite(price) || price < 0) return setFormError(text('Enter a valid price', 'أدخل سعرًا صحيحًا'));
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) return setFormError(text('Stock must be a whole number 0 or greater', 'الكمية يجب أن تكون رقمًا صحيحًا 0 أو أكبر'));
    if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) return setFormError(text('Enter a valid compare-at price', 'أدخل سعر المقارنة بشكل صحيح'));

    const body: Record<string, unknown> = {
      name: { en: form.nameEn.trim(), ar: form.nameAr.trim() }, slug: form.slug.trim() || undefined,
      sku: form.sku.trim(), price, stock, gender: form.gender, status: form.status, brand: form.brand || 'FIVE',
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean), colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean), featured: form.featured, newArrival: form.newArrival,
    };
    if (compareAtPrice !== undefined) body.compareAtPrice = compareAtPrice;
    if (form.category) body.category = form.category;
    if (form.collection) body.collection = form.collection;

    setSaving(true);
    try {
      if (editingId) await productsApi.update(editingId, body); else await productsApi.create(body);
      setFormOpen(false); await load();
    } catch (err) { setFormError(err instanceof Error ? err.message : text('Could not save product', 'تعذر حفظ المنتج')); }
    finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm(text('Delete this product?', 'هل تريد حذف هذا المنتج؟'))) return;
    setActionError(null);
    try { await productsApi.remove(id); await load(); }
    catch (err) { setActionError(err instanceof Error ? err.message : text('Delete failed', 'فشل حذف المنتج')); }
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const imageUrls = form.images.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="font-display text-2xl font-semibold tracking-tight">{label('admin.products.title', 'Products', 'المنتجات')}</h2><p className="mt-1 text-sm text-muted-foreground">{label('admin.products.subtitle', '{{count}} products', '{{count}} منتج').replace('{{count}}', String(total))}</p></div>
        <Button onClick={openCreate}>{label('admin.products.add', 'Add product', 'إضافة منتج')}</Button>
      </div>
      <div className="mt-4 flex gap-2"><input className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={text('Search products...', 'ابحث عن المنتجات...')} value={q} onChange={e => { setPage(1); setQ(e.target.value); }} /></div>
      {actionError && <p className="mt-4 text-sm text-error" role="alert">{actionError}</p>}
      {loading ? <div className="flex justify-center py-16" role="status"><Spinner /></div> : error ? <ErrorState className="mt-8" message={error} onRetry={() => void load()} /> : rows.length === 0 ? <EmptyState className="mt-8" title={text('No products', 'لا توجد منتجات')} description={text('Create a product to start the catalog.', 'أضف منتجًا لبدء الكتالوج.')} /> : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[720px] text-start text-sm"><thead className="border-b border-border bg-surface text-muted-foreground"><tr>
          <th className="px-4 py-3 font-medium">{label('admin.products.name', 'Name', 'الاسم')}</th><th className="px-4 py-3 font-medium">SKU</th><th className="px-4 py-3 font-medium">{label('admin.products.price', 'Price', 'السعر')}</th><th className="px-4 py-3 font-medium">{text('Stock', 'المخزون')}</th><th className="px-4 py-3 font-medium">{label('admin.products.status', 'Status', 'الحالة')}</th><th />
        </tr></thead><tbody>{rows.map(p => <tr key={p._id} className="border-b border-border last:border-0"><td className="px-4 py-3"><div className="font-medium">{isAr ? p.name?.ar : p.name?.en}</div><div className="text-xs text-muted-foreground">{p.slug}</div></td><td className="px-4 py-3 text-muted-foreground">{p.sku}</td><td className="px-4 py-3">${Number(p.price || 0).toFixed(2)}</td><td className="px-4 py-3"><span className={(p.stock ?? 0) < 10 ? 'text-error' : ''}>{p.stock ?? 0}</span></td><td className="px-4 py-3"><Badge variant={p.status === 'active' ? 'default' : 'outline'}>{p.status === 'active' ? text('Active', 'نشط') : p.status === 'draft' ? text('Draft', 'مسودة') : text('Archived', 'مؤرشف')}</Badge></td><td className="px-4 py-3 text-end space-x-2 rtl:space-x-reverse"><Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30">{text('Edit', 'تعديل')}</Button><Button variant="ghost" size="sm" onClick={() => void onDelete(p._id)} className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30">{text('Delete', 'حذف')}</Button></td></tr>)}</tbody></table></div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{text('Prev', 'السابق')}</Button><span className="text-sm text-muted-foreground">{text('Page', 'صفحة')} {page} {text('of', 'من')} {pages}</span><Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>{text('Next', 'التالي')}</Button></div>

      {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        <h3 className="font-display text-xl font-semibold">{editingId ? text('Edit product', 'تعديل المنتج') : text('Create product', 'إضافة منتج')}</h3>
        {formError && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400" role="alert">{formError}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {([['nameEn','Name EN','اسم المنتج بالإنجليزية'],['nameAr','Name AR','اسم المنتج بالعربية'],['slug','Slug','الرابط المختصر'],['sku','SKU','كود SKU'],['price','Price','السعر'],['compareAtPrice','Compare at','السعر قبل الخصم'],['stock','Stock','المخزون'],['brand','Brand','العلامة التجارية']] as const).map(([key,en,ar]) => <label key={key} className="block text-sm"><span className="text-muted-foreground">{text(en,ar)}</span><input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
          <label className="block text-sm"><span className="text-muted-foreground">{text('Gender','الجنس')}</span><select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.gender} onChange={e => setForm({ ...form, gender:e.target.value })}><option value="women">{text('Women','نساء')}</option><option value="men">{text('Men','رجال')}</option><option value="unisex">{text('Unisex','للجميع')}</option></select></label>
          <label className="block text-sm"><span className="text-muted-foreground">{text('Status','الحالة')}</span><select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status:e.target.value })}><option value="active">{text('Active','نشط')}</option><option value="draft">{text('Draft','مسودة')}</option><option value="archived">{text('Archived','مؤرشف')}</option></select></label>
          <label className="block text-sm"><span className="text-muted-foreground">{text('Category','الفئة')}</span><select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}><option value="">—</option>{cats.map(c => <option key={c._id} value={c._id}>{c.name?.[isAr ? 'ar' : 'en'] || c.slug}</option>)}</select></label>
          <label className="block text-sm"><span className="text-muted-foreground">{text('Collection','المجموعة')}</span><select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.collection} onChange={e => setForm({ ...form, collection:e.target.value })}><option value="">—</option>{cols.map(c => <option key={c._id} value={c._id}>{c.name?.[isAr ? 'ar' : 'en'] || c.slug}</option>)}</select></label>
          <label className="block text-sm sm:col-span-2"><span className="text-muted-foreground">{text('Sizes (comma separated)','المقاسات (افصل بينها بفاصلة)')}</span><input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.sizes} onChange={e => setForm({ ...form, sizes:e.target.value })} /></label>
          <label className="block text-sm sm:col-span-2"><span className="text-muted-foreground">{text('Colors (comma separated)','الألوان (افصل بينها بفاصلة)')}</span><input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" value={form.colors} onChange={e => setForm({ ...form, colors:e.target.value })} /></label>
          <div className="sm:col-span-2 rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium">{text('Product images','صور المنتج')}</p><p className="mt-1 text-xs text-muted-foreground">{text('Use image URLs, or upload one or multiple images from your device.','استخدم روابط الصور أو ارفع صورة أو أكثر من جهازك.')}</p></div><label className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 ${uploading ? 'pointer-events-none opacity-60' : ''}`}><input type="file" accept="image/*" multiple className="sr-only" disabled={uploading} onChange={e => { void uploadFiles(e.target.files); e.currentTarget.value=''; }} />{uploading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{text('Uploading...','جارٍ الرفع...')}</> : text('Upload from device','رفع من الجهاز')}</label></div>
            <textarea className="mt-3 min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={text('Paste image URLs here, one per line (optional)','ضع روابط الصور هنا، رابط في كل سطر (اختياري)')} value={form.images} onChange={e => setForm({ ...form, images:e.target.value })} />
            {imageUrls.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{imageUrls.map((url,index) => <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-lg border border-border bg-surface"><img src={url} alt={`${text('Product image','صورة المنتج')} ${index+1}`} className="aspect-square w-full object-cover" /><button type="button" onClick={() => removeImage(url)} className="absolute end-1 top-1 hidden rounded-full bg-black/70 px-2 py-1 text-xs text-white group-hover:block">×</button></div>)}</div>}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured:e.target.checked })} />{text('Featured product','منتج مميز')}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.newArrival} onChange={e => setForm({ ...form, newArrival:e.target.checked })} />{text('New arrival','وصل حديثًا')}</label>
        </div>
        <div className="mt-6 flex justify-end gap-2 rtl:flex-row-reverse"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>{text('Cancel','إلغاء')}</Button><Button type="submit" disabled={saving || uploading}>{saving ? text('Saving...','جارٍ الحفظ...') : editingId ? text('Save changes','حفظ التعديلات') : text('Create product','إضافة المنتج')}</Button></div>
      </form></div>}
    </div>
  );
}
