import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';

export function NewArrivals() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await productsApi.list({ newArrival: true, limit: 4, sort: 'newest' });
        if (cancelled) return;
        let list = ((res.data || []) as ApiProduct[]).map(mapApiProduct);
        if (list.length === 0) {
          const fallback = await productsApi.list({ limit: 4, sort: 'newest' });
          if (cancelled) return;
          list = ((fallback.data || []) as ApiProduct[]).map(mapApiProduct);
        }
        setProducts(list.slice(0, 4));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            {t('home.arrivals.label')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.arrivals.title')}
          </h2>
        </div>
        <Button variant="outline" size="sm" as-child={false}>
          <Link to="/shop">{t('home.arrivals.viewAll')}</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t('shop.empty.subtitle')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
