import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export type FilterState = {
  category: string;
  gender: string;
  collection: string;
  onlyNew: boolean;
  onlySale: boolean;
  priceMin: number;
  priceMax: number;
};

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const genderOptions = ['all', 'women', 'men', 'unisex'];
const categoryOptions = [
  'all',
  'women-dresses',
  'women-tops',
  'women-outerwear',
  'men-shirts',
  'men-trousers',
  'men-outerwear',
  'accessories',
  'footwear',
];

export function ProductFilters({
  filters,
  onChange,
  onClose,
  isMobile = false,
}: ProductFiltersProps) {
  const { t } = useTranslation();

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside
      className={`
        space-y-8
        ${isMobile ? 'p-4' : 'sticky top-24'}
      `}
    >
      {isMobile && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">{t('shop.filters.title')}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t('shop.filters.close')}
          </Button>
        </div>
      )}

      {filters.collection && filters.collection !== 'all' && (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <p className="text-xs text-muted-foreground">{t('shop.filters.collection', { defaultValue: 'Collection' })}</p>
          <p className="font-medium capitalize">{filters.collection.replace(/-/g, ' ')}</p>
          <button
            type="button"
            className="mt-1 text-xs text-muted-foreground underline hover:text-foreground"
            onClick={() => update({ collection: 'all' })}
          >
            {t('shop.filters.clearCollection', { defaultValue: 'Clear collection' })}
          </button>
        </div>
      )}

      {/* Category */}
      <div>
        <h4 className="mb-3 text-sm font-semibold tracking-wide">
          {t('shop.filters.category')}
        </h4>
        <div className="flex flex-col gap-1.5">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => update({ category: cat })}
              className={`
                rounded-md px-3 py-1.5 text-start text-sm transition-colors
                ${
                  filters.category === cat
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {t(`shop.categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="mb-3 text-sm font-semibold tracking-wide">
          {t('shop.filters.gender')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ gender: g })}
              className={`
                rounded-full border px-3 py-1 text-xs font-medium transition-colors
                ${
                  filters.gender === g
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }
              `}
            >
              {t(`shop.gender.${g}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick toggles */}
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={filters.onlyNew}
            onChange={(e) => update({ onlyNew: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          {t('shop.filters.onlyNew')}
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={filters.onlySale}
            onChange={(e) => update({ onlySale: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          {t('shop.filters.onlySale')}
        </label>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() =>
          onChange({
            category: 'all',
            gender: 'all',
            collection: 'all',
            onlyNew: false,
            onlySale: false,
            priceMin: 0,
            priceMax: 2000,
          })
        }
      >
        {t('shop.filters.reset')}
      </Button>
    </aside>
  );
}
