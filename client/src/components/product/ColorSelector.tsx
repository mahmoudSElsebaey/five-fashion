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
  gray: '#6B7280',
  brown: '#5D4037',
  white: '#FFFFFF',
  red: '#DC2626',
  burgundy: '#800020',
  maroon: '#800000',
  green: '#16A34A',
  olive: '#6B7A21',
  blue: '#2563EB',
  'light-blue': '#BFDBFE',
  sky: '#38BDF8',
  yellow: '#FACC15',
  gold: '#C9A227',
  orange: '#F97316',
  pink: '#EC4899',
  purple: '#9333EA',
  beige: '#E8DCCB',
  nude: '#E8D5C4',
  cognac: '#9A5B3C',
  sand: '#D4C4A8',
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

function resolveColor(value: string) {
  const key = normalize(value);
  return colorMap[key] || key;
}

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
          <span className="ms-2 font-normal text-muted-foreground capitalize">— {selected}</span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const resolved = resolveColor(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              title={color}
              className={`relative h-10 w-10 rounded-full border-2 transition-all duration-normal ease-five ${
                selected === color
                  ? 'scale-110 border-foreground ring-2 ring-accent ring-offset-2 ring-offset-background'
                  : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: resolved }}
              aria-label={color}
            >
              {(normalize(color) === 'white' || normalize(color) === 'ivory' || normalize(color) === 'champagne') && (
                <span className="absolute inset-0 rounded-full border border-black/10" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}