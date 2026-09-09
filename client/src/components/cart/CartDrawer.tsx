import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartSubtotal,
  selectIsCartOpen,
} from '@/features/cart/cartSlice';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCartOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const isAr = i18n.language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => dispatch(closeCart())}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">
            {t('cart.title')} ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button
            type="button"
            onClick={() => dispatch(closeCart())}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground">{t('cart.empty')}</p>
            <Button variant="outline" onClick={() => dispatch(closeCart())}>
              <Link to="/shop">{t('cart.continueShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <div className="h-full w-full bg-gradient-to-br from-surface via-muted to-accent/10" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium line-clamp-1">
                            {isAr ? item.nameAr : item.nameEn}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {[item.color, item.size].filter(Boolean).join(' / ')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-muted-foreground hover:text-error"
                          aria-label="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded border border-border text-sm"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                            }
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded border border-border text-sm"
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-medium">
                          ${((item.salePrice ?? item.price) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-5 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="font-semibold">${subtotal.toFixed(0)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('cart.shippingNote')}</p>
              <Button size="lg" fullWidth onClick={() => dispatch(closeCart())}>
                <Link to="/checkout" className="w-full text-center">
                  {t('cart.checkout')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={() => dispatch(closeCart())}>
                <Link to="/shop">{t('cart.continueShopping')}</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
