<script setup lang="ts">
const props = defineProps<{ error: any }>();
const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout>
    <section class="container-pulse py-32 text-center">
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Erreur</p>
      <h1 class="mt-4 text-7xl font-bold gradient-text">{{ error.statusCode || 500 }}</h1>
      <p class="mt-4 text-white/70 max-w-md mx-auto">
        {{ error.statusMessage || error.message || 'Une perturbation du signal est survenue.' }}
      </p>
      <button class="btn-primary mt-8" @click="handleError">Retour à l'accueil</button>
    </section>
  </NuxtLayout>
</template>
