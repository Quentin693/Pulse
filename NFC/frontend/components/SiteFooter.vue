<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-24 border-t border-white/5">
    <div class="container-pulse py-12 grid gap-10 md:grid-cols-4">
      <div class="md:col-span-2">
        <PulseLogo />
        <p class="mt-4 max-w-md text-sm text-white/60">
          PULSE — un bracelet NFC pensé pour les athlètes connectés. Tape, suis,
          partage. Ton corps devient ta signature numérique.
        </p>
      </div>
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          Produit
        </h4>
        <ul class="mt-4 space-y-2 text-sm text-white/70">
          <li><NuxtLink to="/shop">Boutique</NuxtLink></li>
          <li><NuxtLink to="/features">Fonctionnalités</NuxtLink></li>
          <li><NuxtLink to="/about">À propos</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          Compte
        </h4>
        <ul class="mt-4 space-y-2 text-sm text-white/70">
          <li><NuxtLink to="/login">Connexion</NuxtLink></li>
          <li><NuxtLink to="/register">Créer un compte</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/5">
      <div class="container-pulse py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <span>© {{ year }} PULSE — Projet pédagogique. Concept NFC fitness/lifestyle.</span>
        <span class="font-mono tracking-widest">v1.0.0 — built with care</span>
      </div>
    </div>
  </footer>
</template>
