import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/data/mockProducts';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice = product.salePrice ?? product.price;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card hoverable className="overflow-hidden border-0 bg-transparent shadow-none">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          {/* Placeholder visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10 transition-transform duration-700 ease-five group-hover:scale-105" />

          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge variant="accent">{t('shop.badges.new')}</Badge>
            )}
            {product.isSale && (
              <Badge variant="error">{t('shop.badges.sale')}</Badge>
            )}
          </div>

          {/* Quick actions placeholder */}
          <div className="absolute bottom-3 end-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="Add to wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>
        </div>

        <CardContent className="mt-3 space-y-1 px-0">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium text-foreground line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${displayPrice}</span>
            {product.salePrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
