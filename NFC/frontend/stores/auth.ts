import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  location?: string;
  sports?: string[];
  goals?: string[];
  socials?: { instagram?: string; strava?: string; website?: string };
  publicProfile?: boolean;
  role?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
    ready: false,
  }),
  getters: {
    isLogged: (state) => !!state.token && !!state.user,
  },
  actions: {
    persist() {
      if (process.client) {
        if (this.token) localStorage.setItem('pulse_token', this.token);
        else localStorage.removeItem('pulse_token');
      }
    },
    async restore() {
      if (this.ready) return;
      if (process.client) {
        const t = localStorage.getItem('pulse_token');
        if (t) {
          this.token = t;
          try {
            const config = useRuntimeConfig();
            const res = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/me`, {
              headers: { Authorization: `Bearer ${t}` },
            });
            this.user = res.user;
          } catch {
            this.token = '';
            this.persist();
          }
        }
      }
      this.ready = true;
    },
    async login(email: string, password: string) {
      const config = useRuntimeConfig();
      const res = await $fetch<{ token: string; user: User }>(
        `${config.public.apiBase}/auth/login`,
        {
          method: 'POST',
          body: { email, password },
        }
      );
      this.token = res.token;
      this.user = res.user;
      this.persist();
    },
    async register(payload: {
      email: string;
      password: string;
      handle: string;
      displayName: string;
    }) {
      const config = useRuntimeConfig();
      const res = await $fetch<{ token: string; user: User }>(
        `${config.public.apiBase}/auth/register`,
        {
          method: 'POST',
          body: payload,
        }
      );
      this.token = res.token;
      this.user = res.user;
      this.persist();
    },
    logout() {
      this.token = '';
      this.user = null;
      this.persist();
    },
    async updateMe(patch: Partial<User>) {
      const api = useApi();
      const res = await api.patch<{ user: User }>('/users/me', patch);
      this.user = res.user;
    },
  },
});
