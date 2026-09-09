import { useTranslation } from 'react-i18next';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
        {t('shop.sort.label')}
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-9 rounded-lg border border-input bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="newest">{t('shop.sort.newest')}</option>
        <option value="price-asc">{t('shop.sort.priceAsc')}</option>
        <option value="price-desc">{t('shop.sort.priceDesc')}</option>
        <option value="popular">{t('shop.sort.popular')}</option>
      </select>
    </div>
  );
}
