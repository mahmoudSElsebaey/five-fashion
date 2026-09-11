import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ColorSelector } from '@/components/product/ColorSelector';
import { Product3DViewer } from '@/components/3d/Product3DViewer';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Seo } from '@/components/seo/Seo';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { useDispatch } from 'react-redux';
import { addToCartSmart } from '@/features/cart/cartCommerce';
import { toggleWishlistSmart } from '@/features/wishlist/wishlistCommerce';
import type { AppDispatch } from '@/store';
import { store } from '@/store';

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** SECTION 06 + 12 + 14 — PDP with reviews and Product JSON-LD */
export function ProductDetailPage() {
  const { id: param } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeHint, setSizeHint] = useState(false);
  const [related, setRelated] = useState<UiProduct[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!param) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      setProduct(null);
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
      try {
        const res = OBJECT_ID_RE.test(param)
          ? await productsApi.getById(param)
          : await productsApi.getBySlug(param);
        if (cancelled) return;
        const mapped = mapApiProduct(res.data as ApiProduct);
        setProduct(mapped);
        if (mapped.colors.length === 1) setSelectedColor(mapped.colors[0]);
      } catch (e) {
        if (!cancelled && !OBJECT_ID_RE.test(param)) {
          try {
            const res = await productsApi.getById(param);
            if (cancelled) return;
            const mapped = mapApiProduct(res.data as ApiProduct);
            setProduct(mapped);
            if (mapped.colors.length === 1) setSelectedColor(mapped.colors[0]);
            return;
          } catch {
            /* fall through */
          }
        }
        if (!cancelled) {
          setProduct(null);
          setLoadError(e instanceof Error ? e.message : 'Not found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [param, reloadKey]);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    (async () => {
      try {
        const params: Record<string, string | number | boolean | undefined> = { limit: 8 };
        if (product.category) params.category = product.category;
        const res = await productsApi.list(params);
        if (cancelled) return;
        let list = ((res.data || []) as ApiProduct[])
          .map(mapApiProduct)
          .filter((p) => p.id !== product.id);
        if (list.length < 4) {
          const extra = await productsApi.list({ limit: 8 });
          if (cancelled) return;
          const more = ((extra.data || []) as ApiProduct[])
            .map(mapApiProduct)
            .filter((p) => p.id !== product.id && !list.some((x) => x.id === p.id));
          list = [...list, ...more];
        }
        setRelated(list.slice(0, 4));
      } catch {
        if (!cancelled) setRelated([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loadError ? (
          <ErrorState
            title={t('product.notFound')}
            message={loadError}
            retryLabel={t('product.backToShop')}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : (
          <EmptyState
            title={t('product.notFound')}
            description={t('product.notFoundDesc', {
              defaultValue: 'This piece may have been removed or the link is incorrect.',
            })}
            actionLabel={t('product.backToShop')}
            actionTo="/shop"
          />
        )}
      </div>
    );
  }

  const name = isAr ? product.nameAr : product.nameEn;
  const description =
    (isAr ? product.descriptionAr : product.descriptionEn) ||
    t('product.descriptionPlaceholder');
  const displayPrice = product.salePrice ?? product.price;
  const maxQty = Math.max(1, product.stock ?? 99);
  const outOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const reviewCount = product.reviewCount ?? 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeHint(true);
      return;
    }
    setSizeHint(false);
    void addToCartSmart(dispatch, store.getState, {
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      image: product.images?.[0],
    }).then(() => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    });
  };

  const handleToggleWishlist = () => {
    void toggleWishlistSmart(dispatch, store.getState, {
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      salePrice: product.salePrice,
      brand: product.brand,
      image: product.images?.[0],
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={name}
        description={`${name} — ${product.brand} | FIVE Fashion luxury`}
        image={product.images?.[0]}
        type="product"
      />
      <ProductJsonLd
        name={name}
        description={description}
        image={product.images}
        sku={product.sku}
        brand={product.brand}
        price={displayPrice}
        availability={outOfStock ? 'OutOfStock' : 'InStock'}
      />

      <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">
          {t('nav.home')}
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-foreground">
          {t('nav.shop')}
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-foreground capitalize"
            >
              {product.category.replace(/-/g, ' ')}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={name} />

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap gap-2">
            {product.isNew && <Badge variant="accent">{t('shop.badges.new')}</Badge>}
            {product.isSale && <Badge variant="error">{t('shop.badges.sale')}</Badge>}
            {outOfStock && (
              <Badge variant="error">{t('product.outOfStock', { defaultValue: 'Out of stock' })}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">${displayPrice}</span>
            {product.salePrice && (
              <span className="text-lg text-muted-foreground line-through">${product.price}</span>
            )}
          </div>

          {(product.rating > 0 || reviewCount > 0) && (
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-accent" aria-hidden>
                ★
              </span>
              <span>{product.rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <>
                  <span>·</span>
                  <span>{t('product.reviews', { count: reviewCount })}</span>
                </>
              )}
            </div>
          )}

          <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>

          <div className="mt-8 space-y-6">
            {product.colors.length > 0 && (
              <ColorSelector colors={product.colors} selected={selectedColor} onChange={setSelectedColor} />
            )}

            {product.sizes.length > 0 && (
              <div>
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onChange={(s) => {
                    setSelectedSize(s);
                    setSizeHint(false);
                  }}
                />
                {sizeHint && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {t('product.selectSize', { defaultValue: 'Please select a size' })}
                  </p>
                )}
              </div>
            )}

            <div>
              <h3 className="mb-3 text-sm font-semibold tracking-wide">{t('product.quantity')}</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg hover:bg-surface-hover"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg hover:bg-surface-hover"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQty}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
              {outOfStock
                ? t('product.outOfStock', { defaultValue: 'Out of stock' })
                : addedToCart
                  ? t('product.added')
                  : t('product.addToCart')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="sm:w-14"
              aria-label={t('product.wishlist', { defaultValue: 'Wishlist' })}
              onClick={handleToggleWishlist}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Button>
          </div>

          <div className="mt-10">
            <h3 className="mb-3 text-sm font-semibold tracking-wide">{t('product.view3d')}</h3>
            <Product3DViewer className="h-56 w-full border border-border" modelUrl={product.modelUrl} />
          </div>

          <div className="mt-8 space-y-4 border-t border-border pt-8">
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-semibold tracking-wide">
                {t('product.details')}
              </summary>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground leading-relaxed">
                {product.sku && <p>SKU: {product.sku}</p>}
                <p className="capitalize">
                  {t('shop.filters.category')}: {product.category.replace(/-/g, ' ') || '—'}
                </p>
                <p>{t('product.detailsContent')}</p>
              </div>
            </details>
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-semibold tracking-wide">
                {t('product.shipping')}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t('product.shippingContent')}
              </p>
            </details>
          </div>
        </div>
      </div>

      {product.id && <ProductReviews productId={product.id} />}

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">
            {t('product.related')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
