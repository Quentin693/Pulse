<script setup lang="ts">
useSeoMeta({
  title: 'Fonctionnalités — PULSE',
  description: 'Découvre toutes les fonctionnalités du bracelet NFC PULSE.',
});

const sections = [
  {
    label: '01',
    title: 'Tap & track',
    text:
      'Approche ton bracelet de ton téléphone pour démarrer ou clôturer une séance. Les données sont synchronisées instantanément vers ton espace SaaS.',
    bullets: ['Détection sans appli native', 'Modes profile / workout / custom', 'Compteur de taps intégré'],
  },
  {
    label: '02',
    title: 'Profil partageable',
    text:
      'Une page publique designée pour valoriser ton parcours sportif. Photo, sports, objectifs, performances récentes — tout est customisable.',
    bullets: ['URL personnalisée /u/handle', 'Visibilité publique on/off', 'Compatible QR + NFC'],
  },
  {
    label: '03',
    title: 'Suivi d\'activité',
    text:
      'Course, vélo, muscu, yoga, HIIT… enregistre tes séances avec durée, distance, calories et intensité. Visualise tes statistiques cumulées.',
    bullets: ['8 types de sports', 'Filtres + agrégations', 'Stats publiques optionnelles'],
  },
  {
    label: '04',
    title: 'Identité numérique',
    text:
      'Ton PULSE devient une signature : 1 ID NFC, des modes, une URL, et toi seul peux décider ce qui s\'affiche au tap suivant.',
    bullets: ['Multi-bracelets', 'Mode redirection custom', 'Rotation des contenus'],
  },
];
</script>

<template>
  <section class="container-pulse py-20">
    <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Fonctionnalités</p>
    <h1 class="mt-3 text-5xl lg:text-6xl font-bold leading-tight">
      Une <span class="gradient-text">expérience NFC</span><br />pensée pour bouger.
    </h1>
    <p class="mt-6 text-white/60 max-w-2xl">
      PULSE n'est pas une montre. C'est une signature. Tape, pousse ton signal vers le monde
      digital, et garde la main sur ce que tu partages.
    </p>
  </section>

  <section class="container-pulse pb-24">
    <div class="grid gap-6">
      <article
        v-for="(s, i) in sections"
        :key="s.label"
        class="glass relative overflow-hidden p-8 lg:p-12 grid lg:grid-cols-12 gap-8 items-center"
      >
        <div class="lg:col-span-5">
          <span class="font-mono text-cyan-400 text-sm tracking-[0.3em]">{{ s.label }}</span>
          <h2 class="mt-3 text-3xl lg:text-4xl font-bold">{{ s.title }}</h2>
          <p class="mt-4 text-white/70">{{ s.text }}</p>
          <ul class="mt-6 space-y-2">
            <li
              v-for="b in s.bullets"
              :key="b"
              class="flex items-center gap-2 text-sm text-white/60"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
              {{ b }}
            </li>
          </ul>
        </div>
        <div class="lg:col-span-7 relative">
          <div class="aspect-video glass-strong overflow-hidden relative">
            <div class="absolute inset-0 bg-aurora opacity-30" />
            <div class="absolute inset-0 grid-bg" />
            <div class="relative h-full flex items-center justify-center">
              <div class="font-mono text-9xl gradient-text opacity-40">
                {{ s.label }}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
