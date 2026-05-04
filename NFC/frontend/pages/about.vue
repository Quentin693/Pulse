<script setup lang="ts">
useSeoMeta({
  title: 'À propos — PULSE',
  description: 'L\'histoire et la mission de PULSE.',
});

const team = [
  { name: 'Maya', role: 'CEO & Athlète', initial: 'M' },
  { name: 'Théo', role: 'Lead Hardware', initial: 'T' },
  { name: 'Sara', role: 'Product designer', initial: 'S' },
  { name: 'Karim', role: 'Backend architect', initial: 'K' },
];

const values = [
  { title: 'Mouvement', text: 'Le sport n\'est pas une donnée. C\'est une émotion.' },
  { title: 'Confiance', text: 'Tu décides ce qui sort, ce qui reste, ce qui se partage.' },
  { title: 'Simplicité', text: 'Un tap. Pas dix écrans. PULSE doit disparaître pour mieux servir.' },
];
</script>

<template>
  <section class="container-pulse py-20">
    <div class="max-w-3xl">
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">À propos</p>
      <h1 class="mt-3 text-5xl lg:text-6xl font-bold leading-tight">
        On a créé PULSE parce qu'on en avait <span class="gradient-text">marre</span>
        des appareils qui parlent à notre place.
      </h1>
      <p class="mt-8 text-white/70 text-lg leading-relaxed">
        Athlètes amateurs et créateurs de produit, on voulait un objet qui valorise le geste,
        pas le data dashboard. PULSE est né d'un week-end de hackathon : un bracelet NFC qui
        ouvre des univers digitaux selon le contexte. Aujourd'hui, on construit l'identité
        numérique du mouvement.
      </p>
    </div>
  </section>

  <section class="container-pulse py-12">
    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="v in values" :key="v.title" class="glass p-6 hover:bg-white/[0.06] transition-colors">
        <h3 class="font-semibold gradient-text text-xl">{{ v.title }}</h3>
        <p class="mt-2 text-sm text-white/60">{{ v.text }}</p>
      </div>
    </div>
  </section>

  <section class="container-pulse py-12">
    <h2 class="text-3xl font-bold">L'équipe</h2>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="m in team" :key="m.name" class="glass p-6 text-center">
        <div
          class="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-3xl font-bold text-ink-950"
        >
          {{ m.initial }}
        </div>
        <div class="mt-4 font-semibold">{{ m.name }}</div>
        <div class="text-xs text-white/50">{{ m.role }}</div>
      </div>
    </div>
  </section>

  <section class="container-pulse py-12">
    <div class="glass-strong relative overflow-hidden p-10 lg:p-14">
      <div class="absolute inset-0 bg-aurora opacity-30" />
      <div class="relative grid lg:grid-cols-3 gap-8 items-end">
        <div class="lg:col-span-2">
          <h2 class="text-4xl font-bold">Notre roadmap</h2>
          <p class="mt-3 text-white/70">Quelques jalons publics en cours.</p>
        </div>
        <div class="grid gap-3">
          <div class="glass p-4 flex items-center justify-between">
            <span class="text-sm">Q2 — Apple Watch sync</span>
            <span class="chip-glow text-[10px]">en cours</span>
          </div>
          <div class="glass p-4 flex items-center justify-between">
            <span class="text-sm">Q3 — Coach IA personnalisé</span>
            <span class="chip text-[10px]">à venir</span>
          </div>
          <div class="glass p-4 flex items-center justify-between">
            <span class="text-sm">Q4 — Édition Aurora limitée</span>
            <span class="chip text-[10px]">design</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
