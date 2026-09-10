import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectWishlistItems } from '@/features/wishlist/wishlistSlice';
import { removeFromWishlistSmart } from '@/features/wishlist/wishlistCommerce';
import type { AppDispatch } from '@/store';
import { store } from '@/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function WishlistPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectWishlistItems);
  const isAr = i18n.language === 'ar';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('wishlist.title')}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t('wishlist.subtitle', { count: items.length })}
      </p>

      {items.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <p className="text-muted-foreground">{t('wishlist.empty')}</p>
          <Link to="/shop" className="mt-6">
            <Button variant="outline">{t('wishlist.browse')}</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden border-0 bg-transparent shadow-none">
              <Link to={`/product/${item.productId}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10" />
                </div>
              </Link>
              <CardContent className="mt-3 space-y-1 px-0">
                <p className="text-xs text-muted-foreground">{item.brand}</p>
                <Link to={`/product/${item.productId}`}>
                  <h3 className="font-medium line-clamp-1">
                    {isAr ? item.nameAr : item.nameEn}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ${item.salePrice ?? item.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => void removeFromWishlistSmart(dispatch, store.getState, item.productId)}
                    className="text-xs text-muted-foreground hover:text-error"
                  >
                    {t('wishlist.remove')}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
