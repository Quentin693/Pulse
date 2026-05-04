<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: 'auth', layout: 'app' });
useSeoMeta({ title: 'Profil — PULSE' });

const auth = useAuthStore();

const form = reactive({
  displayName: auth.user?.displayName || '',
  bio: auth.user?.bio || '',
  location: auth.user?.location || '',
  avatarUrl: auth.user?.avatarUrl || '',
  bannerUrl: auth.user?.bannerUrl || '',
  publicProfile: auth.user?.publicProfile ?? true,
  sports: auth.user?.sports?.join(', ') || '',
  goals: auth.user?.goals?.join(', ') || '',
  socials: { ...(auth.user?.socials || { instagram: '', strava: '', website: '' }) },
});
const saving = ref(false);
const success = ref(false);
const error = ref('');

async function save() {
  saving.value = true;
  success.value = false;
  error.value = '';
  try {
    await auth.updateMe({
      displayName: form.displayName,
      bio: form.bio,
      location: form.location,
      avatarUrl: form.avatarUrl,
      bannerUrl: form.bannerUrl,
      publicProfile: form.publicProfile,
      sports: form.sports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      goals: form.goals
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      socials: form.socials,
    });
    success.value = true;
    setTimeout(() => (success.value = false), 2000);
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="save">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold">Profil</h1>
        <p class="text-white/60">Configure ton identité PULSE.</p>
      </div>
      <NuxtLink :to="`/u/${auth.user?.handle}`" class="btn-ghost" target="_blank">
        Voir ma page publique
      </NuxtLink>
    </div>

    <section class="glass-strong p-6 grid md:grid-cols-2 gap-5">
      <div>
        <label class="label">Nom affiché</label>
        <input v-model="form.displayName" required minlength="2" class="input" />
      </div>
      <div>
        <label class="label">Localisation</label>
        <input v-model="form.location" maxlength="80" class="input" placeholder="Paris, FR" />
      </div>
      <div class="md:col-span-2">
        <label class="label">Bio</label>
        <textarea v-model="form.bio" rows="3" maxlength="280" class="input" placeholder="Coureur, lecteur, dévoreur de cafés." />
      </div>
      <div>
        <label class="label">Avatar (URL)</label>
        <input v-model="form.avatarUrl" type="url" class="input" />
      </div>
      <div>
        <label class="label">Bannière (URL)</label>
        <input v-model="form.bannerUrl" type="url" class="input" />
      </div>
    </section>

    <section class="glass-strong p-6 grid md:grid-cols-2 gap-5">
      <div>
        <label class="label">Sports (séparés par virgule)</label>
        <input v-model="form.sports" class="input" placeholder="running, yoga, hiit" />
      </div>
      <div>
        <label class="label">Objectifs (séparés par virgule)</label>
        <input v-model="form.goals" class="input" placeholder="Marathon, 3 séances/sem" />
      </div>
      <div class="md:col-span-2 grid md:grid-cols-3 gap-4">
        <div>
          <label class="label">Instagram</label>
          <input v-model="form.socials.instagram" maxlength="60" class="input" />
        </div>
        <div>
          <label class="label">Strava</label>
          <input v-model="form.socials.strava" maxlength="60" class="input" />
        </div>
        <div>
          <label class="label">Site web</label>
          <input v-model="form.socials.website" maxlength="120" class="input" />
        </div>
      </div>
    </section>

    <section class="glass-strong p-6 flex items-center justify-between gap-6">
      <div>
        <h3 class="font-semibold">Profil public</h3>
        <p class="text-sm text-white/60">
          Permet à n'importe qui de visualiser ta page <code class="font-mono text-cyan-300">/u/{{ auth.user?.handle }}</code>.
        </p>
      </div>
      <button
        type="button"
        class="relative h-7 w-12 rounded-full transition-colors"
        :class="form.publicProfile ? 'bg-cyan-400/40' : 'bg-white/10'"
        @click="form.publicProfile = !form.publicProfile"
      >
        <span
          class="absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform"
          :class="form.publicProfile ? 'translate-x-5' : 'translate-x-0.5'"
        />
      </button>
    </section>

    <div class="flex items-center gap-4">
      <button type="submit" class="btn-primary" :disabled="saving">
        {{ saving ? 'Enregistrement…' : 'Enregistrer les changements' }}
      </button>
      <span v-if="success" class="text-cyan-300 text-sm">Sauvegardé ✓</span>
      <span v-if="error" class="text-rose-400 text-sm">{{ error }}</span>
    </div>
  </form>
</template>
