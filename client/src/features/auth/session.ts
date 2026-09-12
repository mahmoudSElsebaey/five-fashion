import { store } from '@/store';
import { authApi } from '@/features/auth/authApi';
import { logout, setCredentials, setTokens, updateUser } from '@/features/auth/authSlice';
import type { AuthUser } from '@/features/auth/authSlice';

type StoredAuth = {
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};

function readStorage(): StoredAuth {
  try {
    const raw = localStorage.getItem('five-auth');
    if (!raw) return {};
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return {};
  }
}

export function getAccessToken(): string | null {
  return readStorage().accessToken || null;
}

export function getRefreshToken(): string | null {
  return readStorage().refreshToken || null;
}

/** Single-flight refresh so parallel 401s only hit the API once. */
let refreshInFlight: Promise<boolean> | null = null;

export async function refreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      store.dispatch(logout());
      return false;
    }
    try {
      const res = await authApi.refresh(refreshToken);
      const accessToken = res.data?.accessToken;
      const nextRefresh = res.data?.refreshToken;
      if (!accessToken || !nextRefresh) {
        store.dispatch(logout());
        return false;
      }
      store.dispatch(setTokens({ accessToken, refreshToken: nextRefresh }));
      return true;
    } catch {
      store.dispatch(logout());
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function normalizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  // login: { user: {...} } — getMe: { id, name, email, role }
  const src = (o.user && typeof o.user === 'object' ? o.user : o) as Record<string, unknown>;
  const id = String(src.id ?? src._id ?? '');
  const name = String(src.name ?? '');
  const email = String(src.email ?? '');
  const role = String(src.role ?? 'customer');
  if (!id || !email) return null;
  return { id, name, email, role };
}

/**
 * On app start: validate access token via /auth/me.
 * If expired, try refresh once. If that fails, clear the session
 * so the UI does not look "logged in" with a dead token.
 */
export async function bootstrapSession(): Promise<void> {
  const stored = readStorage();
  if (!stored.accessToken && !stored.refreshToken) return;

  const applyUser = (user: AuthUser, accessToken: string, refreshToken: string) => {
    store.dispatch(setCredentials({ user, accessToken, refreshToken }));
  };

  try {
    if (stored.accessToken) {
      const res = await authApi.getMe(stored.accessToken);
      const user = normalizeUser(res.data) || stored.user || null;
      if (user && stored.refreshToken) {
        applyUser(user, stored.accessToken, stored.refreshToken);
        return;
      }
      if (user) {
        store.dispatch(updateUser(user));
        return;
      }
    }
  } catch {
    /* try refresh below */
  }

  const ok = await refreshSession();
  if (!ok) return;

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) {
    store.dispatch(logout());
    return;
  }

  try {
    const res = await authApi.getMe(accessToken);
    const user = normalizeUser(res.data) || stored.user;
    if (user) {
      applyUser(user, accessToken, refreshToken);
    } else {
      store.dispatch(logout());
    }
  } catch {
    store.dispatch(logout());
  }
}
