import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters, type FilterState } from '@/components/shop/ProductFilters';
import { SortSelect, type SortOption } from '@/components/shop/SortSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Seo } from '@/components/seo/Seo';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';

const PAGE_SIZE = 12;

const defaultFilters: FilterState = {
  category: 'all',
  gender: 'all',
  collection: 'all',
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

function parseSort(raw: string | null): SortOption {
  if (raw === 'price-asc' || raw === 'price-desc' || raw === 'popular' || raw === 'newest') return raw;
  return 'newest';
}

export function ShopPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    category: searchParams.get('category') || 'all',
    gender: searchParams.get('gender') || 'all',
    collection: searchParams.get('collection') || 'all',
    onlyNew: searchParams.get('new') === '1' || searchParams.get('new') === 'true',
    onlySale: searchParams.get('sale') === '1' || searchParams.get('sale') === 'true',
  }));
  const [sort, setSort] = useState<SortOption>(() => parseSort(searchParams.get('sort')));
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.category !== 'all') next.set('category', filters.category);
    if (filters.gender !== 'all') next.set('gender', filters.gender);
    if (filters.collection !== 'all') next.set('collection', filters.collection);
    if (filters.onlyNew) next.set('new', '1');
    if (filters.onlySale) next.set('sale', '1');
    if (sort !== 'newest') next.set('sort', sort);
    if (search.trim()) next.set('q', search.trim());
    if (page > 1) next.set('page', String(page));
    setSearchParams(next, { replace: true });
  }, [filters, sort, search, page, setSearchParams]);

  const collectionParam = searchParams.get('collection') || 'all';
  useEffect(() => {
    setFilters((f) => (f.collection === collectionParam ? f : { ...f, collection: collectionParam }));
  }, [collectionParam]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort, search]);

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        limit: PAGE_SIZE,
        sort: sortToApi(sort),
      };
      if (search.trim()) params.q = search.trim();
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.gender !== 'all') params.gender = filters.gender;
      if (filters.collection !== 'all') params.collection = filters.collection;
      if (filters.onlyNew) params.newArrival = true;
      if (filters.onlySale) params.onSale = true;
      if (filters.priceMin > 0) params.minPrice = filters.priceMin;
      if (filters.priceMax < 2000) params.maxPrice = filters.priceMax;

      const res = await productsApi.list(params);
      if (signal?.cancelled) return;
      const list = (res.data || []) as ApiProduct[];
      setProducts(list.map(mapApiProduct));
      const meta = (res as { meta?: { total?: number } }).meta;
      setTotal(typeof meta?.total === 'number' ? meta.total : list.length);
    } catch (e) {
      if (signal?.cancelled) return;
      setError(e instanceof Error ? e.message : 'Failed to load products');
      setProducts([]);
      setTotal(0);
    } finally {
      if (!signal?.cancelled) setLoading(false);
    }
  }, [filters, sort, search, page]);

  useEffect(() => {
    const flag = { cancelled: false };
    const timer = setTimeout(() => void load(flag), 200);
    return () => {
      flag.cancelled = true;
      clearTimeout(timer);
    };
  }, [load, reloadKey]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const subtitle =
    total > 0
      ? t('shop.subtitleCount', { count: total, defaultValue: `${total} pieces` })
      : t('shop.subtitle');

  return (
    <>
      <Seo
        title="Shop"
        description="Shop luxury fashion — dresses, outerwear, shirts and more at FIVE Fashion."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('shop.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('shop.searchPlaceholder')}
                className="ps-10"
                aria-label={t('shop.searchPlaceholder')}
              />
              <svg
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
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
              <div className="flex justify-center py-24" role="status" aria-label="Loading">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <ErrorState
                message={error}
                retryLabel={t('shop.filters.reset')}
                onRetry={() => {
                  setError(null);
                  setReloadKey((k) => k + 1);
                }}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title={t('shop.empty.title')}
                description={t('shop.empty.subtitle')}
                actionLabel={t('shop.filters.reset')}
                onAction={handleReset}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      {t('common.previous', { defaultValue: 'Previous' })}
                    </Button>
                    <span className="min-w-20 text-center text-sm text-muted-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      {t('common.next', { defaultValue: 'Next' })}
                    </Button>
                  </div>
                )}
              </>
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
    </>
  );
}
