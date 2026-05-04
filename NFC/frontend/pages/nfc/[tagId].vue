<script setup lang="ts">
const route = useRoute();
const api = useApi();
const error = ref('');
const data = ref<any>(null);
const loading = ref(true);
const countdown = ref(3);

useSeoMeta({ title: 'Tap NFC — PULSE' });

onMounted(async () => {
  try {
    const r = await api.post<any>(`/public/nfc/${route.params.tagId}/tap`);
    data.value = r;
    const interval = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(interval);
        const target = r.redirect || '/';
        if (target.startsWith('http')) {
          window.location.href = target;
        } else {
          navigateTo(target);
        }
      }
    }, 1000);
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Bracelet introuvable';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="container-pulse py-24 grid place-items-center">
    <div class="glass-strong relative overflow-hidden p-12 max-w-md w-full text-center">
      <div class="absolute inset-0 bg-aurora opacity-30 animate-pulse-slow" />
      <div class="relative">
        <div
          class="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-ink-950 text-3xl font-bold relative"
        >
          <span class="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
          NFC
        </div>

        <p class="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">Signal détecté</p>
        <h1 class="mt-2 text-3xl font-bold">Tap reconnu</h1>

        <div v-if="loading" class="mt-6 text-white/60">Lecture du tag…</div>

        <template v-else-if="data">
          <p class="mt-3 text-white/70">
            Bracelet <span class="font-mono text-cyan-300">#{{ data.bracelet?.tagId }}</span>
          </p>
          <p class="text-sm text-white/50">{{ data.bracelet?.tapCount }} taps cumulés</p>

          <div class="mt-8 glass p-4 text-sm text-white/70">
            Redirection vers
            <span class="font-mono text-cyan-300">{{ data.redirect }}</span>
            dans <span class="text-white">{{ countdown }}s</span>
          </div>

          <NuxtLink :to="data.redirect" class="btn-primary mt-6 inline-flex">
            Y aller maintenant
          </NuxtLink>
        </template>

        <template v-else-if="error">
          <p class="mt-6 text-rose-400">{{ error }}</p>
          <NuxtLink to="/" class="btn-ghost mt-4 inline-flex">Retour</NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>
