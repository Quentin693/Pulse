<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

useSeoMeta({ title: 'Connexion — PULSE' });

const auth = useAuthStore();
const route = useRoute();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(form.email, form.password);
    const redirect = (route.query.redirect as string) || '/app/dashboard';
    await navigateTo(redirect);
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Identifiants invalides';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="container-pulse py-20 grid lg:grid-cols-2 gap-12 items-center">
    <div class="hidden lg:block">
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Reconnexion</p>
      <h1 class="mt-3 text-5xl font-bold leading-tight">
        Bon retour parmi <span class="gradient-text">les athlètes</span>.
      </h1>
      <p class="mt-6 text-white/60 max-w-md">
        Connecte-toi pour reprendre le suivi, gérer tes bracelets et finaliser tes commandes.
      </p>
      <div class="mt-12 grid grid-cols-3 gap-3 text-center">
        <div class="glass p-4"><div class="text-2xl font-bold gradient-text">12.4K</div><div class="text-xs text-white/50">Athlètes</div></div>
        <div class="glass p-4"><div class="text-2xl font-bold gradient-text">240K</div><div class="text-xs text-white/50">Taps</div></div>
        <div class="glass p-4"><div class="text-2xl font-bold gradient-text">4.9★</div><div class="text-xs text-white/50">Note</div></div>
      </div>
    </div>

    <form class="glass-strong p-8 space-y-5" @submit.prevent="submit">
      <h2 class="text-2xl font-bold">Connexion</h2>
      <div>
        <label class="label">Email</label>
        <input v-model="form.email" type="email" required class="input" placeholder="toi@pulse.app" />
      </div>
      <div>
        <label class="label">Mot de passe</label>
        <input v-model="form.password" type="password" required class="input" placeholder="••••••••" />
      </div>
      <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>
      <button class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>
      <p class="text-center text-sm text-white/50">
        Pas encore de compte ?
        <NuxtLink to="/register" class="text-cyan-300 hover:text-cyan-200">Créer un compte</NuxtLink>
      </p>
      <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-xs text-white/50">
        Démo : <span class="font-mono text-cyan-300">demo@pulse.app</span> /
        <span class="font-mono text-cyan-300">demo1234</span>
      </div>
    </form>
  </section>
</template>
