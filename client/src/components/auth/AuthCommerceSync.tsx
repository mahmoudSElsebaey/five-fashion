import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { store } from '@/store';
import {
  syncCartAfterLogin,
  loadServerCart,
  resetCartToGuest,
} from '@/features/cart/cartCommerce';
import {
  syncWishlistAfterLogin,
  loadServerWishlist,
  resetWishlistToGuest,
} from '@/features/wishlist/wishlistCommerce';

/**
 * Keeps cart/wishlist in sync with the backend for authenticated users.
 * Guest state stays in localStorage via the slices.
 */
export function AuthCommerceSync() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const prevAuth = useRef<boolean | null>(null);

  useEffect(() => {
    const wasAuth = prevAuth.current;
    prevAuth.current = isAuthenticated;
    const getState = () => store.getState();

    if (isAuthenticated) {
      if (wasAuth === false) {
        void (async () => {
          await syncCartAfterLogin(dispatch, getState);
          await syncWishlistAfterLogin(dispatch, getState);
        })();
      } else if (wasAuth === null) {
        void loadServerCart(dispatch);
        void loadServerWishlist(dispatch);
      }
    } else if (wasAuth === true) {
      resetCartToGuest(dispatch);
      resetWishlistToGuest(dispatch);
    }
  }, [isAuthenticated, dispatch]);

  return null;
}
