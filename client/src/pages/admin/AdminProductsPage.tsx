import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { Spinner } from '@/components/ui/Spinner';

export function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await productsApi.list({ limit: 100, status: 'all' });
        if (cancelled) return;
        setProducts(((res.data || []) as ApiProduct[]).map(mapApiProduct));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {t('admin.products.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('admin.products.subtitle', { count: products.length })}
          </p>
        </div>
        <Button disabled title="Coming in next phase">
          {t('admin.products.add')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <p className="mt-8 text-sm text-error">{error}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead className="border-b border-border bg-surface text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('admin.products.colName')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.colCategory')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.colPrice')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.colStatus')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.products.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {isAr ? p.nameAr : p.nameEn}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">
                    ${(p.salePrice ?? p.price).toFixed(0)}
                  </td>
                  <td className="px-4 py-3">
                    {p.isNew && <Badge variant="accent">New</Badge>}
                    {p.isSale && (
                      <Badge variant="error" className="ms-1">
                        Sale
                      </Badge>
                    )}
                    {!p.isNew && !p.isSale && (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/product/${p.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t('admin.products.view')}
                    </Link>
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
