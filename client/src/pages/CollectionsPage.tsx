import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collectionsApi } from '@/services/apiClient';
import { Seo } from '@/components/seo/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Collection3DCard } from '@/components/ui/Collection3DCard';

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
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const title = (isAr ? item.name?.ar : item.name?.en) || 'Collection';
            return (
              <Collection3DCard
                key={item._id}
                aspectClassName="aspect-[4/5]"
                item={{
                  id: item._id,
                  title,
                  slug: item.slug || item._id,
                  image: item.image,
                  featured: item.featured,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
