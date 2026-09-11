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
  'women-bottoms',
  'women-outerwear',
  'men-shirts',
  'men-bottoms',
  'men-outerwear',
  'kids-clothing',
  'sportswear',
  'men-sportswear',
  'kids-sportswear',
  'football-wear',
  'socks',
  'caps-hats',
  'complete-sets',
  'suits',
  'wedding-dresses',
  'accessories',
  'footwear',
  'bags',
];

const categoryLabels: Record<string, { en: string; ar: string }> = {
  all: { en: 'All', ar: 'الكل' },
  'women-dresses': { en: 'Women Dresses', ar: 'فساتين نسائية' },
  'women-tops': { en: 'Women Tops & Shirts', ar: 'بلوزات وقمصان نسائية' },
  'women-bottoms': { en: 'Women Trousers & Skirts', ar: 'بناطيل وتنانير نسائية' },
  'women-outerwear': { en: 'Women Outerwear', ar: 'معاطف وجاكيتات نسائية' },
  'men-shirts': { en: 'Men Shirts & Polos', ar: 'قمصان وبولو رجالية' },
  'men-bottoms': { en: 'Men Trousers & Jeans', ar: 'بناطيل وجينز رجالي' },
  'men-outerwear': { en: 'Men Jackets & Coats', ar: 'جاكيتات ومعاطف رجالية' },
  'kids-clothing': { en: 'Kids Collection', ar: 'ملابس الأطفال' },
  sportswear: { en: 'Active & Sportswear', ar: 'ملابس رياضية' },
  'men-sportswear': { en: 'Men Sportswear', ar: 'ملابس رياضية رجالية' },
  'kids-sportswear': { en: 'Kids Sportswear', ar: 'ملابس رياضية للأطفال' },
  'football-wear': { en: 'Football Wear', ar: 'ملابس كرة القدم' },
  socks: { en: 'Socks', ar: 'شرابات' },
  'caps-hats': { en: 'Caps & Hats', ar: 'طواقي وكابات' },
  'complete-sets': { en: 'Complete Sets', ar: 'أطقم كاملة' },
  suits: { en: 'Suits', ar: 'بدل رجالي' },
  'wedding-dresses': { en: 'Wedding Dresses', ar: 'فساتين زفاف' },
  accessories: { en: 'Fashion Accessories', ar: 'إكسسوارات الموضة' },
  footwear: { en: 'Footwear', ar: 'الأحذية' },
  bags: { en: 'Bags', ar: 'الحقائب' },
};

export function ProductFilters({
  filters,
  onChange,
  onClose,
  isMobile = false,
}: ProductFiltersProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className={`space-y-8 ${isMobile ? 'p-4' : 'sticky top-24'}`}>
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

      <div>
        <h4 className="mb-3 text-sm font-semibold tracking-wide">{t('shop.filters.category')}</h4>
        <div className="flex max-h-[65vh] flex-col gap-1.5 overflow-y-auto pe-1">
          {categoryOptions.map((cat) => {
            const label = categoryLabels[cat] || { en: cat, ar: cat };
            return (
              <button
                key={cat}
                type="button"
                onClick={() => update({ category: cat })}
                className={`rounded-md px-3 py-1.5 text-start text-sm transition-colors ${
                  filters.category === cat
                    ? 'bg-muted font-medium text-foreground ring-1 ring-border'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {isAr ? label.ar : label.en}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold tracking-wide">{t('shop.filters.gender')}</h4>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ gender: g })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filters.gender === g
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {t(`shop.gender.${g}`)}
            </button>
          ))}
        </div>
      </div>

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
