<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();

const items = [
  { to: '/app/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/app/activities', label: 'Activités', icon: 'pulse' },
  { to: '/app/bracelets', label: 'Bracelets NFC', icon: 'ring' },
  { to: '/app/profile', label: 'Profil', icon: 'user' },
  { to: '/app/orders', label: 'Commandes', icon: 'box' },
];
const route = useRoute();
function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`);
}

function logout() {
  auth.logout();
  navigateTo('/');
}
</script>

<template>
  <aside class="hidden lg:flex w-64 shrink-0 flex-col gap-3 p-4">
    <div class="glass p-4">
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center font-bold text-ink-950"
        >
          {{ auth.user?.displayName?.[0]?.toUpperCase() }}
        </div>
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold">{{ auth.user?.displayName }}</div>
          <div class="truncate text-xs text-white/50">@{{ auth.user?.handle }}</div>
        </div>
      </div>
      <NuxtLink
        :to="`/u/${auth.user?.handle}`"
        class="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
      >
        Voir mon profil public
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </NuxtLink>
    </div>

    <nav class="glass p-2">
      <NuxtLink
        v-for="i in items"
        :key="i.to"
        :to="i.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
        :class="
          isActive(i.to)
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        "
      >
        <span
          class="h-2 w-2 rounded-full transition-all"
          :class="isActive(i.to) ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,230,241,0.8)]' : 'bg-white/20'"
        />
        {{ i.label }}
      </NuxtLink>
    </nav>

    <button
      class="glass mt-auto p-3 text-left text-sm text-white/70 hover:text-white"
      @click="logout"
    >
      Se déconnecter
    </button>
  </aside>
</template>
