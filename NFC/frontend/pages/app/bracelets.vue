<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app' });
useSeoMeta({ title: 'Bracelets — PULSE' });

const api = useApi();
const items = ref<any[]>([]);
const form = reactive({
  tagId: '',
  nickname: 'Mon PULSE',
  color: 'cyan',
  edition: 'Core',
  mode: 'profile',
  targetUrl: '',
});
const error = ref('');
const submitting = ref(false);

async function load() {
  const r = await api.get<{ items: any[] }>('/bracelets');
  items.value = r.items;
}

async function create() {
  submitting.value = true;
  error.value = '';
  try {
    await api.post('/bracelets', { ...form });
    form.tagId = '';
    form.targetUrl = '';
    await load();
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur';
  } finally {
    submitting.value = false;
  }
}

async function update(b: any, patch: any) {
  await api.patch(`/bracelets/${b.id}`, patch);
  await load();
}

async function remove(b: any) {
  if (!confirm(`Supprimer ${b.nickname} ?`)) return;
  await api.del(`/bracelets/${b.id}`);
  await load();
}

const config = useRuntimeConfig();
const tapBase = computed(() => `${config.public.apiBase}/public/nfc/`);

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Bracelets NFC</h1>
      <p class="text-white/60">Associe et configure tes objets PULSE.</p>
    </div>

    <form class="glass-strong p-6 grid md:grid-cols-6 gap-3" @submit.prevent="create">
      <div class="md:col-span-2">
        <label class="label">Tag NFC</label>
        <input
          v-model="form.tagId"
          required
          minlength="4"
          maxlength="40"
          class="input font-mono uppercase"
          placeholder="ABC123"
        />
      </div>
      <div class="md:col-span-2">
        <label class="label">Surnom</label>
        <input v-model="form.nickname" maxlength="40" class="input" placeholder="Mon PULSE Core" />
      </div>
      <div>
        <label class="label">Édition</label>
        <select v-model="form.edition" class="input">
          <option>Core</option>
          <option>Pro</option>
          <option>Edge</option>
        </select>
      </div>
      <div>
        <label class="label">Mode</label>
        <select v-model="form.mode" class="input">
          <option value="profile">Profil public</option>
          <option value="workout">Workout</option>
          <option value="custom">URL custom</option>
        </select>
      </div>
      <div v-if="form.mode === 'custom'" class="md:col-span-6">
        <label class="label">URL de redirection</label>
        <input v-model="form.targetUrl" type="url" class="input" placeholder="https://…" />
      </div>
      <p v-if="error" class="md:col-span-6 text-sm text-rose-400">{{ error }}</p>
      <button type="submit" class="md:col-span-6 btn-primary" :disabled="submitting">
        {{ submitting ? '…' : 'Associer ce bracelet' }}
      </button>
    </form>

    <div class="grid gap-4 md:grid-cols-2">
      <article
        v-for="b in items"
        :key="b.id"
        class="glass relative overflow-hidden p-6"
      >
        <div class="absolute inset-0 bg-aurora opacity-20" />
        <div class="relative space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
            <div class="flex-1">
              <div class="font-semibold">{{ b.nickname }}</div>
              <div class="text-xs text-white/50 font-mono">#{{ b.tagId }}</div>
            </div>
            <span class="chip" :class="b.active ? 'border-cyan-400/30 text-cyan-300' : 'text-white/40'">
              {{ b.active ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="glass p-3">
              <div class="text-xs text-white/40">Mode</div>
              <div class="text-sm font-semibold capitalize">{{ b.mode }}</div>
            </div>
            <div class="glass p-3">
              <div class="text-xs text-white/40">Taps</div>
              <div class="text-sm font-semibold">{{ b.tapCount }}</div>
            </div>
            <div class="glass p-3">
              <div class="text-xs text-white/40">Édition</div>
              <div class="text-sm font-semibold">{{ b.edition }}</div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2">
            <NuxtLink
              :to="`/nfc/${b.tagId}`"
              class="btn-outline text-xs"
              target="_blank"
            >
              Simuler un tap
            </NuxtLink>
            <div class="flex items-center gap-2">
              <button
                class="text-xs text-white/60 hover:text-white px-3 py-1"
                @click="update(b, { active: !b.active })"
              >
                {{ b.active ? 'Désactiver' : 'Activer' }}
              </button>
              <button
                class="text-xs text-white/30 hover:text-rose-400 px-3 py-1"
                @click="remove(b)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </article>

      <div v-if="items.length === 0" class="glass p-12 text-center text-white/60 md:col-span-2">
        Aucun bracelet associé. Saisis un tag NFC ci-dessus.
      </div>
    </div>
  </div>
</template>
