import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/Badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { CardContainer, CardBody, CardItem } from '@/components/ui/ThreeDCard';
import { addToCart } from '@/features/cart/cartSlice';
import type { UiProduct as Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice = product.salePrice ?? product.price;
  const image = product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0],
        size: product.sizes?.[0],
        color: product.colors?.[0],
        quantity: 1,
      })
    );
  };

  return (
    <CardContainer className="w-full" containerClassName="w-full">
      <CardBody className="group relative w-full">
        <Link to={`/product/${product.slug || product.id}`} className="block outline-none">
          <div
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card to-surface shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-shadow duration-500 group-hover:shadow-[0_20px_50px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)] group-hover:ring-accent/25 dark:ring-white/5"
          >
            {/* Subtle 3D edge highlight */}
            <div
              className="pointer-events-none absolute inset-0 z-[1] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, transparent), transparent 45%, transparent 55%, color-mix(in srgb, var(--accent) 10%, transparent))',
              }}
            />

            <CardItem translateZ={50} className="relative w-full">
              <ProductImage
                src={image}
                alt={name}
                className="aspect-[3/4] w-full"
                imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </CardItem>

            <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
              {product.isNew && (
                <CardItem translateZ={60}>
                  <Badge variant="accent">{t('shop.badges.new')}</Badge>
                </CardItem>
              )}
              {product.isSale && (
                <CardItem translateZ={60}>
                  <Badge variant="error">{t('shop.badges.sale')}</Badge>
                </CardItem>
              )}
            </div>

            {/* 3D Add to cart — lifts on hover */}
            <CardItem
              translateZ={80}
              className="pointer-events-none absolute inset-x-3 bottom-3 z-20 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
            >
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-background/90 px-3 py-2.5 text-sm font-semibold text-foreground shadow-lg shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:scale-[1.03] hover:border-accent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="shrink-0 drop-shadow-sm"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>{t('product.addToCart', { defaultValue: 'Add to Cart' })}</span>
              </button>
            </CardItem>
          </div>

          <CardItem translateZ={30} className="mt-3 space-y-1 px-0.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/90">
              {product.brand}
            </p>
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-base line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tabular-nums">${displayPrice}</span>
              {product.salePrice != null && (
                <span className="text-sm text-muted-foreground line-through tabular-nums">
                  ${product.price}
                </span>
              )}
            </div>
          </CardItem>
        </Link>
      </CardBody>
    </CardContainer>
  );
}
