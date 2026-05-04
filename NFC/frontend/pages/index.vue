<script setup lang="ts">
const api = useApi();

const { data: heroData } = await useAsyncData('home-hero', async () => {
  try {
    const r = await api.get<{ item: any }>('/content/home.hero');
    return r.item;
  } catch {
    return null;
  }
});

const { data: featuresData } = await useAsyncData('home-features', async () => {
  try {
    const r = await api.get<{ item: any }>('/content/home.features');
    return r.item;
  } catch {
    return null;
  }
});

const { data: faqData } = await useAsyncData('home-faq', async () => {
  try {
    const r = await api.get<{ item: any }>('/content/home.faq');
    return r.item;
  } catch {
    return null;
  }
});

const { data: testimonialsData } = await useAsyncData('home-testimonials', async () => {
  try {
    const r = await api.get<{ item: any }>('/content/home.testimonials');
    return r.item;
  } catch {
    return null;
  }
});

const { data: productsData } = await useAsyncData('home-products', async () => {
  try {
    const r = await api.get<{ items: any[] }>('/products?featured=true');
    return r.items;
  } catch {
    return [];
  }
});

const heroTitle = computed(() => heroData.value?.title || 'Ton corps. Ton signal.');
const heroSubtitle = computed(
  () =>
    heroData.value?.subtitle ||
    "PULSE est le bracelet NFC qui transforme chaque mouvement en signature numérique."
);

