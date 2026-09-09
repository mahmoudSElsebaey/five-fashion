import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters, type FilterState } from '@/components/shop/ProductFilters';
import { SortSelect, type SortOption } from '@/components/shop/SortSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockProducts } from '@/data/mockProducts';

const defaultFilters: FilterState = {
  category: 'all',
  gender: 'all',
  onlyNew: false,
  onlySale: false,
  priceMin: 0,
  priceMax: 2000,
};

export function ShopPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameAr.includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.includes(q)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.gender !== 'all') {
      result = result.filter((p) => p.gender === filters.gender);
    }

    if (filters.onlyNew) result = result.filter((p) => p.isNew);
    if (filters.onlySale) result = result.filter((p) => p.isSale);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [filters, sort, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t('shop.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('shop.subtitle', { count: filtered.length })}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Input
              type="search"
              placeholder={t('shop.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pe-10"
            />
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium">{t('shop.empty.title')}</p>
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
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
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
