import { useTranslation } from 'react-i18next';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">{t('product.size')}</h3>
        <button type="button" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
          {t('product.sizeGuide')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`
              min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-normal ease-five
              ${
                selected === size
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-foreground'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