useSeoMeta({
  title: 'PULSE — Bracelet NFC fitness & lifestyle',
  description:
    'Tape, suis, partage. PULSE relie ton corps à ton univers digital en un geste.',
});
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 grid-bg opacity-60" />
    <div class="container-pulse relative pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 items-center gap-12">
      <div class="space-y-8">
        <span class="chip-glow">
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Nouveau — Édition Aurora limitée
        </span>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
          {{ heroTitle.split('.')[0] }}.<br />
          <span class="gradient-text">{{ heroTitle.split('.').slice(1).join('.').trim() || 'Ton signal.' }}</span>
        </h1>
        <p class="text-lg text-white/70 max-w-xl">
          {{ heroSubtitle }}
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink to="/shop" class="btn-primary">
            Découvrir la boutique
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/features" class="btn-outline">Comment ça marche</NuxtLink>
        </div>
        <dl class="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
          <div>
            <dt class="text-xs uppercase tracking-[0.18em] text-white/40">Athlètes</dt>
            <dd class="mt-1 text-2xl font-semibold gradient-text">12.4K</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.18em] text-white/40">Taps / mois</dt>
            <dd class="mt-1 text-2xl font-semibold gradient-text">240K</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.18em] text-white/40">Note</dt>
            <dd class="mt-1 text-2xl font-semibold gradient-text">4.9★</dd>
          </div>
        </dl>
      </div>

      <HeroBracelet />
    </div>
  </section>

  <section v-if="featuresData" class="container-pulse py-20">
    <div class="max-w-2xl">
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Expérience</p>
      <h2 class="mt-3 text-4xl font-bold">{{ featuresData.title }}</h2>
      <p class="mt-3 text-white/60">{{ featuresData.subtitle }}</p>
    </div>
    <div class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="(f, i) in featuresData.items"
        :key="i"
        class="glass relative p-6 group hover:bg-white/[0.06] transition-colors"
      >
        <div
          class="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 grid place-items-center text-cyan-300 mb-4 group-hover:scale-105 transition-transform"
        >
          <IconRender :name="f.icon" />
        </div>
        <h3 class="font-semibold text-lg">{{ f.title }}</h3>
        <p class="mt-2 text-sm text-white/60">{{ f.text }}</p>
      </article>
    </div>
  </section>

  <section class="container-pulse py-20">
    <div class="glass-strong overflow-hidden relative">
      <div class="absolute inset-0 bg-aurora opacity-30" />
      <div class="relative grid lg:grid-cols-2 gap-10 p-10 lg:p-14 items-center">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-violet-400">Cas d'usage</p>
          <h2 class="mt-3 text-4xl font-bold">Un geste. Mille interactions.</h2>
          <ul class="mt-6 space-y-4">
            <li class="flex gap-3">
              <div class="mt-1 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,230,241,0.8)]" />
              <div>
                <strong class="text-white">Tap au gym</strong>
                <p class="text-sm text-white/60">Démarre une séance, lance un workout, log automatique.</p>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="mt-1 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(155,108,255,0.8)]" />
              <div>
                <strong class="text-white">Tap au running</strong>
                <p class="text-sm text-white/60">Ouvre ta page d'activité, partage en un instant à un partenaire.</p>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
              <div>
                <strong class="text-white">Tap social</strong>
                <p class="text-sm text-white/60">Partage ton profil athlète sans réseau social ni numéro.</p>
              </div>
            </li>
          </ul>
          <NuxtLink to="/features" class="btn-ghost mt-8 inline-flex">
            Toutes les fonctionnalités
          </NuxtLink>
        </div>
        <div class="relative">
          <div class="glass p-6 space-y-3 -rotate-2 hover:rotate-0 transition-transform">
            <div class="flex items-center justify-between">
              <span class="text-xs uppercase tracking-[0.18em] text-white/40">Aujourd'hui</span>
              <span class="chip">+18% vs semaine passée</span>
            </div>
            <h3 class="text-2xl font-bold">42 min · 7,8 km</h3>
            <div class="h-24 grid grid-cols-12 items-end gap-1.5">
              <div
                v-for="i in 12"
                :key="i"
                class="rounded-t bg-gradient-to-t from-cyan-400/40 to-violet-500/80"
                :style="{ height: `${30 + (i * 17) % 70}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-white/50">
              <span>06:00</span><span>10:00</span><span>14:00</span><span>18:00</span>
            </div>
          </div>
          <div class="glass p-5 mt-4 rotate-2 hover:rotate-0 transition-transform flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center font-bold text-ink-950">
              L
            </div>
            <div>
              <div class="text-sm font-semibold">Tap reçu de Léna</div>
              <div class="text-xs text-white/50">Profil partagé · il y a 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-if="productsData?.length" class="container-pulse py-20">
    <div class="flex items-end justify-between gap-6 flex-wrap mb-10">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Boutique</p>
        <h2 class="mt-3 text-4xl font-bold">Choisis ton PULSE</h2>
      </div>
      <NuxtLink to="/shop" class="btn-ghost">Tout voir</NuxtLink>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="p in productsData" :key="p._id" :product="p" />
    </div>
  </section>

  <section v-if="testimonialsData" class="container-pulse py-20">
    <div class="max-w-2xl">
      <p class="text-xs uppercase tracking-[0.3em] text-violet-400">Communauté</p>
      <h2 class="mt-3 text-4xl font-bold">{{ testimonialsData.title }}</h2>
      <p class="mt-3 text-white/60">{{ testimonialsData.subtitle }}</p>
    </div>
    <div class="mt-10 grid gap-4 md:grid-cols-3">
      <figure
        v-for="(t, i) in testimonialsData.items"
        :key="i"
        class="glass p-6 space-y-4"
      >
        <svg class="text-cyan-400/60" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 7H6a3 3 0 00-3 3v4h3v-4h3V7zM18 7h-3a3 3 0 00-3 3v4h3v-4h3V7z" />
        </svg>
        <blockquote class="text-white/80 leading-relaxed">"{{ t.quote }}"</blockquote>
        <figcaption class="flex items-center gap-3 pt-3 border-t border-white/5">
          <div class="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center font-bold text-ink-950 text-sm">
            {{ t.name[0] }}
          </div>
          <div>
            <div class="text-sm font-semibold">{{ t.name }}</div>
            <div class="text-xs text-white/50">{{ t.role }}</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </section>

  <section v-if="faqData" class="container-pulse py-20">
    <div class="max-w-3xl mx-auto text-center mb-10">
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">FAQ</p>
      <h2 class="mt-3 text-4xl font-bold">{{ faqData.title }}</h2>
    </div>
    <div class="max-w-3xl mx-auto space-y-3">
      <details
        v-for="(f, i) in faqData.items"
        :key="i"
        class="glass p-5 group"
      >
        <summary class="cursor-pointer list-none flex items-center justify-between gap-4">
          <span class="font-semibold">{{ f.q }}</span>
          <span class="text-cyan-400 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
        </summary>
        <p class="mt-3 text-sm text-white/60">{{ f.a }}</p>
      </details>
    </div>
  </section>

  <section class="container-pulse pb-20">
    <div class="glass-strong relative overflow-hidden p-10 lg:p-16 text-center">
      <div class="absolute inset-0 bg-aurora opacity-30" />
      <div class="relative">
        <h2 class="text-4xl lg:text-5xl font-bold">Prêt à transmettre ton signal ?</h2>
        <p class="mt-4 text-white/70 max-w-xl mx-auto">
          Active ton PULSE en moins de 2 minutes. Pas d'appli. Pas de friction. Juste un tap.
        </p>
        <div class="mt-8 flex justify-center gap-3 flex-wrap">
          <NuxtLink to="/register" class="btn-primary">Créer mon compte</NuxtLink>
          <NuxtLink to="/shop" class="btn-ghost">Voir les bracelets</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
