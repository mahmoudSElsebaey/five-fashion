import { useTranslation } from 'react-i18next';

const colorMap: Record<string, string> = {
  black: '#1A1A1C',
  ivory: '#F5F0E8',
  camel: '#C4A484',
  charcoal: '#36454F',
  champagne: '#F7E7CE',
  navy: '#1B2A4A',
  stone: '#A8A29E',
  grey: '#6B7280',
  brown: '#5D4037',
  white: '#FFFFFF',
  'light-blue': '#BFDBFE',
  nude: '#E8D5C4',
  cognac: '#9A5B3C',
  sand: '#D4C4A8',
};

interface ColorSelectorProps {
  colors: string[];
  selected: string | null;
  onChange: (color: string) => void;
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold tracking-wide">
        {t('product.color')}
        {selected && (
          <span className="ms-2 font-normal text-muted-foreground capitalize">
            — {selected}
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            title={color}
            className={`
              h-9 w-9 rounded-full border-2 transition-all duration-normal ease-five
              ${
                selected === color
                  ? 'border-foreground scale-110'
                  : 'border-transparent hover:scale-105'
              }
            `}
            style={{ backgroundColor: colorMap[color] || '#888' }}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
}
