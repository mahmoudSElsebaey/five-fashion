import type { AppDispatch, RootState } from '@/store';
import { wishlistApi } from '@/services/apiClient';
import {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  replaceWishlist,
  setWishlistServerSynced,
  type WishlistItem,
} from './wishlistSlice';

type ApiProduct = {
  _id?: string;
  name?: { en?: string; ar?: string };
  price?: number;
  compareAtPrice?: number;
  brand?: string;
  images?: string[];
  image?: string;
};

type ApiWishlist = {
  products?: ApiProduct[];
};

function mapServerWishlist(data: unknown): WishlistItem[] {
  const wl = data as ApiWishlist;
  if (!wl?.products) return [];
  return wl.products
    .filter((p) => p && p._id)
    .map((p) => {
      const price = p.price ?? 0;
      const sale =
        p.compareAtPrice && p.compareAtPrice > price ? price : undefined;
      const image = p.images?.find((value) => typeof value === 'string' && value.trim()) || p.image;
      return {
        productId: String(p._id),
        nameEn: p.name?.en || '',
        nameAr: p.name?.ar || '',
        price: sale ? p.compareAtPrice! : price,
        salePrice: sale,
        brand: p.brand || 'FIVE',
        image,
      };
    });
}

export async function syncWishlistAfterLogin(
  dispatch: AppDispatch,
  getState: () => RootState
) {
  const guestItems = getState().wishlist.items;
  try {
    for (const item of guestItems) {
      try {
        await wishlistApi.add(item.productId);
      } catch {
        /* skip invalid */
      }
    }
    const res = await wishlistApi.get();
    dispatch(replaceWishlist(mapServerWishlist(res.data)));
  } catch {
    dispatch(setWishlistServerSynced(false));
  }
}

export async function loadServerWishlist(dispatch: AppDispatch) {
  try {
    const res = await wishlistApi.get();
    dispatch(replaceWishlist(mapServerWishlist(res.data)));
  } catch {
    dispatch(setWishlistServerSynced(false));
  }
}

export function resetWishlistToGuest(dispatch: AppDispatch) {
  dispatch(clearWishlist());
  dispatch(setWishlistServerSynced(false));
  localStorage.removeItem('five-wishlist');
}

export async function toggleWishlistSmart(
  dispatch: AppDispatch,
  getState: () => RootState,
  item: WishlistItem
) {
  const state = getState();
  const inList = state.wishlist.items.some((i) => i.productId === item.productId);
  if (!state.auth.isAuthenticated) {
    dispatch(toggleWishlist(item));
    return;
  }
  try {
    if (inList) {
      const res = await wishlistApi.remove(item.productId);
      dispatch(replaceWishlist(mapServerWishlist(res.data)));
    } else {
      const res = await wishlistApi.add(item.productId);
      dispatch(replaceWishlist(mapServerWishlist(res.data)));
    }
  } catch {
    dispatch(toggleWishlist(item));
  }
}

export async function removeFromWishlistSmart(
  dispatch: AppDispatch,
  getState: () => RootState,
  productId: string
) {
  const state = getState();
  if (!state.auth.isAuthenticated || !state.wishlist.serverSynced) {
    dispatch(removeFromWishlist(productId));
    return;
  }
  try {
    const res = await wishlistApi.remove(productId);
    dispatch(replaceWishlist(mapServerWishlist(res.data)));
  } catch {
    dispatch(removeFromWishlist(productId));
  }
}
