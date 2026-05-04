<script setup lang="ts">
const route = useRoute();
const api = useApi();

const { data, error } = useAsyncData(`profile-${route.params.handle}`, async () => {
  try {
    return await api.get<any>(`/public/profile/${route.params.handle}`);
  } catch (err: any) {
    throw createError({
      statusCode: err?.status || 404,
      statusMessage: err?.data?.error?.message || 'Profil introuvable',
    });
  }
});

const profile = computed(() => data.value?.profile);
const totals = computed(() => data.value?.totals || {});
const activities = computed(() => data.value?.activities || []);

useSeoMeta({
  title: profile.value ? `${profile.value.displayName} — PULSE` : 'Profil PULSE',
  description: profile.value?.bio || 'Profil public PULSE.',
});

const initial = computed(() => profile.value?.displayName?.[0]?.toUpperCase() || '?');
</script>

<template>
  <section v-if="profile" class="container-pulse py-12">
    <div class="glass-strong relative overflow-hidden">
      <div
        class="h-44 bg-aurora relative"
        :style="profile.bannerUrl ? `background-image:url('${profile.bannerUrl}'); background-size:cover; background-position:center` : ''"
      >
        <div class="absolute inset-0 grid-bg opacity-50" />
      </div>
      <div class="px-6 lg:px-10 pb-8 -mt-14 relative">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div class="flex items-end gap-4">
            <div
              class="h-28 w-28 rounded-2xl glow-ring bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-5xl font-bold text-ink-950 overflow-hidden border-4 border-ink-950"
            >
              <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="" class="h-full w-full object-cover" />
              <span v-else>{{ initial }}</span>
            </div>
            <div class="pb-2">
              <h1 class="text-3xl font-bold">{{ profile.displayName }}</h1>
              <div class="text-white/50 font-mono">@{{ profile.handle }}</div>
              <div v-if="profile.location" class="text-xs text-white/40 mt-1">📍 {{ profile.location }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="chip-glow">PULSE Athlete</span>
          </div>
        </div>

        <p v-if="profile.bio" class="mt-6 text-white/70 max-w-2xl">{{ profile.bio }}</p>

        <div v-if="profile.sports?.length" class="mt-4 flex flex-wrap gap-2">
          <span v-for="s in profile.sports" :key="s" class="chip">{{ s }}</span>
        </div>
      </div>
    </div>

    <section class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Total séances</div>
        <div class="mt-2 text-3xl font-bold gradient-text">{{ totals.count || 0 }}</div>
      </div>
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Distance cumulée</div>
        <div class="mt-2 text-3xl font-bold gradient-text">
          {{ Math.round(totals.distanceKm || 0) }} km
        </div>
      </div>
      <div class="glass p-5">
        <div class="text-xs uppercase tracking-[0.18em] text-white/40">Calories brûlées</div>
        <div class="mt-2 text-3xl font-bold gradient-text">
          {{ totals.calories || 0 }}
        </div>
      </div>
    </section>

    <section v-if="profile.goals?.length" class="mt-6 glass p-6">
      <h3 class="font-semibold">Objectifs</h3>
      <ul class="mt-3 grid sm:grid-cols-2 gap-2">
        <li v-for="g in profile.goals" :key="g" class="flex items-center gap-2 text-sm text-white/70">
          <span class="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          {{ g }}
        </li>
      </ul>
    </section>

    <section class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Dernières séances</h3>
      <div v-if="activities.length" class="grid gap-3">
        <div v-for="a in activities" :key="a._id" class="glass p-4 flex items-center gap-4">
          <div class="h-10 w-10 rounded-xl bg-cyan-400/10 grid place-items-center text-cyan-300">
            <IconRender name="pulse" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">{{ a.title }}</div>
            <div class="text-xs text-white/50 capitalize">
              {{ a.type }} · {{ formatRelative(a.performedAt) }}
            </div>
          </div>
          <div class="text-sm font-mono text-white/70">
            {{ formatDuration(a.durationMin) }}
            <span v-if="a.distanceKm > 0" class="text-white/40"> · {{ a.distanceKm }} km</span>
          </div>
        </div>
      </div>
      <div v-else class="glass p-8 text-center text-white/50">Pas encore de séance publique.</div>
    </section>

    <section v-if="profile.socials" class="mt-6 glass p-6">
      <h3 class="font-semibold">Réseaux</h3>
      <div class="mt-3 flex flex-wrap gap-3">
        <a v-if="profile.socials.instagram" :href="`https://instagram.com/${profile.socials.instagram.replace('@','')}`" target="_blank" class="chip hover:bg-white/10">Instagram · {{ profile.socials.instagram }}</a>
        <a v-if="profile.socials.strava" :href="`https://strava.com/athletes/${profile.socials.strava}`" target="_blank" class="chip hover:bg-white/10">Strava</a>
        <a v-if="profile.socials.website" :href="profile.socials.website" target="_blank" class="chip hover:bg-white/10">Website</a>
        <span v-if="!profile.socials.instagram && !profile.socials.strava && !profile.socials.website" class="text-sm text-white/40">Aucun réseau renseigné.</span>
      </div>
    </section>
  </section>
</template>
