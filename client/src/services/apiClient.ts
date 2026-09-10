const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: ApiMeta;
  errors?: unknown;
};

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('five-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.accessToken || null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  let data: ApiResponse<T> = { success: false };
  try {
    data = await res.json();
  } catch {
    /* empty */
  }
  if (!res.ok) {
    throw new ApiError(data.message || 'Request failed', res.status, data);
  }
  return data;
}

export const productsApi = {
  list: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) q.set(k, String(v));
    });
    const qs = q.toString();
    return apiRequest<unknown[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/products/${id}`),
  getBySlug: (slug: string) => apiRequest<unknown>(`/products/slug/${slug}`),
};

export const categoriesApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v));
    });
    const qs = q.toString();
    return apiRequest<unknown[]>(`/categories${qs ? `?${qs}` : ''}`);
  },
};

export const collectionsApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v));
    });
    const qs = q.toString();
    return apiRequest<unknown[]>(`/collections${qs ? `?${qs}` : ''}`);
  },
};

export const cartApi = {
  get: () => apiRequest<unknown>('/cart', {}, true),
  addItem: (body: { productId: string; quantity?: number; size?: string; color?: string }) =>
    apiRequest<unknown>('/cart/items', { method: 'POST', body: JSON.stringify(body) }, true),
  updateItem: (itemId: string, quantity: number) =>
    apiRequest<unknown>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }, true),
  removeItem: (itemId: string) =>
    apiRequest<unknown>(`/cart/items/${itemId}`, { method: 'DELETE' }, true),
  clear: () => apiRequest<unknown>('/cart', { method: 'DELETE' }, true),
  merge: (items: unknown[]) =>
    apiRequest<unknown>('/cart/merge', { method: 'POST', body: JSON.stringify({ items }) }, true),
};

export const wishlistApi = {
  get: () => apiRequest<unknown>('/wishlist', {}, true),
  add: (productId: string) =>
    apiRequest<unknown>('/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }, true),
  remove: (productId: string) =>
    apiRequest<unknown>(`/wishlist/items/${productId}`, { method: 'DELETE' }, true),
  clear: () => apiRequest<unknown>('/wishlist', { method: 'DELETE' }, true),
};

export const ordersApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v));
    });
    const qs = q.toString();
    return apiRequest<unknown[]>(`/orders${qs ? `?${qs}` : ''}`, {}, true);
  },
  getById: (id: string) => apiRequest<unknown>(`/orders/${id}`, {}, true),
  create: (body: unknown) =>
    apiRequest<unknown>('/orders', { method: 'POST', body: JSON.stringify(body) }, true),
  cancel: (id: string) =>
    apiRequest<unknown>(`/orders/${id}/cancel`, { method: 'POST' }, true),
};

export const couponsApi = {
  validate: (code: string) => apiRequest<unknown>(`/coupons/${encodeURIComponent(code)}`),
};

export const addressesApi = {
  list: () => apiRequest<unknown[]>('/addresses', {}, true),
  create: (body: unknown) =>
    apiRequest<unknown>('/addresses', { method: 'POST', body: JSON.stringify(body) }, true),
  update: (id: string, body: unknown) =>
    apiRequest<unknown>(`/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, true),
  remove: (id: string) =>
    apiRequest<unknown>(`/addresses/${id}`, { method: 'DELETE' }, true),
  setDefault: (id: string) =>
    apiRequest<unknown>(`/addresses/${id}/default`, { method: 'POST' }, true),
};

export const reviewsApi = {
  listForProduct: (productId: string, page = 1) =>
    apiRequest<unknown[]>(`/reviews/product/${productId}?page=${page}`),
  create: (body: { productId: string; rating: number; title?: string; comment?: string }) =>
    apiRequest<unknown>('/reviews', { method: 'POST', body: JSON.stringify(body) }, true),
};
