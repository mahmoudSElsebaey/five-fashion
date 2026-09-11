import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ProductImage } from '@/components/ui/ProductImage';
import { collectionsApi } from '@/services/apiClient';

type ApiCollection = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
  image?: string;
  featured?: boolean;
};

export function FeaturedCollections() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [items, setItems] = useState<ApiCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await collectionsApi.list({ featured: 'true', limit: 4 });
        if (cancelled) return;
        let list = (res.data || []) as ApiCollection[];
        if (list.length === 0) {
          const all = await collectionsApi.list({ limit: 4 });
          if (cancelled) return;
          list = (all.data || []) as ApiCollection[];
        }
        setItems(list.slice(0, 4));
      } catch {
        if (!cancelled) setItems([]);
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
            {t('home.collections.label')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.collections.title')}
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          {t('home.collections.viewAll')} →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t('shop.empty.subtitle')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const title = isAr ? item.name.ar : item.name.en;
            return (
              <Link key={item._id} to={`/shop?collection=${item.slug}`}>
                <Card
                  hoverable
                  className="group relative aspect-[3/4] overflow-hidden border-0 bg-muted"
                >
                  <ProductImage
                    src={item.image}
                    alt={title}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-five group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 start-0 end-0 p-5">
                    <h3 className="font-display text-lg font-medium text-foreground">{title}</h3>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
