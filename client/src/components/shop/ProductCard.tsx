import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductImage } from '@/components/ui/ProductImage';
import type { UiProduct as Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice = product.salePrice ?? product.price;
  const image = product.images?.[0];

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <Card hoverable className="overflow-hidden border-0 bg-transparent shadow-none">
        <div className="relative">
          <ProductImage
            src={image}
            alt={name}
            className="aspect-[3/4] rounded-xl"
            imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-five group-hover:scale-105"
          />
          <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="accent">{t('shop.badges.new')}</Badge>}
            {product.isSale && <Badge variant="error">{t('shop.badges.sale')}</Badge>}
          </div>
        </div>

        <CardContent className="mt-3 space-y-1 px-0">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium text-foreground line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${displayPrice}</span>
            {product.salePrice && (
              <span className="text-sm text-muted-foreground line-through">${product.price}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
