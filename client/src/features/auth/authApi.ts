const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    user?: { id: string; name: string; email: string; role: string };
    accessToken?: string;
    refreshToken?: string;
  };
};

async function request(path: string, options: RequestInit = {}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  refresh: (refreshToken: string) =>
    request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (accessToken: string) =>
    request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  getMe: (accessToken: string) =>
    request('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};
