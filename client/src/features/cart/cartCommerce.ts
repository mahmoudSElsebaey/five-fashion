import type { AppDispatch, RootState } from '@/store';
import { cartApi } from '@/services/apiClient';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  replaceCart,
  setCartServerSynced,
  openCart,
  type CartItem,
} from './cartSlice';

type ApiCartProduct = {
  _id?: string;
  name?: { en?: string; ar?: string };
  price?: number;
  compareAtPrice?: number;
  images?: string[];
};

type ApiCartItem = {
  _id?: string;
  product?: ApiCartProduct | string;
  quantity?: number;
  size?: string;
  color?: string;
};

type ApiCart = {
  items?: ApiCartItem[];
};

function mapServerCart(data: unknown): CartItem[] {
  const cart = data as ApiCart;
  if (!cart?.items) return [];
  return cart.items.map((item) => {
    const product =
      typeof item.product === 'object' && item.product
        ? item.product
        : ({} as ApiCartProduct);
    const productId =
      typeof item.product === 'string'
        ? item.product
        : String(product._id || '');
    const price = product.price ?? 0;
    const sale =
      product.compareAtPrice && product.compareAtPrice > price
        ? price
        : undefined;
    return {
      id: String(item._id || `${productId}-${item.size || 'os'}-${item.color || 'def'}`),
      productId,
      nameEn: product.name?.en || '',
      nameAr: product.name?.ar || '',
      price: sale ? product.compareAtPrice! : price,
      salePrice: sale,
      quantity: item.quantity ?? 1,
      size: item.size,
      color: item.color,
      image: product.images?.[0],
    };
  });
}

export async function syncCartAfterLogin(
  dispatch: AppDispatch,
  getState: () => RootState
) {
  const guestItems = getState().cart.items;
  try {
    if (guestItems.length > 0) {
      await cartApi.merge(
        guestItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        }))
      );
    }
    const res = await cartApi.get();
    dispatch(replaceCart(mapServerCart(res.data)));
  } catch {
    dispatch(setCartServerSynced(false));
  }
}

export async function loadServerCart(dispatch: AppDispatch) {
  try {
    const res = await cartApi.get();
    dispatch(replaceCart(mapServerCart(res.data)));
  } catch {
    dispatch(setCartServerSynced(false));
  }
}

export function resetCartToGuest(dispatch: AppDispatch) {
  dispatch(clearCart());
  dispatch(setCartServerSynced(false));
  localStorage.removeItem('five-cart');
}

export async function addToCartSmart(
  dispatch: AppDispatch,
  getState: () => RootState,
  item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }
) {
  const auth = getState().auth.isAuthenticated;
  if (!auth) {
    dispatch(addToCart(item));
    return;
  }
  try {
    const res = await cartApi.addItem({
      productId: item.productId,
      quantity: item.quantity ?? 1,
      size: item.size,
      color: item.color,
    });
    dispatch(replaceCart(mapServerCart(res.data)));
    dispatch(openCart());
  } catch {
    dispatch(addToCart(item));
  }
}

export async function removeFromCartSmart(
  dispatch: AppDispatch,
  getState: () => RootState,
  itemId: string
) {
  const state = getState();
  if (!state.auth.isAuthenticated || !state.cart.serverSynced) {
    dispatch(removeFromCart(itemId));
    return;
  }
  try {
    const res = await cartApi.removeItem(itemId);
    dispatch(replaceCart(mapServerCart(res.data)));
  } catch {
    dispatch(removeFromCart(itemId));
  }
}

export async function updateQuantitySmart(
  dispatch: AppDispatch,
  getState: () => RootState,
  itemId: string,
  quantity: number
) {
  const state = getState();
  if (!state.auth.isAuthenticated || !state.cart.serverSynced) {
    dispatch(updateQuantity({ id: itemId, quantity }));
    return;
  }
  try {
    const res = await cartApi.updateItem(itemId, quantity);
    dispatch(replaceCart(mapServerCart(res.data)));
  } catch {
    dispatch(updateQuantity({ id: itemId, quantity }));
  }
}

export async function clearCartSmart(dispatch: AppDispatch, getState: () => RootState) {
  const state = getState();
  if (!state.auth.isAuthenticated || !state.cart.serverSynced) {
    dispatch(clearCart());
    return;
  }
  try {
    await cartApi.clear();
    dispatch(clearCart());
    dispatch(setCartServerSynced(true));
  } catch {
    dispatch(clearCart());
  }
}
