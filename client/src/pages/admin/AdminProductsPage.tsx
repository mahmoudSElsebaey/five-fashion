import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { mockProducts } from '@/data/mockProducts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t('admin.products.title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.products.subtitle', { count: mockProducts.length })}</p>
        </div>
        <Button size="sm" disabled title="Coming soon">{t('admin.products.add')}</Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-start">
            <tr>
              <th className="px-4 py-3 font-medium">{t('admin.products.name')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.products.category')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.products.price')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.products.status')}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium">{isAr ? p.nameAr : p.nameEn}</div>
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3">
                  ${p.salePrice ?? p.price}
                  {p.salePrice && <span className="ms-1 text-xs text-muted-foreground line-through">${p.price}</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew && <Badge variant="accent">{t('shop.badges.new')}</Badge>}
                    {p.isSale && <Badge variant="error">{t('shop.badges.sale')}</Badge>}
                    {!p.isNew && !p.isSale && <Badge variant="outline">{t('admin.products.active')}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-end">
                  <Link to={`/product/${p.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    {t('admin.products.view')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
