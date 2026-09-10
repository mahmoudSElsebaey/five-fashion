import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters, type FilterState } from '@/components/shop/ProductFilters';
import { SortSelect, type SortOption } from '@/components/shop/SortSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { Spinner } from '@/components/ui/Spinner';

const defaultFilters: FilterState = {
  category: 'all',
  gender: 'all',
  onlyNew: false,
  onlySale: false,
  priceMin: 0,
  priceMax: 2000,
};

function sortToApi(sort: SortOption): string {
  if (sort === 'price-asc') return 'price_asc';
  if (sort === 'price-desc') return 'price_desc';
  if (sort === 'popular') return 'rating';
  return 'newest';
}

export function ShopPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number | boolean | undefined> = {
          page: 1,
          limit: 48,
          sort: sortToApi(sort),
        };
        if (search.trim()) params.q = search.trim();
        if (filters.category !== 'all') params.category = filters.category;
        if (filters.gender !== 'all') params.gender = filters.gender;
        if (filters.onlyNew) params.newArrival = true;
        if (filters.priceMin > 0) params.minPrice = filters.priceMin;
        if (filters.priceMax < 2000) params.maxPrice = filters.priceMax;

        const res = await productsApi.list(params);
        if (cancelled) return;
        const list = (res.data || []) as ApiProduct[];
        let mapped = list.map(mapApiProduct);
        if (filters.onlySale) mapped = mapped.filter((p) => p.isSale);
        setProducts(mapped);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load products');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const timer = setTimeout(load, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters, sort, search]);

  const filtered = useMemo(() => products, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t('shop.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('shop.subtitle')}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('shop.searchPlaceholder')}
              className="ps-10"
            />
            <svg
              className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            {t('shop.filters.title')}
          </Button>
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="flex gap-10">
        <div className="hidden w-56 shrink-0 lg:block">
          <ProductFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium text-foreground">{error}</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setFilters({ ...defaultFilters });
                  setSearch('');
                }}
              >
                {t('shop.filters.reset')}
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium text-foreground">{t('shop.empty.title')}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('shop.empty.subtitle')}</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setFilters(defaultFilters);
                  setSearch('');
                }}
              >
                {t('shop.filters.reset')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-full max-w-xs overflow-y-auto bg-background shadow-xl">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setMobileFiltersOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}
