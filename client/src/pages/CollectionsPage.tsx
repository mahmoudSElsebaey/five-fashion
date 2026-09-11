import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collectionsApi } from '@/services/apiClient';
import { Seo } from '@/components/seo/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { ProductImage } from '@/components/ui/ProductImage';

type CollectionRow = {
  _id: string;
  name?: { en?: string; ar?: string };
  slug?: string;
  image?: string;
  featured?: boolean;
};

/** SECTION 11 — Public collections grid from API */
export function CollectionsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [items, setItems] = useState<CollectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await collectionsApi.list({ limit: 24 });
        if (!cancelled) setItems((res.data as CollectionRow[]) || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title={t('nav.collections')}
        description={t('home.collections.title', { defaultValue: 'Explore FIVE collections' })}
      />
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {t('nav.collections')}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t('home.collections.subtitle', {
          defaultValue: 'Curated seasons and signature lines.',
        })}
      </p>

      {loading ? (
        <div className="flex justify-center py-24" role="status">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorState className="mt-12" message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : items.length === 0 ? (
        <EmptyState
          className="mt-12"
          title={t('shop.empty.title', { defaultValue: 'Nothing here yet' })}
          actionLabel={t('nav.shop')}
          actionTo="/shop"
        />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const title = isAr ? item.name?.ar : item.name?.en;
            return (
              <Link key={item._id} to={`/shop?collection=${item.slug || item._id}`}>
                <Card
                  hoverable
                  className="group relative aspect-[4/5] overflow-hidden border-0 bg-muted"
                >
                  <ProductImage
                    src={item.image}
                    alt={title || 'Collection'}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
                    {item.featured && (
                      <p className="mt-1 text-xs uppercase tracking-wider text-white/80">
                        {t('home.collections.featured', { defaultValue: 'Featured' })}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
