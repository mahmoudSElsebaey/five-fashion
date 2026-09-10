import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ColorSelector } from '@/components/product/ColorSelector';
import { Product3DViewer } from '@/components/3d/Product3DViewer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import { productsApi } from '@/services/apiClient';
import { mapApiProduct, type ApiProduct, type UiProduct } from '@/types/product';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { useDispatch } from 'react-redux';
import { addToCartSmart } from '@/features/cart/cartCommerce';
import { toggleWishlistSmart } from '@/features/wishlist/wishlistCommerce';
import type { AppDispatch } from '@/store';
import { store } from '@/store';
import { Seo } from '@/components/seo/Seo';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await productsApi.getById(id);
        if (cancelled) return;
        setProduct(mapApiProduct(res.data as ApiProduct));
      } catch (e) {
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
  }, [id]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const [related, setRelated] = useState<UiProduct[]>([]);
  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await productsApi.list({ limit: 8 });
        if (cancelled) return;
        const list = ((res.data || []) as ApiProduct[])
          .map(mapApiProduct)
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        setRelated(list);
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold">{t('product.notFound')}</h1>
        {loadError && <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>}
        <Button className="mt-6" variant="outline">
          <Link to="/shop">{t('product.backToShop')}</Link>
        </Button>
      </div>
    );
  }

  const name = isAr ? product.nameAr : product.nameEn;
  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) return;
    void addToCartSmart(dispatch, store.getState, {
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
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
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-foreground">{t('nav.shop')}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={name} />

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap gap-2">
            {product.isNew && <Badge variant="accent">{t('shop.badges.new')}</Badge>}
            {product.isSale && <Badge variant="error">{t('shop.badges.sale')}</Badge>}
          </div>

          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">${displayPrice}</span>
            {product.salePrice && (
              <span className="text-lg text-muted-foreground line-through">${product.price}</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-accent">★</span>
            <span>{product.rating}</span>
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{t('product.descriptionPlaceholder')}</p>

          <div className="mt-8 space-y-6">
            <ColorSelector colors={product.colors} selected={selectedColor} onChange={setSelectedColor} />
            <SizeSelector sizes={product.sizes} selected={selectedSize} onChange={setSelectedSize} />
            <div>
              <h3 className="mb-3 text-sm font-semibold tracking-wide">{t('product.quantity')}</h3>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg hover:bg-surface-hover">−</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg hover:bg-surface-hover">+</button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.sizes.length > 0 && !selectedSize}>
              {addedToCart ? t('product.added') : t('product.addToCart')}
            </Button>
            <Button size="lg" variant="outline" className="sm:w-14" aria-label="Wishlist" onClick={handleToggleWishlist}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </Button>
          </div>

          <div className="mt-10">
            <h3 className="mb-3 text-sm font-semibold tracking-wide">{t('product.view3d')}</h3>
            <Product3DViewer className="h-56 w-full border border-border" />
          </div>

          <div className="mt-8 space-y-4 border-t border-border pt-8">
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-semibold tracking-wide">{t('product.details')}</summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('product.detailsContent')}</p>
            </details>
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-semibold tracking-wide">{t('product.shipping')}</summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('product.shippingContent')}</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">{t('product.related')}</h2>
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
