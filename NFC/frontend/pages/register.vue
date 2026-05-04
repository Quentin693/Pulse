<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

useSeoMeta({ title: 'Inscription — PULSE' });

const auth = useAuthStore();

const form = reactive({
  email: '',
  password: '',
  handle: '',
  displayName: '',
});
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await auth.register({
      email: form.email,
      password: form.password,
      handle: form.handle.toLowerCase(),
      displayName: form.displayName,
    });
    await navigateTo('/app/dashboard');
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Inscription impossible';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="container-pulse py-20 grid lg:grid-cols-2 gap-12 items-center">
    <div class="hidden lg:block">
      <p class="text-xs uppercase tracking-[0.3em] text-violet-400">Rejoindre</p>
      <h1 class="mt-3 text-5xl font-bold leading-tight">
        Active ton <span class="gradient-text">signal</span>.
      </h1>
      <p class="mt-6 text-white/60 max-w-md">
        Crée un compte, associe ton bracelet, et lance ta première séance en moins
        de deux minutes.
      </p>
      <ul class="mt-8 space-y-3 text-sm text-white/70">
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Profil public partageable
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-violet-400" /> Suivi d'activité illimité
        </li>
        <li class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Multi-bracelets NFC
        </li>
      </ul>
    </div>

    <form class="glass-strong p-8 space-y-5" @submit.prevent="submit">
      <h2 class="text-2xl font-bold">Créer un compte</h2>
      <div>
        <label class="label">Nom affiché</label>
        <input v-model="form.displayName" required minlength="2" maxlength="60" class="input" placeholder="Léna R." />
      </div>
      <div>
        <label class="label">Handle public</label>
        <div class="flex items-center glass overflow-hidden">
          <span class="px-3 text-white/40 font-mono text-sm">/u/</span>
          <input
            v-model="form.handle"
            required
            minlength="3"
            maxlength="24"
            pattern="[a-z0-9_-]+"
            class="flex-1 bg-transparent px-2 py-3 text-sm focus:outline-none lowercase"
            placeholder="lena.r"
          />
        </div>
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="form.email" type="email" required class="input" />
      </div>
      <div>
        <label class="label">Mot de passe</label>
        <input v-model="form.password" type="password" required minlength="8" class="input" placeholder="8 caractères min." />
      </div>
      <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>
      <button class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Création…' : 'Créer mon compte' }}
      </button>
      <p class="text-center text-sm text-white/50">
        Déjà inscrit ?
        <NuxtLink to="/login" class="text-cyan-300 hover:text-cyan-200">Connexion</NuxtLink>
      </p>
    </form>
  </section>
</template>
