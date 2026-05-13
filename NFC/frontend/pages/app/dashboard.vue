<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: 'auth', layout: 'app' });
useSeoMeta({ title: 'Dashboard — PULSE' });

const auth = useAuthStore();
const api = useApi();

const { data: stats, refresh } = useAsyncData('stats', async () => {
  try {
    return await api.get<any>('/users/me/stats');
  } catch {
    return null;
  }
});

const { data: bracelets } = useAsyncData('dashboard-bracelets', async () => {
  try {
    const r = await api.get<{ items: any[] }>('/bracelets');
    return r.items;
  } catch {
    return [];
  }
});

const heatmap = computed(() => {
  const recent = stats.value?.recent || [];
  const map = new Map<string, number>();
  recent.forEach((a: any) => {
    const d = new Date(a.performedAt).toISOString().slice(0, 10);
    map.set(d, (map.get(d) || 0) + 1);
  });
  const days = [];
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, count: map.get(key) || 0 });
  }
  return days;
});
</script>

<template>
  <div class="space-y-6">
    <header class="glass-strong relative overflow-hidden p-8">
      <div class="absolute inset-0 bg-aurora opacity-30" />
      <div class="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Bonjour</p>
          <h1 class="mt-2 text-4xl font-bold">{{ auth.user?.displayName }}</h1>
          <p class="mt-1 text-white/60">Bienvenue sur ton espace PULSE.</p>
        </div>
        <NuxtLink :to="`/u/${auth.user?.handle}`" class="btn-ghost" target="_blank">
          Voir mon profil public
        </NuxtLink>
      </div>
    </header>

    <section class="grid gap-4 md:grid-cols-4">
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Activités</div>
        <div class="mt-2 text-3xl font-bold gradient-text">{{ stats?.activityCount || 0 }}</div>
      </div>
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Distance</div>
        <div class="mt-2 text-3xl font-bold gradient-text">
          {{ Math.round(stats?.totals?.distanceKm || 0) }} km
        </div>
      </div>
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Calories</div>
        <div class="mt-2 text-3xl font-bold gradient-text">
          {{ stats?.totals?.calories || 0 }}
        </div>
      </div>
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Taps NFC</div>
        <div class="mt-2 text-3xl font-bold gradient-text">{{ stats?.totalTaps || 0 }}</div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <div class="glass p-6 lg:col-span-2">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Activité 14 derniers jours</h3>
          <span class="chip">{{ heatmap.filter((d) => d.count).length }} jours actifs</span>
        </div>
        <div class="mt-6 grid grid-cols-14 gap-1.5">
          <div
            v-for="d in heatmap"
            :key="d.key"
            class="aspect-square rounded-md transition-colors"
            :class="
              d.count === 0
                ? 'bg-white/[0.04]'
                : d.count === 1
                ? 'bg-cyan-400/30'
                : d.count === 2
                ? 'bg-cyan-400/60'
                : 'bg-cyan-400 shadow-[0_0_12px_rgba(34,230,241,0.7)]'
            "
            :title="`${d.key} — ${d.count} séances`"
          />
        </div>
        <div class="mt-4 flex items-center gap-2 text-xs text-white/40">
          <span>Moins</span>
          <span class="h-3 w-3 rounded-sm bg-white/[0.04]" />
          <span class="h-3 w-3 rounded-sm bg-cyan-400/30" />
          <span class="h-3 w-3 rounded-sm bg-cyan-400/60" />
          <span class="h-3 w-3 rounded-sm bg-cyan-400" />
          <span>Plus</span>
        </div>
      </div>

      <div class="glass p-6">
        <h3 class="font-semibold">Mes bracelets</h3>
        <div v-if="bracelets && bracelets.length" class="mt-4 space-y-3">
          <NuxtLink
            v-for="b in bracelets"
            :key="b.id"
            to="/app/bracelets"
            class="glass p-4 flex items-center gap-3 hover:bg-white/[0.06] transition-colors"
          >
            <div
              class="h-10 w-10 rounded-full"
              :style="{
                background:
                  'linear-gradient(135deg, #5dfaff, #9b6cff)',
              }"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold truncate">{{ b.nickname }}</div>
              <div class="text-xs text-white/40 font-mono">{{ b.tagId }}</div>
            </div>
            <span class="chip text-[10px]">{{ b.tapCount }} taps</span>
          </NuxtLink>
        </div>
        <div v-else class="mt-4 glass p-4 text-sm text-white/60">
          Aucun bracelet associé.
          <NuxtLink to="/app/bracelets" class="text-cyan-300">En ajouter un</NuxtLink>
        </div>
      </div>
    </section>

    <section class="glass p-6">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Dernières activités</h3>
        <NuxtLink to="/app/activities" class="text-sm text-cyan-300 hover:text-cyan-200">
          Tout voir →
        </NuxtLink>
      </div>
      <div v-if="stats?.recent?.length" class="mt-4 grid gap-3">
        <div
          v-for="a in stats.recent"
          :key="a._id"
          class="glass p-4 flex items-center gap-4"
        >
          <div class="h-10 w-10 rounded-xl bg-cyan-400/10 grid place-items-center text-cyan-300">
            <IconRender name="pulse" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">{{ a.title }}</div>
            <div class="text-xs text-white/50 capitalize">
              {{ a.type }} · {{ formatRelative(a.performedAt) }}
            </div>
          </div>
          <div class="hidden sm:block text-sm text-white/70 font-mono">
            {{ formatDuration(a.durationMin) }}
            <span v-if="a.distanceKm > 0" class="text-white/40"> · {{ a.distanceKm }} km</span>
          </div>
        </div>
      </div>
      <div v-else class="mt-4 text-sm text-white/60">
        Aucune activité encore. <NuxtLink to="/app/activities" class="text-cyan-300">Ajouter ta première séance</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid-cols-14 {
  grid-template-columns: repeat(14, minmax(0, 1fr));
}
</style>
