import { useAuthStore } from '~/stores/auth';

export function useApi() {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  async function request<T = any>(path: string, options: any = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (auth.token) headers.Authorization = `Bearer ${auth.token}`;

    return await $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers,
    });
  }

  return {
    get: <T = any>(path: string, options: any = {}) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T = any>(path: string, body?: any, options: any = {}) =>
      request<T>(path, { ...options, method: 'POST', body }),
    patch: <T = any>(path: string, body?: any, options: any = {}) =>
      request<T>(path, { ...options, method: 'PATCH', body }),
    del: <T = any>(path: string, options: any = {}) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
}
